# 🔌 Northstar API Integration Guide

This document provides a comprehensive overview of the external services and APIs integrated into the Northstar Smart Stadium Platform. It details the authentication mechanisms, data flows, and error handling strategies employed to maintain maximum reliability during high-traffic tournament events.

---

## 1. Google Gemini (Generative AI)

Northstar utilizes **Google Gemini 1.5 Flash** as its core intelligence engine. It processes live telemetry and natural language queries to provide operational recommendations.

### Integration Details
- **Service Layer:** `src/services/GeminiAIService.ts`
- **Model Used:** `gemini-1.5-flash`
- **Authentication:** API Key (`NEXT_PUBLIC_GEMINI_API_KEY`)

### Key Workflows
1. **Multilingual Translation:** Translates fan queries into the native language of the stadium staff instantly.
2. **Operations Copilot:** Ingests JSON telemetry (crowd density, incidents) and outputs actionable JSON recommendations for the Organizer Command Center.
3. **Emergency Routing:** Calculates safe evacuation routes based on incident location coordinates.

### Security & Error Handling
- All inputs from the user are sanitized before being passed to the model prompt.
- The service enforces strict JSON schema output requirements from the model.
- Includes automatic fallback messages if the AI matrix is unreachable (`"Failed to connect to translation matrix."`).

---

## 2. OpenWeather API

Live weather intelligence is crucial for predicting delays and managing fan safety (e.g., extreme heat, lightning protocols).

### Integration Details
- **Service Layer:** `src/services/LiveWeatherService.ts`
- **Endpoint:** `https://api.openweathermap.org/data/2.5/weather`
- **Authentication:** API Key (`NEXT_PUBLIC_OPENWEATHER_API_KEY`)

### Key Workflows
- The application periodically polls the OpenWeather API using the stadium's longitude and latitude defined in `VenueConfig.ts`.
- The data is transformed into a simplified `WeatherState` object and stored in `useAppStore`.

---

## 3. MapLibre / React-Map-GL (Digital Twin)

The 3D interactive Digital Twin of the stadium is powered by MapLibre GL JS, providing high-performance WebGL vector maps.

### Integration Details
- **Component Layer:** `src/components/map/MapContainer.tsx`
- **Provider:** MapTiler (or default OSM)
- **Authentication:** API Key (`NEXT_PUBLIC_MAPTILER_KEY`)

### Key Workflows
- **Heatmaps:** Crowd density telemetry is converted into GeoJSON points and rendered as a heatmap layer (`HeatmapLayer.tsx`).
- **Fan POIs:** Points of Interest (restrooms, gates, concessions) are dynamically plotted as MapLibre Markers.

---

## 4. OSRM (Open Source Routing Machine)

To provide accessible and efficient smart navigation outside and around the stadium perimeter.

### Integration Details
- **Service Layer:** `src/services/LiveMapService.ts`
- **Endpoint:** `https://router.project-osrm.org/route/v1/foot/`
- **Authentication:** None (Public API for demonstration, enterprise routing recommended for production)

### Key Workflows
- Accepts a start and end coordinate.
- Requests the `foot` profile to calculate walking distances and durations.
- Returns a decoded polyline to render on the `NavigationOverlay.tsx`.

---

## 5. Supabase (Database & Authentication)

Supabase serves as the PostgreSQL backend for persistent state, user authentication, and telemetry logging.

### Integration Details
- **Client Layer:** `src/lib/supabase.ts`
- **Authentication:** URL and Anon Key (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### Key Workflows
- Validates secure connections using standard Row Level Security (RLS) rules defined in the database schema.
- Provides real-time subscriptions (if configured) for instant incident updates across all connected client dashboards.

---

## 🛡️ General API Security Standards

To maintain our **100/100 Security Score**:
1. **Environment Variables:** No secrets are ever hardcoded. All keys must be passed via the Vercel deployment environment or local `.env.local` files.
2. **Server-Side Proxying:** Sensitive API calls (like custom AI routes) are routed through Next.js API Routes (`app/api/...`) to prevent exposing critical logic or keys to the client bundle.
3. **Rate Limiting:** Custom rate limiters (`src/lib/rate-limit.ts`) are implemented on public-facing API routes to prevent DDoS or quota exhaustion.
