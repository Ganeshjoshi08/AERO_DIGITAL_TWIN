from typing import Dict, Any, Optional
from datetime import datetime
from .models import EngineState, ExpectedEngineState, SubsystemHealth, MissionContext, DigitalTwinOutput
from .operating_state import OperatingStateClassifier, OperatingMode, HealthState
from .performance import PerformanceModel
from .residuals import ResidualGenerator
from .health import HealthEngine
from .tracker import DegradationTracker

class DigitalTwinCore:
    """
    Main orchestrator for the AeroTwin Digital Twin Core.
    Maintains virtual engine state, runs update cycles, tracks degradation history,
    and supports what-if analysis.
    """

    def __init__(self, max_history_len: int = 500):
        self.tracker = DegradationTracker(max_history_len=max_history_len)
        self.current_state: Optional[EngineState] = None
        self.expected_state: Optional[ExpectedEngineState] = None
        self.last_residuals: Optional[Dict[str, float]] = None
        self.prev_throttle: Optional[float] = None

    def update(
        self, 
        raw_telemetry: Dict[str, Any], 
        mission: Optional[MissionContext] = None
    ) -> DigitalTwinOutput:
        """
        Executes a single step in the Digital Twin update cycle.
        
        :param raw_telemetry: Dict containing raw engine sensor telemetry fields.
        :param mission: Optional MissionContext (defaults to Standard Cruise).
        :return: A populated DigitalTwinOutput object.
        """
        # 1. Ingestion & Pydantic Validation (Checks types and ranges)
        actual_state = EngineState(**raw_telemetry)

        # 2. Operating State Classification
        active_mode = OperatingStateClassifier.classify_mode(
            rpm=actual_state.rpm,
            throttle=actual_state.throttle,
            engine_load=actual_state.engine_load,
            fuel_flow=actual_state.fuel_flow,
            prev_throttle=self.prev_throttle
        )
        self.prev_throttle = actual_state.throttle

        # 3. Physics & Performance Modeling (Deterministic Expectation Calculations)
        expected_state = PerformanceModel.calculate_expected_state(actual_state)

        # 4. Residual Generator
        residuals = ResidualGenerator.calculate_residuals(actual_state, expected_state)

        # 5. Subsystem Health Evaluation
        subsystems, health_index = HealthEngine.evaluate_health(actual_state, residuals)

        # 6. Overall Health State Classification
        # Calculate anomaly score (derived from residuals)
        # Simply the average normalized deviation of CHT, EGT, OP, and FF residuals
        normalized_cht = min(1.0, abs(residuals["cht"]) / 40.0)
        normalized_egt = min(1.0, abs(residuals["egt"]) / 200.0)
        normalized_op = min(1.0, abs(residuals["oil_pressure"]) / 25.0)
        normalized_ff = min(1.0, abs(residuals["fuel_flow"]) / 3.0)
        anomaly_score = round((normalized_cht + normalized_egt + normalized_op + normalized_ff) / 4.0, 2)

        health_state = OperatingStateClassifier.classify_health(
            overall_health=health_index,
            anomaly_score=anomaly_score,
            alternator_status=actual_state.alternator_status,
            oil_pressure=actual_state.oil_pressure,
            rpm=actual_state.rpm
        )

        # 7. Update Engine State model with classified states
        # Create updated state using model_copy (Pydantic v2 compatible)
        updated_actual_state = actual_state.model_copy(update={
            "operating_mode": active_mode.value,
            "health_state": health_state.value
        })

        # Save states locally in virtual core
        self.current_state = updated_actual_state
        self.expected_state = expected_state
        self.last_residuals = residuals

        # Default mission context if not provided
        active_mission = mission if mission is not None else MissionContext(
            altitude=actual_state.altitude,
            ambient_temperature=actual_state.ambient_temperature,
            ambient_pressure=actual_state.ambient_pressure
        )

        # Compile final structured output
        twin_output = DigitalTwinOutput(
            timestamp=datetime.now().isoformat(),
            current_engine_state=updated_actual_state,
            expected_engine_state=expected_state,
            residuals=residuals,
            operating_mode=active_mode.value,
            subsystem_health=subsystems,
            overall_health=health_index,
            degradation_indicators={
                "anomaly_score": anomaly_score,
                "degradation_rate": 0.0
            },
            mission_context=active_mission
        )

        # 8. Log output to Degradation Tracker
        self.tracker.add_record(twin_output)

        # Inject sliding degradation rate into output indicators
        twin_output.degradation_indicators["degradation_rate"] = self.tracker.calculate_degradation_rate()

        return twin_output

    def run_what_if(
        self, 
        target_rpm: float, 
        throttle: float, 
        altitude: float, 
        ambient_temp: float
    ) -> ExpectedEngineState:
        """
        Executes a thermodynamic performance estimation under hypothetical operating conditions
        without modifying the active engine state.
        """
        # Formulate hypothetical state container (using reasonable defaults for non-inputs)
        hypothetical_state = EngineState(
            rpm=target_rpm,
            throttle=throttle,
            engine_load=throttle * 1.04,
            map=1013.0 - (altitude / 30.0),
            cht=380.0,
            egt=1450.0,
            oil_pressure=65.0,
            oil_temperature=195.0,
            fuel_flow=12.4,
            fuel_pressure=45.0,
            vibration=1.2,
            battery_voltage=27.8,
            alternator_status="OK",
            ambient_temperature=ambient_temp,
            ambient_pressure=1013.0 - (altitude / 30.0),
            altitude=altitude
        )

        # Run PerformanceModel directly
        return PerformanceModel.calculate_expected_state(hypothetical_state)
