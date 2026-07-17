# Pulse Architecture

## Ecosystem
Pulse separates the presentation layer (Next.js) from the logic and AI orchestration layer (FastAPI).

### Data Flow
1. **Client** (Next.js) -> Requests Context / Data.
2. **API** (FastAPI) -> Aggregates from Supabase + Mock Simulators.
3. **AI** (Gemini) -> FastAPI requests decision support from Gemini using the aggregated context.
4. **Response** -> Client renders JSON AI payloads into native UI components.
