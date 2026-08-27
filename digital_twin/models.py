from pydantic import BaseModel, Field
from typing import Dict, Optional
from datetime import datetime

class EngineState(BaseModel):
    """
    Represents the actual measured physical state of the aero-piston engine.
    Validates sensor boundaries and types.
    """
    timestamp: str = Field(default_factory=lambda: datetime.now().isoformat())
    rpm: float = Field(..., description="Engine speed in RPM", ge=0.0, le=4000.0)
    throttle: float = Field(..., description="Throttle position percent", ge=0.0, le=100.0)
    engine_load: float = Field(..., description="Calculated engine load percent", ge=0.0, le=120.0)
    map: float = Field(..., description="Manifold Absolute Pressure in hPa", ge=100.0, le=1500.0)
    cht: float = Field(..., description="Cylinder Head Temperature in °F", ge=32.0, le=600.0)
    egt: float = Field(..., description="Exhaust Gas Temperature in °F", ge=32.0, le=2000.0)
    oil_pressure: float = Field(..., description="Engine oil pressure in PSI", ge=0.0, le=150.0)
    oil_temperature: float = Field(..., description="Engine oil temperature in °F", ge=32.0, le=300.0)
    fuel_flow: float = Field(..., description="Fuel consumption rate in GPH", ge=0.0, le=30.0)
    fuel_pressure: float = Field(..., description="Fuel pressure in PSI", ge=0.0, le=100.0)
    vibration: float = Field(..., description="Torsional vibration level in g", ge=0.0, le=10.0)
    battery_voltage: float = Field(..., description="Avionics bus voltage in V", ge=0.0, le=36.0)
    alternator_status: str = Field(..., description="Alternator charging state: 'OK' or 'FAULT'")
    ambient_temperature: float = Field(..., description="Outside air temperature in °C", ge=-60.0, le=60.0)
    ambient_pressure: float = Field(..., description="Outside air pressure in hPa", ge=100.0, le=1200.0)
    altitude: float = Field(..., description="Flight altitude in feet", ge=-1000.0, le=25000.0)
    operating_mode: str = Field(default="IDLE", description="Engine operating state mode")
    health_state: str = Field(default="NOMINAL", description="Evaluated engine health status classification")

    model_config = {
        "json_schema_extra": {
            "example": {
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
                "altitude": 8500.0,
                "operating_mode": "CRUISE",
                "health_state": "NOMINAL"
            }
        }
    }


class ExpectedEngineState(BaseModel):
    """
    Represents the expected normal operating values of the engine 
    derived from the physics-thermodynamic and performance models.
    """
    rpm: float = Field(..., description="Expected engine speed in RPM")
    fuel_flow: float = Field(..., description="Expected fuel flow in GPH")
    egt: float = Field(..., description="Expected Exhaust Gas Temperature in °F")
    cht: float = Field(..., description="Expected Cylinder Head Temperature in °F")
    engine_load: float = Field(..., description="Expected engine load percent")
    map: float = Field(..., description="Expected MAP in hPa")
    oil_pressure: float = Field(..., description="Expected oil pressure in PSI")
    vibration: float = Field(..., description="Expected vibration level in g")


class SubsystemHealth(BaseModel):
    """
    Represents individual safety/wear scores (0 to 100) for major components.
    """
    mechanical: float = Field(default=100.0, ge=0.0, le=100.0)
    combustion: float = Field(default=100.0, ge=0.0, le=100.0)
    fuel_system: float = Field(default=100.0, ge=0.0, le=100.0)
    lubrication: float = Field(default=100.0, ge=0.0, le=100.0)
    thermal: float = Field(default=100.0, ge=0.0, le=100.0)
    electrical: float = Field(default=100.0, ge=0.0, le=100.0)
    sensor: float = Field(default=100.0, ge=0.0, le=100.0)


class MissionContext(BaseModel):
    """
    Provides flight mission parameters that define the operating environment constraints.
    """
    mission_id: str = Field(default="Alpha-7")
    flight_phase: str = Field(default="Cruise")
    altitude: float = Field(default=8500.0)
    ambient_temperature: float = Field(default=-10.0)
    ambient_pressure: float = Field(default=715.0)
    duration: float = Field(default=0.0, description="Flight duration in seconds")
    operating_condition: str = Field(default="Standard")


class DigitalTwinOutput(BaseModel):
    """
    JSON-serializable output packet representing the complete Digital Twin evaluation.
    """
    timestamp: str
    current_engine_state: EngineState
    expected_engine_state: ExpectedEngineState
    residuals: Dict[str, float]
    operating_mode: str
    subsystem_health: SubsystemHealth
    overall_health: float
    degradation_indicators: Dict[str, float]
    mission_context: MissionContext
