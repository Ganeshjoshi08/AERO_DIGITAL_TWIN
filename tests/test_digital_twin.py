import pytest
from pydantic import ValidationError
from digital_twin.models import EngineState, MissionContext, DigitalTwinOutput
from digital_twin.operating_state import OperatingStateClassifier, OperatingMode, HealthState
from digital_twin.physics import calculate_air_density, calculate_angular_velocity
from digital_twin.performance import PerformanceModel
from digital_twin.residuals import ResidualGenerator
from digital_twin.health import HealthEngine
from digital_twin.tracker import DegradationTracker
from digital_twin.core import DigitalTwinCore


# Dummy baseline telemetry data matching standard flight conditions
VALID_TELEMETRY = {
    "rpm": 2450.0,
    "throttle": 75.0,
    "engine_load": 78.0,
    "map": 1013.0,
    "cht": 380.0,
    "egt": 1450.0,
    "oil_pressure": 65.0,
    "oil_temperature": 195.0,
    "fuel_flow": 12.4,
    "fuel_pressure": 45.0,
    "vibration": 1.2,
    "battery_voltage": 27.8,
    "alternator_status": "OK",
    "ambient_temperature": -10.0,
    "ambient_pressure": 715.0,
    "altitude": 8500.0
}

# Telemetry matching expected performance values exactly (0 residuals, 100% health)
NOMINAL_TELEMETRY = {
    "rpm": 2233.0,
    "throttle": 75.0,
    "engine_load": 78.0,
    "map": 589.9,
    "cht": 317.1,
    "egt": 1280.0,
    "oil_pressure": 65.3,
    "oil_temperature": 195.0,
    "fuel_flow": 8.51,
    "fuel_pressure": 45.0,
    "vibration": 1.18,
    "battery_voltage": 27.8,
    "alternator_status": "OK",
    "ambient_temperature": -10.0,
    "ambient_pressure": 715.0,
    "altitude": 8500.0
}


def test_engine_state_validation():
    """1. Test Pydantic validation and bounds checks on EngineState."""
    # Ensure valid inputs succeed
    state = EngineState(**VALID_TELEMETRY)
    assert state.rpm == 2450.0
    assert state.alternator_status == "OK"

    # Out of limits RPM (max is 4000)
    invalid_data = VALID_TELEMETRY.copy()
    invalid_data["rpm"] = 5500.0
    with pytest.raises(ValidationError):
        EngineState(**invalid_data)

    # Negative throttle (min is 0)
    invalid_data = VALID_TELEMETRY.copy()
    invalid_data["throttle"] = -5.0
    with pytest.raises(ValidationError):
        EngineState(**invalid_data)


def test_operating_state_classification():
    """2. Test operating mode and health state classifications."""
    # Off
    assert OperatingStateClassifier.classify_mode(
        rpm=0.0, throttle=0.0, engine_load=0.0, fuel_flow=0.0
    ) == OperatingMode.ENGINE_OFF

    # Starting
    assert OperatingStateClassifier.classify_mode(
        rpm=500.0, throttle=10.0, engine_load=5.0, fuel_flow=0.8
    ) == OperatingMode.STARTING

    # Idle
    assert OperatingStateClassifier.classify_mode(
        rpm=1050.0, throttle=5.0, engine_load=12.0, fuel_flow=1.2
    ) == OperatingMode.IDLE

    # Cruise
    assert OperatingStateClassifier.classify_mode(
        rpm=2450.0, throttle=70.0, engine_load=72.0, fuel_flow=11.5
    ) == OperatingMode.CRUISE

    # High Load
    assert OperatingStateClassifier.classify_mode(
        rpm=2850.0, throttle=95.0, engine_load=92.0, fuel_flow=14.5
    ) == OperatingMode.HIGH_LOAD

    # Health Classifier check
    assert OperatingStateClassifier.classify_health(
        overall_health=95.0, anomaly_score=0.1, alternator_status="OK", oil_pressure=60.0, rpm=2450.0
    ) == HealthState.NOMINAL

    # Alternator failure active fault
    assert OperatingStateClassifier.classify_health(
        overall_health=95.0, anomaly_score=0.1, alternator_status="FAULT", oil_pressure=60.0, rpm=2450.0
    ) == HealthState.FAULT


def test_air_density_calculation():
    """3. Test physical air density calculations using the Ideal Gas Law."""
    # Standard Sea Level Atmosphere (15°C, 1013.25 hPa) -> Density should be ~1.225 kg/m^3
    rho = calculate_air_density(pressure_hpa=1013.25, temperature_c=15.0)
    assert abs(rho - 1.225) < 0.01

    # Check validation
    with pytest.raises(ValueError):
        calculate_air_density(pressure_hpa=-100.0, temperature_c=15.0)


