import logging
from google import genai
from google.genai import types
from models.domain import ContextFrame, AIDecision
from core.config import settings

logger = logging.getLogger(__name__)

class PromptManager:
    """Manages AI prompts and system instructions."""
    
    @staticmethod
    def get_system_prompt() -> str:
        """Returns the base system instruction for the AI."""
        return (
            "You are Pulse, the operational intelligence for the FIFA World Cup 2026. "
            "You do not converse. You output localized, optimal decisions in strict JSON format "
            "based on the provided live telemetry. Prioritize human safety, then crowd flow, "
            "then carbon efficiency. Output schema: { action: str, target: str, reason: str, ui_component: str }"
        )

class AIOrchestrator:
    """Orchestrates AI requests to Gemini."""
    
    def __init__(self) -> None:
        """Initializes the AI client."""
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model_id = "gemini-2.5-flash"
    
    def process_context(self, context: ContextFrame, user_intent: str) -> AIDecision:
        """Processes user intent and context to return an AI decision."""
        if settings.GEMINI_API_KEY == "mock_key" or not settings.GEMINI_API_KEY:
            return self._get_mock_decision(user_intent)

        try:
            response = self.client.models.generate_content(
                model=self.model_id,
                contents=f"Intent: {user_intent}\nContext: {context.model_dump_json()}",
                config=types.GenerateContentConfig(
                    system_instruction=PromptManager.get_system_prompt(),
                    response_mime_type="application/json",
                    response_schema=AIDecision,
                    temperature=0.2
                )
            )
            
            if response.text:
                return AIDecision.model_validate_json(response.text)
            
            logger.error("Empty response from AI Engine.")
            return self._get_fallback_decision()
        except Exception as e:
            logger.error(f"AI Engine Error: {e}")
            return self._get_fallback_decision()
            
    def _get_mock_decision(self, user_intent: str) -> AIDecision:
        """Returns a predefined mock decision based on intent."""
        intent_lower = user_intent.lower()
        
        # Sustainability & Operations
        if any(keyword in intent_lower for keyword in ["hvac", "sustainability", "power", "water"]):
            return AIDecision(
                action="Rebalance HVAC",
                target="Cooling Tower 2",
                reason="Thermal spike detected. Rebalancing load from Tower 4 to Tower 2 saves 45 L/m of water.",
                ui_component="SustainabilityAction"
            )
            
        # Volunteer Coordination & Emergency
        elif any(keyword in intent_lower for keyword in ["volunteer", "dispatch", "incident", "security", "medical"]):
            return AIDecision(
                action="Dispatch Volunteer",
                target="Gate 4 Security",
                reason="Unattended baggage detected. Nearest available volunteer (ID: 942) dispatched for crowd control.",
                ui_component="TaskAssignment"
            )
            
        # Crowd Management & Navigation
        elif any(keyword in intent_lower for keyword in ["route", "gate", "crowd"]):
            return AIDecision(
                action="Re-route",
                target="Gate D",
                reason="High congestion detected at Gate B (12 min wait). Re-routing via Gate D will save 8 minutes.",
                ui_component="MapHighlight"
            )
            
        # Fan Experience
        elif any(keyword in intent_lower for keyword in ["food", "eat", "hungry"]):
            return AIDecision(
                action="Order Ahead",
                target="Zone A Concessions",
                reason="Zone B concessions have a 15-minute queue. Zone A is currently clear.",
                ui_component="ServiceCard"
            )
            
        # Transport & Safety
        elif any(keyword in intent_lower for keyword in ["transport", "leave", "train"]):
            return AIDecision(
                action="Delay Exit",
                target="Fan Zone",
                reason="Metro Line 4 is experiencing high surge. Wait in the Fan Zone for 15 mins to avoid crowds.",
                ui_component="Alert"
            )
            
        # Default
        else:
            return AIDecision(
                action="Navigate",
                target="Seat 104F",
                reason="Current path is clear. Estimated walking time: 4 minutes. Accessible route available.",
                ui_component="MapHighlight"
            )
            
    def _get_fallback_decision(self) -> AIDecision:
        """Returns a safe fallback decision when the AI engine is unavailable."""
        return AIDecision(
            action="fallback",
            target="none",
            reason="AI Engine unavailable. Follow standard operating procedures.",
            ui_component="Alert"
        )

# Central singleton instance for the OS
ai_engine = AIOrchestrator()
