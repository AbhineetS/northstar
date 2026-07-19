import { IAIService, IAIChatMessage, IRecommendation, IOpsRecommendation } from "./interfaces";
import { useApiStore } from "../store/useApiStore";

export class GeminiAIService implements IAIService {
  constructor() {}

  async generateRecommendation(context: unknown): Promise<IRecommendation> {
    useApiStore.getState().startRequest();
    try {
      const response = await fetch('/api/ai/recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      useApiStore.getState().endRequest();
      return data as IRecommendation;
    } catch (e) {
      console.error("Gemini API Error:", e);
      useApiStore.getState().setError("Gemini", "Failed to generate recommendation");
      useApiStore.getState().endRequest();
      throw e;
    }
  }

  /**
   * Generates operations-focused recommendations for stadium management.
   * @param context - Contextual state such as weather, matches, and incidents
   * @returns A promise resolving to the parsed recommendations object
   */
  async generateOpsRecommendations(context: unknown): Promise<IOpsRecommendation[]> {
    useApiStore.getState().startRequest();
    try {
      const response = await fetch('/api/ai/ops-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      useApiStore.getState().endRequest();
      return data;
    } catch (e) {
      console.error("Gemini API Error:", e);
      useApiStore.getState().setError("Gemini", "Failed to generate ops recommendations");
      useApiStore.getState().endRequest();
      throw e;
    }
  }

  /**
   * Generates a conversational AI response based on the provided context.
   * @param messages - The chat history array
   * @param context - Additional contextual parameters (e.g., role, stage, weather)
   * @returns A promise resolving to the AI-generated string response
   */
  async chat(messages: IAIChatMessage[], context?: unknown): Promise<string> {
    useApiStore.getState().startRequest();
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, context: context || {} }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      let fullText = "";
      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          fullText += decoder.decode(value, { stream: true });
        }
      }
      
      useApiStore.getState().endRequest();
      return fullText;
    } catch (e) {
      console.error("Gemini API Error: Chat Request Failed");
      useApiStore.getState().setError("Gemini", "Failed to respond to chat");
      useApiStore.getState().endRequest();
      throw e;
    }
  }
}
