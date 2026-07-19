import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { rateLimit } from "../../../../lib/rate-limit";

const RecommendationRequestSchema = z.object({
  context: z.record(z.string(), z.any()).optional()
});

export async function POST(req: NextRequest) {
  // Rate limit: 10 requests per minute
  const rl = rateLimit(req, { limit: 10, windowMs: 60000 });
  if (!rl.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Gemini API key missing" }, { status: 503 });
  }

  try {
    const json = await req.json();
    const parsed = RecommendationRequestSchema.safeParse(json);
    
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request payload", details: parsed.error.format() }, { status: 400 });
    }

    const { context } = parsed.data;

    const ai = new GoogleGenerativeAI(apiKey);
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = `You are Northstar, the official Gen AI Matchday Companion powered by Live AI Intelligence for the FIFA World Cup 2026. 
Given the following context (which includes the user's role, location, time, live match status, weather, and active alerts), provide a single, highly proactive, 1-2 sentence recommendation that demonstrates the power of Gemini Gen AI. 
You MUST act as a real-time decision engine.
CRITICAL: Use the weather data to recommend a departure time if the user is in the 'before_leaving' stage. If there are severe weather alerts (e.g. rain) or active congestion alerts, explicitly tell the user what to do (e.g. "Leave 20 minutes earlier due to expected rain", "Use Gate C instead of Gate A").

You MUST format your response as a valid JSON object matching this schema:
{
  "title": "Short Greeting or Alert (e.g. 'Good afternoon', 'Smart Exit')",
  "text": "Your proactive recommendation",
  "action": "A short 2-3 word button label (e.g. 'Start Journey', 'View Route') or null"
}
Context: ${JSON.stringify(context)}`;

    const response = await model.generateContent(prompt);
    const responseText = response.response.text() || "{}";
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return NextResponse.json(JSON.parse(cleanedText));
  } catch (error) {
    console.error("Gemini /api/ai/recommendation Error:", error);
    return NextResponse.json({ error: "Failed to generate recommendation" }, { status: 500 });
  }
}
