import json
from digital_twin.core import DigitalTwinCore
from digital_twin.models import MissionContext

# Configurable demonstration constants
DEMO_ALTITUDE_FT = 3280.8  # 1000 meters in feet
DEMO_AMBIENT_TEMP_C = 30.0
DEMO_AMBIENT_PRESS_HPA = 900.0  # approximate pressure at 1000m altitude

# Nominal engine inputs representing a cruise operating point
DEMO_NOMINAL_INPUTS = {
    "rpm": 2160.0,
    "throttle": 70.0,
    "engine_load": 73.0,
    "map": 711.0,  # matches expected restriction
    "cht": 317.0,  # matches expected thermal
    "egt": 1252.0,  # matches expected exhaust
    "oil_pressure": 61.4,  # matches expected lubrication
    "oil_temperature": 190.0,
    "fuel_flow": 8.7,  # matches expected altitude-compensated flow
    "fuel_pressure": 45.0,
    "vibration": 1.06,  # matches expected mechanical vibration
    "battery_voltage": 27.8,
    "alternator_status": "OK",
    "ambient_temperature": DEMO_AMBIENT_TEMP_C,
    "ambient_pressure": DEMO_AMBIENT_PRESS_HPA,
    "altitude": DEMO_ALTITUDE_FT
}

def run_demonstration():
    print("======================================================================")
    # Highlight this is simulated sandbox data
    print("      AEROTWIN DIGITAL TWIN CORE V0.1 - ENGINE RUN DEMONSTRATION")
    print("      [WARNING: All parameters are simulated DEMO values for HMI testing]")
    print("======================================================================")

    # Initialize twin core
    core = DigitalTwinCore()
    mission = MissionContext(
        mission_id="Alpha-7-Demo",
        flight_phase="Cruise",
        altitude=DEMO_ALTITUDE_FT,
        ambient_temperature=DEMO_AMBIENT_TEMP_C,
        ambient_pressure=DEMO_AMBIENT_PRESS_HPA
    )

    print("\n----------------------------------------------------------------------")
    print(" SCENARIO A: NOMINAL ENGINE OPERATION")
    print(" Engine running at 70% throttle cruise in standard parameters.")
    print("----------------------------------------------------------------------")

    # Ingest nominal telemetry
    nominal_output = core.update(DEMO_NOMINAL_INPUTS, mission)
    
    print(f"Engine Mode:    {nominal_output.operating_mode}")
    print(f"Health State:   {nominal_output.current_engine_state.health_state}")
    print(f"Overall Health: {nominal_output.overall_health}%")
    print("\nSensors vs Physics Expectations:")
    print(f"  EGT:  Actual={nominal_output.current_engine_state.egt}°F | Expected={nominal_output.expected_engine_state.egt}°F | Residual={nominal_output.residuals['egt']}°F")
    print(f"  CHT:  Actual={nominal_output.current_engine_state.cht}°F | Expected={nominal_output.expected_engine_state.cht}°F | Residual={nominal_output.residuals['cht']}°F")
    print(f"  Oil Pres: Actual={nominal_output.current_engine_state.oil_pressure}PSI | Expected={nominal_output.expected_engine_state.oil_pressure}PSI | Residual={nominal_output.residuals['oil_pressure']}PSI")
    print(f"Subsystem Health scores:")
    print(f"  Thermal: {nominal_output.subsystem_health.thermal}% | Lubrication: {nominal_output.subsystem_health.lubrication}% | Combustion: {nominal_output.subsystem_health.combustion}%")


    print("\n----------------------------------------------------------------------")
    print(" SCENARIO B: EGT THERMAL ANOMALY")
    print(" Same control inputs, but Exhaust Gas Temp (EGT) climbs abnormally.")
    print(" Indicates possible combustion imbalance / cylinder wear.")
    print("----------------------------------------------------------------------")

    # Clone inputs and inject a +178°F EGT deviation anomaly
    anomalous_inputs = DEMO_NOMINAL_INPUTS.copy()
    anomalous_inputs["egt"] = 1430.0  # nominal was 1252.0 (+178°F spike)

    # Ingest anomalous telemetry
    anom_output = core.update(anomalous_inputs, mission)

    print(f"Engine Mode:    {anom_output.operating_mode}")
    print(f"Health State:   {anom_output.current_engine_state.health_state} (State transition triggered!)")
    print(f"Overall Health: {anom_output.overall_health}% (Health index dropped)")
    print(f"Anomaly Score:  {anom_output.degradation_indicators['anomaly_score']}")
    print("\nSensors vs Physics Expectations:")
    print(f"  EGT:  Actual={anom_output.current_engine_state.egt}°F | Expected={anom_output.expected_engine_state.egt}°F | Residual={anom_output.residuals['egt']}°F (High Deviation!)")
    print(f"Subsystem Health scores:")
    print(f"  Thermal: {anom_output.subsystem_health.thermal}% | Lubrication: {anom_output.subsystem_health.lubrication}% | Combustion: {anom_output.subsystem_health.combustion}%")


    print("\n----------------------------------------------------------------------")
    print(" VERIFICATION: JSON SERIALIZATION VALIDATION")
    print(" Check that DigitalTwinOutput is serializable for GCS Dashboard transfer.")
    print("----------------------------------------------------------------------")
    
    output_json = anom_output.model_dump_json(indent=2)
    print("Sample Output Packet snippet:")
    
    # Parse back to print truncated clean layout
    parsed_json = json.loads(output_json)
    
    # Prune some subfields for clean print
    pruned_state = {
        "timestamp": parsed_json["timestamp"],
        "overall_health": parsed_json["overall_health"],
        "operating_mode": parsed_json["operating_mode"],
        "anomaly_score": parsed_json["degradation_indicators"]["anomaly_score"],
        "residuals": parsed_json["residuals"],
        "subsystem_health": parsed_json["subsystem_health"]
    }
    print(json.dumps(pruned_state, indent=2))
    
    print("\nJSON validation check: SUCCESS. Output is fully serializable.")
    print("======================================================================")

if __name__ == "__main__":
    run_demonstration()
