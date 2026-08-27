import json
import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from digital_twin.models import DigitalTwinOutput

client = TestClient(app)

# Dummy nominal telemetry frame for testing updates
TEST_TELEMETRY = {
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


def test_get_health():
    """1. Test GET /health service status endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "AeroTwin API"
    assert data["digital_twin"] == "available"


def test_get_engine_state():
    """2. Test GET /api/v1/engine/state returns current twin state."""
    response = client.get("/api/v1/engine/state")
    assert response.status_code == 200
    data = response.json()
    
    # Assert expected properties of DigitalTwinOutput are present
    assert "current_engine_state" in data
    assert "expected_engine_state" in data
    assert "residuals" in data
    assert "overall_health" in data


def test_post_telemetry_update():
    """3. Test POST /api/v1/telemetry/update ingests and calculates twin output."""
    response = client.post("/api/v1/telemetry/update", json=TEST_TELEMETRY)
    assert response.status_code == 200
    data = response.json()
    
    # Parse back to Pydantic to ensure model validity
    output = DigitalTwinOutput(**data)
    assert output.current_engine_state.rpm == 2450.0
    assert "egt" in output.residuals
    assert output.overall_health > 0.0


def test_post_simulation_what_if():
    """4. Test POST /api/v1/simulation/what-if runs isolated performance calculations."""
    payload = {
        "target_rpm": 2700.0,
        "throttle": 95.0,
        "altitude": 12000.0,
        "ambient_temp": 35.0
    }
    response = client.post("/api/v1/simulation/what-if", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    # Verify properties
    assert "expected_engine_state" in data
    assert "residuals" in data
    assert "subsystem_health" in data
    assert data["expected_engine_state"]["rpm"] == 2561.8
    assert data["overall_health"] == 100.0
    assert data["metadata"]["altitude"] == 12000.0


def test_websocket_telemetry_connection():
    """5. Test WS /ws/telemetry establishes connection and streams telemetry packets."""
    with client.websocket_connect("/ws/telemetry") as websocket:
        # Receive the first broadcast packet
        data_str = websocket.receive_text()
        data = json.loads(data_str)
        
        # Verify structure
        assert "current_engine_state" in data
        assert "residuals" in data
        assert "overall_health" in data
        assert data["operating_mode"] == "CRUISE"


def test_invalid_telemetry_validation():
    """6. Test input parameter validation and error states on updates."""
    # RPM out of Pydantic ge/le boundaries (e.g., negative speed)
    bad_telemetry = TEST_TELEMETRY.copy()
    bad_telemetry["rpm"] = -100.0
    
    response = client.post("/api/v1/telemetry/update", json=bad_telemetry)
    # Check that HTTP 422 is returned
    assert response.status_code == 422
    data = response.json()
    assert "error" in data
    assert "details" in data
