from typing import Dict, Any
from .models import EngineState, ExpectedEngineState, SubsystemHealth

class HealthEngine:
    """
    Evaluates individual subsystem health indices (0-100) based on telemetry residuals
    and baseline thresholds, and calculates the overall Engine Health Index.
    
    Disclaimer: Threshold limits are prototype models only and NOT certified safety parameters.
    """

    # Subsystem weights for overall health calculations
    # Mechanical and Lubrication have high weights because they are critical structural risks.
    WEIGHT_MECHANICAL = 0.25
    WEIGHT_COMBUSTION = 0.15
    WEIGHT_FUEL = 0.15
    WEIGHT_LUBRICATION = 0.20
    WEIGHT_THERMAL = 0.15
    WEIGHT_ELECTRICAL = 0.10

    # Warning limits for residuals (thresholds that trigger deductions)
    LIMIT_CHT_RESIDUAL_WARN = 15.0  # °F
    LIMIT_EGT_RESIDUAL_WARN = 80.0  # °F
    LIMIT_FF_RESIDUAL_WARN = 1.2    # GPH
    LIMIT_OP_RESIDUAL_WARN = 8.0    # PSI
    LIMIT_VIB_RESIDUAL_WARN = 0.6   # g

    # Configurable overall health rating bounds
    THRESHOLD_HEALTHY = 90.0
    THRESHOLD_MONITOR = 75.0
    THRESHOLD_DEGRADED = 50.0

    @classmethod
    def evaluate_health(
        cls, 
        actual: EngineState, 
        residuals: Dict[str, float]
    ) -> tuple[SubsystemHealth, float]:
        """
        Runs the diagnostic scoring algorithms across subsystems.
        
        :param actual: Current actual EngineState.
        :param residuals: The calculated residuals dictionary.
        :return: A tuple of (SubsystemHealth object, overall_health_score).
        """
        # If engine is off, maintain previous health states (defaulting to 100)
        if actual.rpm < 100.0:
            return SubsystemHealth(), 100.0

        # 1. Thermal Subsystem
        cht_res = abs(residuals.get("cht", 0.0))
        egt_res = abs(residuals.get("egt", 0.0))
        thermal_deduction = 0.0
        if cht_res > cls.LIMIT_CHT_RESIDUAL_WARN:
            thermal_deduction += (cht_res - cls.LIMIT_CHT_RESIDUAL_WARN) * 2.5
        if egt_res > cls.LIMIT_EGT_RESIDUAL_WARN:
            thermal_deduction += (egt_res - cls.LIMIT_EGT_RESIDUAL_WARN) * 0.35
        thermal_health = max(0.0, min(100.0, 100.0 - thermal_deduction))

        # 2. Combustion Subsystem
        # Combustion degradation correlates with EGT anomalies or unstable idle speed
        combustion_deduction = 0.0
        if egt_res > cls.LIMIT_EGT_RESIDUAL_WARN:
            combustion_deduction += (egt_res - cls.LIMIT_EGT_RESIDUAL_WARN) * 0.25
        if abs(residuals.get("rpm", 0.0)) > 150.0:
            combustion_deduction += (abs(residuals.get("rpm", 0.0)) - 150.0) * 0.1
        combustion_health = max(0.0, min(100.0, 100.0 - combustion_deduction))

        # 3. Fuel System Subsystem
        ff_res = abs(residuals.get("fuel_flow", 0.0))
        fuel_deduction = 0.0
        if ff_res > cls.LIMIT_FF_RESIDUAL_WARN:
            fuel_deduction += (ff_res - cls.LIMIT_FF_RESIDUAL_WARN) * 15.0
        if actual.fuel_pressure < 30.0 or actual.fuel_pressure > 60.0:
            fuel_deduction += 15.0
        fuel_health = max(0.0, min(100.0, 100.0 - fuel_deduction))

        # 4. Lubrication Subsystem
        op_res = abs(residuals.get("oil_pressure", 0.0))
        lub_deduction = 0.0
        if op_res > cls.LIMIT_OP_RESIDUAL_WARN:
            # High penalty for lubrication loss
            lub_deduction += (op_res - cls.LIMIT_OP_RESIDUAL_WARN) * 3.5
        if actual.oil_pressure < 40.0:
            lub_deduction += (40.0 - actual.oil_pressure) * 4.0
        if actual.oil_temperature > 230.0:
            lub_deduction += (actual.oil_temperature - 230.0) * 1.5
        lub_health = max(0.0, min(100.0, 100.0 - lub_deduction))

        # 5. Mechanical Subsystem
        vib_res = abs(residuals.get("vibration", 0.0))
        mech_deduction = 0.0
        if vib_res > cls.LIMIT_VIB_RESIDUAL_WARN:
            mech_deduction += (vib_res - cls.LIMIT_VIB_RESIDUAL_WARN) * 30.0
        if actual.vibration > 2.5:
            mech_deduction += (actual.vibration - 2.5) * 20.0
        mech_health = max(0.0, min(100.0, 100.0 - mech_deduction))

        # 6. Electrical Subsystem
        elec_health = 100.0
        if actual.alternator_status == "FAULT":
            elec_health -= 40.0
        if actual.battery_voltage < 24.5:
            elec_health -= (24.5 - actual.battery_voltage) * 10.0
        elif actual.battery_voltage > 29.5:
            elec_health -= (actual.battery_voltage - 29.5) * 8.0
        elec_health = max(0.0, min(100.0, elec_health))

        # 7. Sensor Subsystem
        # Evaluates physical anomalies that represent signal issues
        sensor_health = 100.0
        # For example, fuel flow indicating high consumption while RPM is near zero (impossible state)
        if actual.rpm < 200.0 and actual.fuel_flow > 1.0:
            sensor_health -= 50.0
        # If oil pressure is zero while RPM is above 2000 (likely sensor shear or pressure transducer drop)
        if actual.rpm > 2000.0 and actual.oil_pressure < 5.0:
            sensor_health -= 35.0
        sensor_health = max(0.0, min(100.0, sensor_health))

        subsystems = SubsystemHealth(
            mechanical=round(mech_health, 1),
            combustion=round(combustion_health, 1),
            fuel_system=round(fuel_health, 1),
            lubrication=round(lub_health, 1),
            thermal=round(thermal_health, 1),
            electrical=round(elec_health, 1),
            sensor=round(sensor_health, 1)
        )

        # Safety-First weighted index (heavily penalise individual component failures)
        mean_health = (
            subsystems.mechanical * cls.WEIGHT_MECHANICAL +
            subsystems.combustion * cls.WEIGHT_COMBUSTION +
            subsystems.fuel_system * cls.WEIGHT_FUEL +
            subsystems.lubrication * cls.WEIGHT_LUBRICATION +
            subsystems.thermal * cls.WEIGHT_THERMAL +
            subsystems.electrical * cls.WEIGHT_ELECTRICAL
        )
        
        # The lowest subsystem score exerts a safety pull (weighting safety-first)
        min_subsystem = min(
            subsystems.mechanical, 
            subsystems.combustion, 
            subsystems.fuel_system, 
            subsystems.lubrication, 
            subsystems.thermal, 
            subsystems.electrical
        )

        # 70% weighted average + 30% lowest critical subsystem score
        overall_health = 0.7 * mean_health + 0.3 * min_subsystem

        return subsystems, round(overall_health, 1)
