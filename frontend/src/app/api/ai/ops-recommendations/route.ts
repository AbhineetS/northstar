import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  if (!apiKey) {
    return NextResponse.json({ error: "Gemini API key missing" }, { status: 503 });
  }

  try {
    const { context } = await req.json();

    const ai = new GoogleGenerativeAI(apiKey);
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

    const role = context?.role || "Organizer";
    const prompt = `You are Northstar, the official Gen AI Matchday Companion powered by Live AI Intelligence for the FIFA World Cup 2026. 
You are currently providing advanced operational intelligence to a user with the role: ${role}, showcasing the power of Gemini Gen AI.
${role === 'Organizer' 
  ? 'Given the following live telemetry (ingress rate, incidents), generate an array of 1-3 critical or high-priority actionable operational recommendations. If everything is normal, provide 1 proactive optimization suggestion.'
  : 'Given the following live context, generate an array of 1-3 maintenance tasks, cleaning requirements, or incident assistance tasks for Venue Staff. Be highly specific about location and priority.'}

You MUST format your response as a JSON array containing objects matching this schema exactly:
[
  {
    "id": "A unique string ID like REC-CROWD-1",
    "title": "Short Alert Title",
    "priority": "critical" | "high" | "medium",
    "context": "Why is this happening based on the telemetry?",
    "prediction": "What will happen if no action is taken?",
    "action": "What should the organizer do? (e.g. 'Deploy Rapid Response')",
    "impact": "What is the expected result of this action?"
  }
]
Context: ${JSON.stringify(context)}`;

    const response = await model.generateContent(prompt);
    const responseText = response.response.text() || "[]";
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return NextResponse.json(JSON.parse(cleanedText));
  } catch (error) {
    console.error("Gemini /api/ai/ops-recommendations Error:", error);
    return NextResponse.json({ error: "Failed to generate ops recommendations" }, { status: 500 });
  }
}
