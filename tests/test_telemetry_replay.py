import os
import tempfile
import pytest
import math
from backend.app.services.telemetry_replay import TelemetryReplayService
from backend.app.services.telemetry_mapper import TelemetryMapper

# Setup a small mock telemetry CSV dataset content for unit testing
MOCK_CSV_CONTENT = """Engine_ID,Flight_ID,Cycle,Timestamp,Time_Seconds,Flight_Phase,RPM,CHT_C,EGT_C,Oil_Pressure_bar,Oil_Temperature_C,Fuel_Flow_L_h,Vibration_g,Battery_Voltage_V,Alternate_Status_Output,Injection_Timing_deg_BTDC,Throttle_Position_pct,Engine_Load_pct,Ambient_Temperature_C,Ambient_Pressure_kPa,Altitude_m,Fuel_Consumed_L,Crankshaft_Position_deg,Health_Index,Health_State,Fault_Type,Fault_Severity,Degradation_Phase,Warning_Level,Failure_Mode,RUL_Cycles,RUL_Hours,Anomaly_Flag,Sensor_Fault_Flag,Maintenance_Flag
1,1,1,01-01-2026 00:00,0,Startup,837.9,140.7,666.0,4.0,77.1,8.5,3.0,24.9,0.99,27.1,5.0,11.2,25.0,101.3,0.0,0.0,0.0,0.97,Normal,,0,Healthy,Normal,None,379,121.8,0,0,0
1,1,1,01-01-2026 00:00,1,Startup,836.3,137.0,623.7,4.0,76.5,8.5,5.4,25.0,0.98,27.0,5.7,12.8,24.9,101.1,0.2,0.0,697.9,0.97,Normal,,0,Healthy,Normal,None,379,121.8,0,0,0
1,1,1,01-01-2026 00:00,2,Startup,,133.9,586.4,3.9,75.9,8.7,7.4,25.0,0.99,27.1,6.5,15.9,24.9,101.4,0.4,0.0,112.9,0.97,Normal,NaN,0,Healthy,Normal,None,379,121.8,0,0,0
"""

@pytest.fixture
def temp_csv_file():
    with tempfile.NamedTemporaryFile(mode="w", delete=False, suffix=".csv", newline="") as f:
        f.write(MOCK_CSV_CONTENT.strip())
        temp_path = f.name
    yield temp_path
    try:
        os.remove(temp_path)
    except Exception:
        pass

def test_csv_loading_and_row_parsing(temp_csv_file):
    """1. Test that TelemetryReplayService loads CSV and parses rows sequentially."""
    service = TelemetryReplayService(temp_csv_file)
    assert service.total_frames() == 3
    assert service.current_position() == 0
    assert not service.is_finished()

    # Read frame 1
    row1 = service.next_frame()
    assert row1 is not None
    assert row1["Engine_ID"] == "1"
    assert row1["Time_Seconds"] == "0"
    assert service.current_position() == 1
    assert not service.is_finished()

    # Read frame 2
    row2 = service.next_frame()
    assert row2 is not None
    assert row2["Time_Seconds"] == "1"
    assert service.current_position() == 2

    # Read frame 3
    row3 = service.next_frame()
    assert row3 is not None
    assert service.current_position() == 3
    
    # Read past end (EOF behavior)
    row4 = service.next_frame()
    assert row4 is None
    assert service.is_finished()

def test_replay_reset(temp_csv_file):
    """2. Test that resetting the replay restarts it from the beginning."""
    service = TelemetryReplayService(temp_csv_file)
    service.next_frame()
    service.next_frame()
    assert service.current_position() == 2

    service.reset()
    assert service.current_position() == 0
    assert not service.is_finished()
    row = service.next_frame()
    assert row["Time_Seconds"] == "0"

def test_unit_conversion_and_mapping():
    """3. Test TelemetryMapper conversions and mapping limits."""
    # Test valid row values conversion
    test_row = {
        "Timestamp": "01-01-2026 12:00",
        "RPM": "2400.0",
        "Throttle_Position_pct": "80.0",
        "Engine_Load_pct": "85.0",
        "CHT_C": "100.0",                 # 100°C -> 212°F
        "EGT_C": "800.0",                 # 800°C -> 1472°F
        "Oil_Pressure_bar": "4.0",        # 4 bar -> ~58 PSI
        "Oil_Temperature_C": "90.0",      # 90°C -> 194°F
        "Fuel_Flow_L_h": "20.0",          # 20 L/h -> ~5.28 GPH
        "Vibration_g": "1.5",
        "Battery_Voltage_V": "28.0",
        "Alternate_Status_Output": "0.95",
        "Ambient_Temperature_C": "15.0",
        "Ambient_Pressure_kPa": "85.0",   # 85 kPa -> 850 hPa
        "Altitude_m": "1000.0",           # 1000 m -> 3280.8 ft
    }

    mapped = TelemetryMapper.map_csv_to_engine_state(test_row)
    
    # Verify values and rounding matches
    assert mapped["rpm"] == 2400.0
    assert mapped["throttle"] == 80.0
    assert mapped["engine_load"] == 85.0
    assert mapped["cht"] == 100.0 * 1.8 + 32.0   # 212.0
    assert mapped["egt"] == 800.0 * 1.8 + 32.0   # 1472.0
    assert math.isclose(mapped["oil_pressure"], 4.0 * 14.5037738, abs_tol=0.1)
    assert mapped["oil_temperature"] == 90.0 * 1.8 + 32.0  # 194.0
    assert math.isclose(mapped["fuel_flow"], 20.0 * 0.264172052, abs_tol=0.05)
    assert mapped["alternator_status"] == "OK"
    assert mapped["ambient_pressure"] == 850.0
    assert math.isclose(mapped["altitude"], 3280.8, abs_tol=0.1)
    assert mapped["timestamp"] == "01-01-2026 12:00"

def test_nan_handling():
    """4. Test that missing/NaN/empty fields fall back to baseline defaults cleanly."""
    bad_row = {
        "RPM": "",                           # empty
        "CHT_C": "NaN",                      # NaN string
        "EGT_C": "None",                     # invalid text
        "Alternate_Status_Output": "0.1",    # alternator fault
    }

    mapped = TelemetryMapper.map_csv_to_engine_state(bad_row)
    
    # Assert values fallback correctly to baseline
    assert mapped["rpm"] == 2450.0           # default baseline
    assert mapped["cht"] == 380.0            # default baseline CHT
    assert mapped["egt"] == 1450.0           # default baseline EGT
    assert mapped["alternator_status"] == "FAULT" # 0.1 < 0.5
