from fastapi import APIRouter
from backend.app.services.twin_service import DigitalTwinService
from digital_twin.models import DigitalTwinOutput

router = APIRouter(prefix="/engine", tags=["Engine"])

@router.get("/state", response_model=DigitalTwinOutput)
def get_engine_state() -> DigitalTwinOutput:
    """
    Retrieves the current evaluated state of the virtual engine digital twin.
    """
    return DigitalTwinService().get_latest_output()
