import { useState } from "react";
import { useTelemetryStore } from "./useTelemetryStore";

export const useAIEngine = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // We grab real-time context from the telemetry store to inject into the AI request
  const { totalAttendance } = useTelemetryStore();

  const getDecision = async (intent: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const contextFrame = {
        role: "fan",
        location: "Zone A",
        crowd_density: Math.round((totalAttendance / 85000) * 100),
        active_incidents: 0,
        weather: {
          condition: "clear",
          temperature_c: 24
        }
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch("http://localhost:8000/api/v1/ai/decision?intent=" + encodeURIComponent(intent), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contextFrame),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error("Failed to fetch AI decision");
      
      const data = await res.json();
      return data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.name === 'AbortError' ? 'AI Engine timed out. Please try again.' : err.message);
      } else {
        setError(String(err));
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { getDecision, isLoading, error };
};
