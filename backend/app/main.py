import asyncio
import random
from typing import Any
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from backend.app.routes import engine, telemetry, simulation
from backend.app.services.twin_service import DigitalTwinService

# 1. FastAPI App Initialization
app = FastAPI(
    title="AeroTwin Digital Twin Service API",
    description="Integration layer exposing physics models, expected states, residuals, and health scores.",
    version="0.1"
)

# 2. CORS Middleware Configuration (Vite local dev server origins)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Include API REST Routers
app.include_router(engine.router, prefix="/api/v1")
app.include_router(telemetry.router, prefix="/api/v1")
app.include_router(simulation.router, prefix="/api/v1")

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
    """
    await websocket.accept()
    twin_service = DigitalTwinService()
    
    try:
        while True:
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
