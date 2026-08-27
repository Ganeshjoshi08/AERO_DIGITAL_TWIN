from fastapi import APIRouter
from backend.app.services.twin_service import DigitalTwinService
from digital_twin.models import EngineState, DigitalTwinOutput

router = APIRouter(prefix="/telemetry", tags=["Telemetry"])

@router.post("/update", response_model=DigitalTwinOutput)
def update_telemetry(payload: EngineState) -> DigitalTwinOutput:
    """
    Ingests a raw sensor telemetry frame, validates boundaries, and runs
    the Digital Twin core calculations to update the virtual engine.
    """
    # model_dump converts the Pydantic payload to a Python dictionary
    telemetry_dict = payload.model_dump()
    return DigitalTwinService().update_telemetry(telemetry_dict)
