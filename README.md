# 🌟 Northstar: AI-Powered Digital Twin for FIFA World Cup 2026

![Northstar Banner](https://via.placeholder.com/1200x400?text=Northstar:+Smart+Stadium+Operations)

**Northstar** is a GenAI-powered operating system designed to optimize stadium operations and enhance the FIFA World Cup 2026 experience through intelligent, real-time assistance. 

---

## 🏆 Project Overview & Problem Statement

**The Problem:** Large-scale sporting events like the FIFA World Cup face monumental challenges in crowd management, emergency response, and overall stadium operations. Real-time coordination among fans, staff, and organizers is critical to prevent bottlenecks, ensure safety, and deliver a world-class experience.

**Our Solution (Northstar):** By leveraging a live Digital Twin architecture combined with **Google Gemini Generative AI**, Northstar ingests real-time telemetry—including foot traffic, weather conditions, transit schedules, and incident reports—to provide instantaneous, actionable intelligence to all stakeholders.

**Chosen Vertical:** Smart Stadium & Tournament Operations

---

## ✨ Features & Capabilities

### 🛡️ Crowd Management & Fan Safety
- **Predictive Analytics:** AI models predict crowd crushes and queue times at gates, restrooms, and concessions before they happen.
- **Smart Navigation:** Real-time routing directs fans through less congested pathways, including low-sensory and accessible routes.
- **Emergency Response:** Instant automated rerouting and alert dispatching during critical incidents.

### ⚙️ Stadium Operations & Digital Twin
- **Real-Time Operational Intelligence:** Organizers view a live, 3D-mapped digital twin of the stadium with heatmap overlays.
- **Sustainability Monitoring:** Live tracking of energy consumption, water usage, and waste management across the venue.
- **Tournament Operations:** Cross-venue visibility for FIFA administrators to monitor multiple stadiums simultaneously.

### 🤖 AI Matchday Assistant & Staff Productivity
- **Volunteer Coordination:** AI Copilots intelligently route volunteers to incident zones or high-demand areas.
- **Multilingual Support:** Instantaneous, context-aware translations via Gemini AI for international fans and staff.
- **Decision Support:** Automated operational recommendations for staff (e.g., "Open Gate 3 to relieve pressure on Gate 2").

---

## 🧠 AI Workflow

1. **Ingestion:** Live telemetry (weather, ticketing, sensors) flows into the Northstar state manager.
2. **Analysis:** Google Gemini processes this multimodal data to identify anomalies or optimization opportunities.
3. **Action:** Gemini generates operational recommendations (e.g., redirecting staff) and updates the Digital Twin UI in real-time.

---

## 🏗️ Architecture Diagram

```mermaid
graph TD
    subgraph Users
        F[Fans]
        S[Staff & Volunteers]
        O[Organizers]
    end

    subgraph Frontend [Next.js App Router]
        UI[Role-Based Dashboards]
        MAP[MapLibre Digital Twin]
        STATE[Zustand Telemetry Store]
    end

    subgraph Backend APIs [FastAPI & Next.js Routes]
        AI[Gemini AI Copilot]
        OPS[Operations Engine]
    end

    subgraph External Services
        DB[(Supabase)]
        W[OpenWeather API]
        R[OSRM Routing]
    end

    F & S & O --> UI
    UI --> MAP
    UI --> STATE
    STATE <--> Backend APIs
    Backend APIs <--> AI
    Backend APIs <--> External Services
```

---

## 📂 Folder Structure

```text
northstar/
├── frontend/
│   ├── src/
│   │   ├── app/           # Next.js App Router (Pages & API Routes)
│   │   ├── components/    # Reusable UI, Map Overlays, Widgets
│   │   ├── hooks/         # Custom React Hooks
│   │   ├── lib/           # Utility functions (Supabase client)
│   │   ├── services/      # Gemini, Weather, Maps API wrappers
│   │   └── store/         # Zustand State Management
│   └── public/            # Static assets
├── backend/
│   └── models/            # Python FastAPI models (if used independently)
└── docs/                  # Architecture and Integration Guides
```

---

## 💻 Technology Stack

- **Frontend:** Next.js 15 (React 19), TypeScript, Tailwind CSS, Framer Motion, Zustand
- **Backend / API Layer:** Next.js Serverless Functions, Python (FastAPI)
- **AI Engine:** Google Gemini (1.5 Flash)
- **Database:** Supabase (PostgreSQL)
- **Mapping & Routing:** React-Map-GL (MapLibre), OpenStreetMap, OSRM
- **Testing:** Vitest, React Testing Library

---

## 🚀 Installation & Setup Guide

### Prerequisites
- Node.js (v18+)
- Python 3.10+
- A Google Gemini API Key

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AbhineetS/northstar.git
   cd northstar
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Backend Setup (Optional local simulator):**
   ```bash
   cd ../backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

---

## 🔑 Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
# Google Gemini API
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# MapLibre / Maptiler
NEXT_PUBLIC_MAPTILER_KEY=your_maptiler_key

# Weather
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_key
```

---

## 🔌 API Integrations

- **Google Gemini API:** Drives the natural language processing, operational recommendations, and multilingual support.
- **OpenWeather API:** Provides live weather data mapped to stadium coordinates to predict delays or emergencies.
- **Supabase:** Manages persistent state, user authentication, and telemetry logs.
- **OSRM (Open Source Routing Machine):** Calculates accessible and optimized walking paths inside and outside the stadium.

---

## 🧪 Testing Instructions

The project uses `Vitest` for lightning-fast unit and integration testing.

```bash
cd frontend
# Run tests
npm run test

# Run test coverage report (Target: 100%)
npx vitest run --coverage
```

---

## 🌐 Deployment Guide

This project is optimized for deployment on **Vercel**.

1. Connect your GitHub repository to Vercel.
2. Ensure the Framework Preset is set to `Next.js`.
3. Add the required Environment Variables in the Vercel dashboard.
4. Click **Deploy**. Vercel will automatically build and deploy the `main` branch.

---

## 🔮 Assumptions & Future Improvements

**Assumptions:**
- Stadiums have adequate Wi-Fi or 5G infrastructure for real-time telemetry.
- Staff and Volunteers use mobile devices to access the Northstar dashboard.

**Future Improvements:**
- **Computer Vision Integration:** Connect stadium CCTV directly into the AI engine for automated anomaly detection.
- **Biometric Ticketing integration:** Seamless gate entry mapping directly into the digital twin.
- **AR Navigation:** Augmented Reality overlay for fans navigating to their seats via their mobile cameras.

---

## 📜 License & Hackathon Info
This project was developed for the Hack2Skill FIFA World Cup 2026 AI Hackathon.
License: MIT
