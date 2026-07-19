# Northstar Architecture

## FIFA Smart Stadium Challenge Alignment
Northstar is structurally engineered to address the specific requirements of the FIFA World Cup 2026 Smart Stadium problem statement:
- **Fan Safety & Crowd Management**: Handled via `useTelemetryStore` tracking live crowd density and routing.
- **Stadium Operations & Tournament Management**: Handled via the Organizer and Staff Copilots (`GeminiAIService.ts`).
- **Volunteer Coordination & Staff Productivity**: Handled via dedicated role views (VolunteerCopilot, StaffCopilot) maximizing operational efficiency.
- **AI-Assisted Decision Making & Real-time Operational Intelligence**: Core logic powered by Gemini 1.5 Flash in Next.js edge API routes.
- **Emergency Response & Smart Navigation**: Dynamic pathfinding in `LiveMapService.ts` reacts to live incidents.
- **Sustainability & Accessibility**: System tracks energy use via telemetry and enforces WCAG 2.1 AA across all UI components.

## Ecosystem
Northstar separates the presentation layer (Next.js) from the logic and AI orchestration layer (FastAPI). The system provides tailored interfaces for four primary user roles, all powered by a centralized real-time telemetry engine:

1. **Organizer**: High-level stadium operations, crowd management, predictive analytics, and sustainability monitoring.
2. **Staff**: Facility operations, maintenance tasks, and staff productivity tools.
3. **Volunteer**: On-the-ground volunteer coordination, translation assistance, and emergency response.
4. **Fan**: Smart navigation, accessibility routes, and fan safety features.

### Data Flow
1. **Client** (Next.js) -> Requests Context / Data based on active Role.
2. **API** (FastAPI) -> Aggregates simulated digital twin data (Crowd, Transit, Weather, Sustainability, Incidents).
3. **AI** (Gemini) -> FastAPI requests decision support from Gemini using the aggregated context and user intent. AI-assisted decision making is used to dynamically route fans, rebalance HVAC, or dispatch volunteers.
4. **Response** -> Client renders JSON AI payloads into native UI components for seamless real-time operational intelligence.
