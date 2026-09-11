import asyncio
import random
from typing import Any
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from backend.app.routes import engine, telemetry, simulation, replay
from backend.app.services.twin_service import DigitalTwinService

# 1. FastAPI App Initialization
app = FastAPI(
    title="AeroTwin Digital Twin Service API",
    description="Integration layer exposing physics models, expected states, residuals, and health scores.",
    version="0.1"
)

# 2. CORS Middleware Configuration (Supports Localhost, Vercel, and Custom Domains)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Include API REST Routers
app.include_router(engine.router, prefix="/api/v1")
app.include_router(telemetry.router, prefix="/api/v1")
app.include_router(simulation.router, prefix="/api/v1")
app.include_router(replay.router, prefix="/api/v1")

# 4. Error Handling Handlers (hides internal stack traces, returns JSON)
@app.exception_handler(RequestValidationError)
def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "Request telemetry failed validation checks.",
            "details": exc.errors()
        }
    )

@app.exception_handler(Exception)
def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Digital Twin computation error.",
            "message": str(exc)
        }
    )

# 5. GET /health Endpoint
@app.get("/health", tags=["System"])
def get_health() -> dict[str, str]:
    """
    Returns the backend service health status.
    """
    return {
        "status": "ok",
        "service": "AeroTwin API",
        "digital_twin": "available"
    }

# 6. WebSocket Telemetry Stream Mock Telemetry Provider
# (Isolated so it can be swapped for socketcan / socket updates later)
def _generate_mock_telemetry_frame() -> dict[str, Any]:
    """
    Generates fluctuating telemetry parameters centered around normal cruise baselines.
    """
    rpm_noise = random.uniform(-6.0, 6.0)
    cht_noise = random.uniform(-0.8, 0.8)
    egt_noise = random.uniform(-4.0, 4.0)
    pres_noise = random.uniform(-0.5, 0.5)
    flow_noise = random.uniform(-0.1, 0.1)

    return {
        "rpm": round(2450.0 + rpm_noise, 1),
        "throttle": 75.0,
        "engine_load": 78.0,
        "map": 1013.0,
        "cht": round(380.0 + cht_noise, 1),
        "egt": round(1450.0 + egt_noise, 1),
        "oil_pressure": round(65.0 + pres_noise, 1),
        "oil_temperature": 195.0,
        "fuel_flow": round(12.4 + flow_noise, 2),
        "fuel_pressure": 45.0,
        "vibration": round(1.2 + random.uniform(-0.05, 0.05), 2),
        "battery_voltage": round(27.8 + random.uniform(-0.05, 0.05), 1),
        "alternator_status": "OK",
        "ambient_temperature": -10.0,
        "ambient_pressure": 715.0,
        "altitude": 8500.0
    }

# 7. WebSocket Endpoint (WS /ws/telemetry)
@app.websocket("/ws/telemetry")
async def websocket_telemetry(websocket: WebSocket) -> None:
    """
    WebSocket endpoint streaming real-time digital twin output packets.
    Broadcasts at a controlled 1Hz frequency.
    Supports REPLAY_MODE=true to stream CSV telemetry instead of mock.
    """
    await websocket.accept()
    twin_service = DigitalTwinService()
    
    import os
    import json
    replay_mode = os.getenv("REPLAY_MODE", "false").lower() == "true"
    
    if replay_mode:
        from backend.app.routes.replay import replay_service
        from backend.app.services.telemetry_mapper import TelemetryMapper
    
    try:
        while True:
            if replay_mode:
                row = replay_service.next_frame()
                if row is None:
                    # Loop back to the start of the dataset automatically
                    replay_service.reset()
                    row = replay_service.next_frame()
                    if row is None:
                        # Empty dataset file, sleep and retry
                        await asyncio.sleep(1.0)
                        continue
                
                # Ingest and execute calculations
                telemetry_data = TelemetryMapper.map_csv_to_engine_state(row)
                output = twin_service.update_telemetry(telemetry_data)
                
                # Append replay metadata
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
                
                await websocket.send_text(json.dumps(response_data))
            else:
                # Generate fluctuating sensor parameters
                telemetry_data = _generate_mock_telemetry_frame()
                
                # Feed to digital twin core singleton
                output = twin_service.update_telemetry(telemetry_data)
                
                # Broadcast output packet as JSON
                await websocket.send_text(output.model_dump_json())
            
            # Controlled 1s interval (low CPU overhead)
            await asyncio.sleep(1.0)
            
    except WebSocketDisconnect:
        # Client disconnected cleanly
        pass
