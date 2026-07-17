from google import genai
from google.genai import types
from models.domain import ContextFrame, AIDecision
from core.config import settings
import json

class PromptManager:
    @staticmethod
    def get_system_prompt() -> str:
        return (
            "You are Pulse, the operational intelligence for the FIFA World Cup 2026. "
            "You do not converse. You output localized, optimal decisions in strict JSON format "
            "based on the provided live telemetry. Prioritize human safety, then crowd flow, "
            "then carbon efficiency. Output schema: { action: str, target: str, reason: str, ui_component: str }"
        )

class AIOrchestrator:
    def __init__(self):
        # The AI layer centralized via GenAI SDK
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model_id = "gemini-2.5-flash"
    
    def process_context(self, context: ContextFrame, user_intent: str) -> AIDecision:
        if settings.GEMINI_API_KEY == "mock_key" or not settings.GEMINI_API_KEY:
            # Enhanced mock mode for judging & demo
            intent_lower = user_intent.lower()
            if "route" in intent_lower or "gate" in intent_lower or "crowd" in intent_lower:
                return AIDecision(
                    action="Re-route",
                    target="Gate D",
                    reason="High congestion detected at Gate B (12 min wait). Re-routing via Gate D will save 8 minutes.",
                    ui_component="MapHighlight"
                )
            elif "food" in intent_lower or "eat" in intent_lower or "hungry" in intent_lower:
                return AIDecision(
                    action="Order Ahead",
                    target="Zone A Concessions",
                    reason="Zone B concessions have a 15-minute queue. Zone A is currently clear.",
                    ui_component="ServiceCard"
                )
            elif "transport" in intent_lower or "leave" in intent_lower or "train" in intent_lower:
                return AIDecision(
                    action="Delay Exit",
                    target="Fan Zone",
                    reason="Metro Line 4 is experiencing high surge. Wait in the Fan Zone for 15 mins to avoid crowds.",
                    ui_component="Alert"
                )
            else:
                return AIDecision(
                    action="Navigate",
                    target="Seat 104F",
                    reason="Current path is clear. Estimated walking time: 4 minutes.",
                    ui_component="MapHighlight"
                )

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
            
            # Pydantic parsing
            result_json = response.text
            return AIDecision.model_validate_json(result_json)
        except Exception as e:
            print(f"AI Engine Error: {e}")
            # Fallback for safety critical systems
            return AIDecision(
                action="fallback",
                target="none",
                reason="AI Engine unavailable. Follow standard operating procedures.",
                ui_component="Alert"
            )

# Central singleton instance for the OS
ai_engine = AIOrchestrator()
