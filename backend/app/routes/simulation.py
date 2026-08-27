from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Dict, Any
from backend.app.services.twin_service import DigitalTwinService
from digital_twin.models import ExpectedEngineState, SubsystemHealth

router = APIRouter(prefix="/simulation", tags=["Simulation"])

class WhatIfRequest(BaseModel):
    target_rpm: float = Field(..., description="Target crankshaft speed in RPM", ge=0.0, le=4000.0)
    throttle: float = Field(..., description="Throttle position percent", ge=0.0, le=100.0)
    altitude: float = Field(..., description="Hypothetical flight altitude in feet", ge=-1000.0, le=25000.0)
    ambient_temp: float = Field(..., description="Outside air temperature in °C", ge=-60.0, le=60.0)


class WhatIfResponse(BaseModel):
    expected_engine_state: ExpectedEngineState
    residuals: Dict[str, float]
    subsystem_health: SubsystemHealth
    overall_health: float
    metadata: Dict[str, Any]


@router.post("/what-if", response_model=WhatIfResponse)
def run_simulation(payload: WhatIfRequest) -> WhatIfResponse:
    """
    Executes a performance estimation under custom hypothetical settings,
    completely isolated from the active running engine state.
    """
    expected = DigitalTwinService().run_simulation_what_if(
        target_rpm=payload.target_rpm,
        throttle=payload.throttle,
        altitude=payload.altitude,
        ambient_temp=payload.ambient_temp
    )

    # In a nominal simulation model, deviations (residuals) are zero by definition
    zero_residuals = {
        "rpm": 0.0,
        "cht": 0.0,
        "egt": 0.0,
        "oil_pressure": 0.0,
        "fuel_flow": 0.0,
        "map": 0.0,
        "vibration": 0.0
    }

    subsystems = SubsystemHealth()

    return WhatIfResponse(
        expected_engine_state=expected,
        residuals=zero_residuals,
        subsystem_health=subsystems,
        overall_health=100.0,
        metadata={
            "simulation_type": "Nominal Expected Performance Prototyping",
            "ambient_temperature": payload.ambient_temp,
            "altitude": payload.altitude,
            "throttle": payload.throttle,
            "target_rpm": payload.target_rpm
        }
    )