def test_angular_velocity_conversion():
    """4. Test RPM to rad/s angular speed conversion."""
    # 0 RPM = 0 rad/s
    assert calculate_angular_velocity(0.0) == 0.0

    # 3000 RPM = 100*pi ~= 314.159 rad/s
    omega = calculate_angular_velocity(3000.0)
    assert abs(omega - 314.159) < 0.01

    with pytest.raises(ValueError):
        calculate_angular_velocity(-100.0)


def test_performance_model_expected_state():
    """5 & 6. Test expected state generation via PerformanceModel."""
    state = EngineState(**VALID_TELEMETRY)
    expected = PerformanceModel.calculate_expected_state(state)

    # Basic physical expectations check
    assert expected.rpm > 1000.0
    assert expected.fuel_flow > 0.0
    assert expected.egt > 600.0
    assert expected.cht > 100.0
    
    # Assert separation of concerns
    assert expected.cht != state.cht  # Expected and actual remain separate


def test_residual_calculation():
    """7. Test residuals generator output values."""
    actual = EngineState(**VALID_TELEMETRY)
    expected = PerformanceModel.calculate_expected_state(actual)
    
    residuals = ResidualGenerator.calculate_residuals(actual, expected)
    
    assert "rpm" in residuals
    assert "cht" in residuals
    assert "egt" in residuals
    assert "oil_pressure" in residuals

    # Verify calculation: Residual = Actual - Expected
    assert residuals["egt"] == round(actual.egt - expected.egt, 1)


def test_health_index_calculation():
    """8. Test HealthEngine scoring weights and deductions."""
    actual = EngineState(**VALID_TELEMETRY)
    
    # Under zero residuals, health should be 100
    zero_residuals = {
        "rpm": 0.0, "cht": 0.0, "egt": 0.0, "oil_pressure": 0.0, "fuel_flow": 0.0, "map": 0.0, "vibration": 0.0
    }
    subsystems, overall = HealthEngine.evaluate_health(actual, zero_residuals)
    assert overall == 100.0
    assert subsystems.thermal == 100.0

    # Add EGT residual deviation (+180 °F)
    anomalous_residuals = zero_residuals.copy()
    anomalous_residuals["egt"] = 180.0
    subsystems_anom, overall_anom = HealthEngine.evaluate_health(actual, anomalous_residuals)
    
    # Confirm deductions happened
    assert subsystems_anom.thermal < 100.0
    assert overall_anom < 100.0


def test_digital_twin_update_cycle():
    """9. Test orchestrator update loops and degradation tracking."""
    core = DigitalTwinCore()
    output = core.update(NOMINAL_TELEMETRY)

    assert isinstance(output, DigitalTwinOutput)
    assert output.overall_health == 100.0
    assert len(core.tracker.history) == 1

    # Telemetry update 2 with high EGT
    anomalous_telemetry = NOMINAL_TELEMETRY.copy()
    anomalous_telemetry["egt"] = 1560.0  # actual EGT spikes by 280°F above nominal
    
    output_anom = core.update(anomalous_telemetry)
    assert len(core.tracker.history) == 2
    # Health should drop due to EGT anomaly
    assert output_anom.overall_health < 100.0


def test_what_if_simulation():
    """10. Test isolated what-if simulation execution."""
    core = DigitalTwinCore()
    
    # Simulate high throttle, hot environment, high altitude
    expected_simulation = core.run_what_if(
        target_rpm=2700.0,
        throttle=95.0,
        altitude=12000.0,
        ambient_temp=35.0
    )

    # Physics performance model outputs deterministic governed expectation for 95% throttle
    assert expected_simulation.rpm == 2561.8
    assert expected_simulation.fuel_flow > 5.0
    assert expected_simulation.egt > 1000.0


def test_end_to_end_integration():
    """End-to-End Pipeline Verification: Telemetry -> validation -> models -> residuals -> health -> output packet."""
    core = DigitalTwinCore()
    
    # Ingest telemetry dictionary
    output = core.update(NOMINAL_TELEMETRY)
    
    # Check structure
    assert output.timestamp is not None
    assert output.current_engine_state.rpm == 2233.0
    assert output.expected_engine_state.rpm > 1000.0
    assert "egt" in output.residuals
    assert output.subsystem_health.mechanical == 100.0
    assert output.overall_health == 100.0
    
    # Verify Pydantic validation to JSON string
    json_str = output.model_dump_json()
    assert isinstance(json_str, str)
    assert "current_engine_state" in json_str
