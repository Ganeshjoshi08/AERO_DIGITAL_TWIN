import os
from fastapi import APIRouter, HTTPException, status
from backend.app.services.telemetry_replay import TelemetryReplayService
from backend.app.services.telemetry_mapper import TelemetryMapper
from backend.app.services.twin_service import DigitalTwinService

router = APIRouter(prefix="/replay", tags=["Replay"])

# Resolve dataset path using environment variable with a robust project root fallback
dataset_path = os.getenv("AEROTWIN_DATASET_PATH")
if not dataset_path:
    # Go up 4 levels from backend/app/routes/replay.py to reach c:/Users/joshi/Desktop/AERO_DIGITAL_TWIN/
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    dataset_path = os.path.join(base_dir, "data", "synthetic_uav_aero_piston_engine_run_to_failure.csv")

# Instantiated single service handler
try:
    replay_service = TelemetryReplayService(dataset_path)
except Exception as e:
    # Fail-safe mock/dummy replay service if file is missing during startup or testing
    class DummyReplayService:
        def __init__(self):
            self.last_row = None
        def reset(self): pass
        def next_frame(self): return None
        def current_position(self): return 0
        def total_frames(self): return 0
        def is_finished(self): return True
    replay_service = DummyReplayService()

@router.post("/step")
def replay_step() -> dict:
    """
    Advances replay by one CSV row, executes the digital twin update cycle,
    and returns a combined JSON of the DigitalTwinOutput and replay metadata.
    """
    row = replay_service.next_frame()
    if row is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End of telemetry dataset reached."
        )

    # 1. Map raw CSV columns to Digital Twin physical parameters
    engine_state_dict = TelemetryMapper.map_csv_to_engine_state(row)
    
    # 2. Run physics-based digital twin calculations
    twin_service = DigitalTwinService()
    output = twin_service.update_telemetry(engine_state_dict)

    # 3. Extract ground-truth metadata from CSV
    position = replay_service.current_position()
    total = replay_service.total_frames()
    progress = round((position / total) * 100.0, 2) if total > 0 else 0.0

    try:
        cycle = int(float(row.get("Cycle", 0)))
    except (ValueError, TypeError):
        cycle = 0

    try:
        flight_id = int(float(row.get("Flight_ID", 0)))
    except (ValueError, TypeError):
        flight_id = 0

    try:
        time_seconds = int(float(row.get("Time_Seconds", 0)))
    except (ValueError, TypeError):
        time_seconds = 0

    flight_phase = row.get("Flight_Phase", "Unknown")
    dataset_timestamp = row.get("Timestamp", "")

    # 4. Return serialized pydantic output enriched with replay metadata
    response_data = output.model_dump()
    response_data["replay"] = {
        "position": position,
        "total_frames": total,
        "progress_percent": progress,
        "cycle": cycle,
        "flight_id": flight_id,
        "flight_phase": flight_phase,
        "dataset_timestamp": dataset_timestamp,
        "time_seconds": time_seconds
    }

    return response_data

@router.post("/reset")
def replay_reset() -> dict:
    """
    Resets the CSV telemetry playback position to the beginning of the file
    and clears the virtual digital twin history.
    """
    replay_service.reset()
    twin_service = DigitalTwinService()
    twin_service.reset_service()
    return {
        "status": "reset",
        "message": "Replay position and digital twin history reset.",
        "position": 0,
        "total_frames": replay_service.total_frames()
    }

@router.get("/status")
def replay_status() -> dict:
    """
    Returns statistics on the current playback state and frame metrics.
    """
    position = replay_service.current_position()
    total = replay_service.total_frames()
    progress = round((position / total) * 100.0, 2) if total > 0 else 0.0
    
    cycle = 0
    if replay_service.last_row:
        try:
            cycle = int(float(replay_service.last_row.get("Cycle", 0)))
        except (ValueError, TypeError):
            cycle = 0

    return {
        "position": position,
        "total_frames": total,
        "progress_percent": progress,
        "current_cycle": cycle,
        "is_finished": replay_service.is_finished()
    }
