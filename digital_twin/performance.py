from typing import Dict, Any
from .models import EngineState, ExpectedEngineState
from .physics import calculate_air_density

class PerformanceModel:
    """
    Computes expected engine variables (expected CHT, EGT, fuel flow, oil pressure, etc.)
    using deterministic engineering approximations.
    
    Assumptions & Calibration Constants:
    - Expected MAP: Throttle acts as a restrictor scaling ambient air pressure into the manifold.
    - Expected Fuel Flow: Proportional to throttle and RPM, adjusted for air density scaling at altitude.
    - Expected EGT: Driven by combustion power (throttle + RPM), cooling down slightly at higher altitudes.
    - Expected CHT: Driven by combustion power, cooled by ambient air temperature.
    - Expected Oil Pressure: Governed by mechanical pump RPM, with pressure decreasing as oil temperature rises.
    """

    # Manifold pressure calibration constants: MAP = ambient_press * (BASE + SCALE * throttle)
    MAP_BASE = 0.3
    MAP_SCALE = 0.7

    # Fuel flow calibration constants: FF = (BASE + THROTTLE_COEFF * throttle + RPM_COEFF * rpm) * air_density_ratio
    FF_BASE = 1.5
    FF_THROTTLE_COEFF = 0.105
    FF_RPM_COEFF = 0.00067  # (2.0 / 3000)

    # Exhaust gas temp constants: EGT = BASE + THROTTLE_COEFF * throttle + RPM_COEFF * rpm - ALT_COEFF * altitude
    EGT_BASE = 600.0
    EGT_THROTTLE_COEFF = 8.0
    EGT_RPM_COEFF = 0.05
    EGT_ALT_COEFF = 0.005

    # Cylinder head temp constants: CHT = BASE + THROTTLE_COEFF * throttle + AMBIENT_COEFF * ambient_temp_f
    CHT_BASE = 150.0
    CHT_THROTTLE_COEFF = 2.2
    CHT_AMBIENT_COEFF = 0.15

    # Oil pressure constants: OP = BASE + RPM_COEFF * rpm - TEMP_COEFF * (oil_temp - REF_TEMP)
    OP_BASE = 30.0
    OP_RPM_COEFF = 0.015
    OP_TEMP_COEFF = 0.1
    OP_REF_TEMP = 180.0

    # Vibration constants: VIB = BASE + RPM_COEFF * rpm
    VIB_BASE = 0.2
    VIB_RPM_COEFF = 0.0004

    @classmethod
    def calculate_expected_state(cls, actual: EngineState) -> ExpectedEngineState:
        """
        Generates the ExpectedEngineState representing normal nominal engine behavior
        under identical operating conditions.
        
        :param actual: The current actual EngineState telemetry.
        :return: ExpectedEngineState object.
        """
        # If engine is stopped/off, expected state parameters drop to zero/ambient equivalents
        if actual.rpm < 100.0:
            return ExpectedEngineState(
                rpm=0.0,
                fuel_flow=0.0,
                egt=actual.ambient_temperature * 1.8 + 32.0,  # Ambient in °F
                cht=actual.ambient_temperature * 1.8 + 32.0,
                engine_load=0.0,
                map=actual.ambient_pressure,
                oil_pressure=0.0,
                vibration=0.0
            )

        # Expected RPM based on throttle and commanded load
        expected_rpm = 1000.0 + (actual.throttle / 100.0) * 1800.0 - (actual.engine_load / 100.0) * 150.0
        expected_rpm = max(1000.0, min(3000.0, expected_rpm))

        # Expected MAP (Manifold Absolute Pressure)
        expected_map = actual.ambient_pressure * (cls.MAP_BASE + (actual.throttle / 100.0) * cls.MAP_SCALE)

        # Expected Fuel Flow, adjusted for air density (Ideal Gas Law helper)
        standard_air_density = 1.225  # kg/m^3 at sea level (15°C, 1013.25hPa)
        current_air_density = calculate_air_density(actual.ambient_pressure, actual.ambient_temperature)
        density_ratio = current_air_density / standard_air_density

        base_fuel_flow = cls.FF_BASE + (actual.throttle * cls.FF_THROTTLE_COEFF) + (actual.rpm * cls.FF_RPM_COEFF)
        expected_fuel_flow = max(0.0, base_fuel_flow * density_ratio)

        # Expected EGT
        expected_egt = cls.EGT_BASE + (actual.throttle * cls.EGT_THROTTLE_COEFF) + (actual.rpm * cls.EGT_RPM_COEFF) - (actual.altitude * cls.EGT_ALT_COEFF)

        # Expected CHT
        ambient_temp_f = actual.ambient_temperature * 1.8 + 32.0
        expected_cht = cls.CHT_BASE + (actual.throttle * cls.CHT_THROTTLE_COEFF) + (ambient_temp_f * cls.CHT_AMBIENT_COEFF)

        # Expected Oil Pressure
        expected_oil_pressure = cls.OP_BASE + (actual.rpm * cls.OP_RPM_COEFF) - (cls.OP_TEMP_COEFF * (actual.oil_temperature - cls.OP_REF_TEMP))
        expected_oil_pressure = max(5.0, expected_oil_pressure)

        # Expected Vibration
        expected_vibration = cls.VIB_BASE + (actual.rpm * cls.VIB_RPM_COEFF)

        # Expected Engine Load
        expected_engine_load = max(0.0, min(100.0, actual.throttle * 1.05))

        return ExpectedEngineState(
            rpm=round(expected_rpm, 1),
            fuel_flow=round(expected_fuel_flow, 2),
            egt=round(expected_egt, 1),
            cht=round(expected_cht, 1),
            engine_load=round(expected_engine_load, 1),
            map=round(expected_map, 1),
            oil_pressure=round(expected_oil_pressure, 1),
            vibration=round(expected_vibration, 2)
        )
