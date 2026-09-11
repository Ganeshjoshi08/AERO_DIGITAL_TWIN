import os
import json
import pytest
from fastapi.testclient import TestClient

# Mock the dataset path to point to a temporary test CSV file during execution
MOCK_CSV_CONTENT = """Engine_ID,Flight_ID,Cycle,Timestamp,Time_Seconds,Flight_Phase,RPM,CHT_C,EGT_C,Oil_Pressure_bar,Oil_Temperature_C,Fuel_Flow_L_h,Vibration_g,Battery_Voltage_V,Alternate_Status_Output,Injection_Timing_deg_BTDC,Throttle_Position_pct,Engine_Load_pct,Ambient_Temperature_C,Ambient_Pressure_kPa,Altitude_m,Fuel_Consumed_L,Crankshaft_Position_deg,Health_Index,Health_State,Fault_Type,Fault_Severity,Degradation_Phase,Warning_Level,Failure_Mode,RUL_Cycles,RUL_Hours,Anomaly_Flag,Sensor_Fault_Flag,Maintenance_Flag
1,1,1,01-01-2026 00:00,0,Startup,837.9,140.7,666.0,4.0,77.1,8.5,3.0,24.9,0.99,27.1,5.0,11.2,25.0,101.3,0.0,0.0,0.0,0.97,Normal,,0,Healthy,Normal,None,379,121.8,0,0,0
1,1,1,01-01-2026 00:00,1,Startup,836.3,137.0,623.7,4.0,76.5,8.5,5.4,25.0,0.98,27.0,5.7,12.8,24.9,101.1,0.2,0.0,697.9,0.97,Normal,,0,Healthy,Normal,None,379,121.8,0,0,0
"""

@pytest.fixture(autouse=True)
def setup_replay_environment(monkeypatch, tmp_path):
    # Create temp CSV file
    csv_file = tmp_path / "test_run_to_failure.csv"
    csv_file.write_text(MOCK_CSV_CONTENT.strip(), encoding="utf-8")
    
    # Configure env parameters
    monkeypatch.setenv("AEROTWIN_DATASET_PATH", str(csv_file))
    monkeypatch.setenv("REPLAY_MODE", "true")
    
    # Re-initialize the replay_service inside backend routes to use this temp CSV path
    from backend.app.routes.replay import replay_service, TelemetryReplayService
    
    # Backup existing
    old_service = replay_service
    # Instantiate new test service
    test_service = TelemetryReplayService(str(csv_file))
    monkeypatch.setattr("backend.app.routes.replay.replay_service", test_service)
    
    yield
    
    # Restore
    monkeypatch.setattr("backend.app.routes.replay.replay_service", old_service)

def test_replay_reset_endpoint():
    """1. Test POST /api/v1/replay/reset sets pointer back to 0 and clears twin history."""
    from backend.app.main import app
    from backend.app.services.twin_service import DigitalTwinService
    client = TestClient(app)
    
    # Run a step to populate history
    client.post("/api/v1/replay/step")
    twin_service = DigitalTwinService()
    assert len(twin_service.core.tracker.history) > 0
    
    # Trigger reset
    response = client.post("/api/v1/replay/reset")
    assert response.status_code == 200
    data = response.json()
    assert "reset" in data["status"]
    assert data["position"] == 0
    
    # Assert twin history tracker resets (exactly 1 baseline record remains)
    assert len(twin_service.core.tracker.history) == 1

def test_replay_step_endpoint():
    """2. Test POST /api/v1/replay/step reads CSV, runs calculations, returns metadata."""
    from backend.app.main import app
    client = TestClient(app)
    
    # Step 1
    response1 = client.post("/api/v1/replay/step")
    assert response1.status_code == 200
    data1 = response1.json()
    assert "current_engine_state" in data1
    assert "replay" in data1
    assert data1["replay"]["position"] == 1
    assert data1["replay"]["flight_phase"] == "Startup"
    assert data1["replay"]["cycle"] == 1
    assert "time_seconds" in data1["replay"]
    assert data1["replay"]["time_seconds"] == 0

    # Step 2
    response2 = client.post("/api/v1/replay/step")
    assert response2.status_code == 200
    data2 = response2.json()
    assert data2["replay"]["position"] == 2

    # Step 3 -> EOF behavior
    response3 = client.post("/api/v1/replay/step")
    assert response3.status_code == 400
    assert "End of telemetry dataset reached." in response3.json()["detail"]

def test_replay_status_endpoint():
    """3. Test GET /api/v1/replay/status returns current cycle and progress."""
    from backend.app.main import app
    client = TestClient(app)
    
    # Initial status
    client.post("/api/v1/replay/reset")
    response_init = client.get("/api/v1/replay/status")
    assert response_init.status_code == 200
    data_init = response_init.json()
    assert data_init["position"] == 0
    assert data_init["progress_percent"] == 0.0

    # Status after one step
    client.post("/api/v1/replay/step")
    response_step = client.get("/api/v1/replay/status")
    assert response_step.status_code == 200
    data_step = response_step.json()
    assert data_step["position"] == 1
    assert data_step["progress_percent"] == 50.0 # 1 out of 2 total
    assert data_step["current_cycle"] == 1

def test_websocket_replay_stream():
    """4. Test WS /ws/telemetry streams replay packets when REPLAY_MODE=true."""
    from backend.app.main import app
    client = TestClient(app)
    
    with client.websocket_connect("/ws/telemetry") as websocket:
        # Receive packet 1
        data_str1 = websocket.receive_text()
        data1 = json.loads(data_str1)
        assert "current_engine_state" in data1
        assert "replay" in data1
        assert data1["replay"]["position"] == 1
        
        # Receive packet 2
        data_str2 = websocket.receive_text()
        data2 = json.loads(data_str2)
        assert data2["replay"]["position"] == 2
        
        # Receive packet 3 -> tests EOF reset behavior (should reset to frame 1)
        data_str3 = websocket.receive_text()
        data3 = json.loads(data_str3)
        assert data3["replay"]["position"] == 1
