from fastapi import APIRouter
from models.domain import ContextFrame, AIDecision
from services.ai_engine import ai_engine

router = APIRouter()

@router.get("/status")
def get_status():
    return {"status": "ok", "service": "Pulse Realtime API"}

@router.post("/ai/decision", response_model=AIDecision)
def get_ai_decision(context: ContextFrame, intent: str):
    """
    Central API endpoint for all future AI requests.
    """
    decision = ai_engine.process_context(context, intent)
    return decision
