from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from backend.app.services.dify_service import dify_service
from backend.app.services.twin_service import DigitalTwinService
from backend.app.services.ml_service import ml_service

router = APIRouter(tags=["AI & RAG Prognostics"])

twin_service = DigitalTwinService()

class RAGQueryRequest(BaseModel):
    user_question: str = Field(..., description="Query for engine maintenance inspection")
    predicted_rul: Optional[str] = Field("180", description="Predicted Remaining Useful Life cycles")

class AutoDiagnoseRequest(BaseModel):
    predicted_rul: Optional[str] = Field(None, description="Optional custom RUL override")

@router.get("/ai/prognostics")
def get_current_ai_prognostics() -> Dict[str, Any]:
    """
    Runs the trained Random Forest and Isolation Forest models
    against the latest Digital Twin engine state.
    """
    state_output = twin_service.get_latest_output()
    current = state_output.current_engine_state.model_dump()
    return ml_service.predict(current)

@router.post("/ai/predict")
def predict_custom_telemetry(telemetry: Dict[str, Any]) -> Dict[str, Any]:
    """
    Predicts RUL and Anomaly status for any arbitrary telemetry packet.
    """
    return ml_service.predict(telemetry)

@router.post("/ai/rag/query")
async def query_rag(request: RAGQueryRequest) -> Dict[str, Any]:
    """
    Directly queries the Dify RAG Workflow with a custom user question
    and current predicted RUL. Truncates question to 250 chars max to respect Dify limits.
    """
    clean_question = request.user_question[:250]
    res = await dify_service.query_maintenance_advisory(
        user_question=clean_question,
        predicted_rul=str(request.predicted_rul or "180")
    )
    return res

@router.post("/ai/rag/auto-diagnose")
async def auto_diagnose_current_state(request: Optional[AutoDiagnoseRequest] = None) -> Dict[str, Any]:
    """
    Automatically compiles current Digital Twin residuals, health state,
    and temperatures into a concise prompt (<250 chars) and queries Dify RAG.
    """
    state_output = twin_service.get_latest_output()
    current = state_output.current_engine_state
    residuals = state_output.residuals
    health = int(round(state_output.overall_health))
    phase = state_output.mission_context.flight_phase
    
    # 1. Use real Random Forest predicted RUL by default
    ai_inference = ml_service.predict(current.model_dump())
    rul = str(ai_inference.get("predicted_rul", 180))
    if request and request.predicted_rul:
        rul = str(request.predicted_rul)

    cht_res = residuals.get('cht', 0)
    egt_res = residuals.get('egt', 0)
    op_res = residuals.get('oil_pressure', 0)

    # Concise prompt strictly under 250 characters for Dify workflow
    question = (
        f"{phase} phase. Health: {health}%, Status: {current.health_state}. "
        f"CHT: {current.cht:.0f}F ({cht_res:+.0f}F res), "
        f"EGT: {current.egt:.0f}F ({egt_res:+.0f}F res), "
        f"Oil: {current.oil_pressure:.0f}PSI ({op_res:+.0f}PSI res). "
        f"What maintenance inspection & root causes apply?"
    )[:250]

    res = await dify_service.query_maintenance_advisory(
        user_question=question,
        predicted_rul=rul
    )
    res["prompt_context"] = question
    res["predicted_rul"] = rul
    res["ai_prognostics"] = ai_inference
    return res
