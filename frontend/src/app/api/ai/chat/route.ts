import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  if (!apiKey) {
    return NextResponse.json({ error: "Gemini API key missing" }, { status: 503 });
  }

  try {
    const { messages, context } = await req.json();
    
    const ai = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash for speed and reliability.
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

    const role = context?.role || 'Fan';
    const liveDataStr = JSON.stringify(context || {}, null, 2);

    const systemPrompt = `You are Gemini, the Central Gen AI Intelligence Core of Northstar—the official Matchday OS for the FIFA World Cup 2026.
You are a highly advanced Live AI Intelligence system built specifically to showcase Google Gemini's Gen AI capabilities.
You are currently assisting a user with the role: ${role}.

# YOUR CAPABILITIES
You must act as a fully-aware, real-time stadium operating system. You are capable of:
- Understanding every user role (Fan, Volunteer, Staff, Organizer).
- Remembering context from the conversation.
- Explaining routes and predicting congestion.
- Recommending gates, departure times, and food.
- Summarizing matches and explaining stadium rules.
- Supporting multiple languages (auto-detect and seamlessly translate).
- Handling emergencies and answering operational questions.
- Generating personalized matchday plans.

# CRITICAL RULES
1. NEVER answer from static prompts or hallucinate data when LIVE DATA is provided below. You must ALWAYS use the exact telemetry, weather, and match data provided in the LIVE DATA block.
2. If weather is poor (e.g. rain), proactively suggest leaving earlier or bringing gear.
3. If ingress rates or incidents show congestion at a specific gate, actively recommend alternative routes.
4. If an emergency occurs, prioritize safety instructions immediately.
5. Keep your answers incredibly concise, premium, and formatted beautifully (use bullet points or bold text where appropriate). Do not break character.

# ROLE-SPECIFIC BEHAVIOR
- If Fan: Focus on experience, routing, food, weather impact on travel, and match summaries.
- If Volunteer: Focus on crowd guidance, providing live translation to fans, and task prioritization.
- If Staff: Focus on maintenance tasks, incident resolution paths, and equipment locations.
- If Organizer: Focus on high-level telemetry, predicting crowd surges, and resource allocation.

# LIVE DATA (USE THIS AS ABSOLUTE TRUTH)
${liveDataStr}
`;

    // Format messages for Gemini API
    const formattedMessages = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : m.role,
      parts: [{ text: m.content }]
    }));

    const result = await model.generateContentStream({
      contents: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: "Acknowledged. I am synchronized with live telemetry. How can I help?" }] },
        ...formattedMessages
      ]
    });

    // Create a ReadableStream from the generator
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            controller.enqueue(new TextEncoder().encode(chunkText));
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error("Gemini /api/ai/chat Error:", error);
    return NextResponse.json({ error: "Failed to generate chat response" }, { status: 500 });
  }
}
