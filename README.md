# Northstar

**AI-Powered Digital Twin for Smart Stadiums & Tournament Operations**

Northstar is an intelligent platform built for the FIFA World Cup 2026 that unifies real-time operations, AI assistance, live weather, navigation, and tournament analytics into a single experience for fans, staff, volunteers, and organizers.

---

## Overview

Large sporting events require continuous coordination between thousands of people and systems. Northstar combines AI and live data to improve decision-making, operational efficiency, safety, and fan experience through one centralized platform.

---

## Features

### Fan Experience

- AI Matchday Assistant
- Live Match Information
- Stadium Navigation
- Interactive Maps
- Weather Intelligence
- Personalized Recommendations

### Operations Dashboard

- Digital Twin
- Crowd Monitoring
- Incident Management
- Predictive Analytics
- Live Weather Monitoring
- Operational Intelligence

### Staff & Volunteer Portal

- Smart Task Assignment
- AI Copilot
- Navigation Assistance
- Emergency Support
- Performance Tracking

---

## System Architecture

```text
                         Users
                           │
     ┌───────────────┬───────────────┬───────────────┐
     │               │               │
    Fans           Staff        Organizers
     │               │               │
     └───────────────┴───────────────┘
                     │
                     ▼
             Northstar Platform
                     │
      ┌──────────────┼──────────────┐
      │              │              │
      ▼              ▼              ▼
  Gemini AI     Live APIs      Supabase
      │              │              │
      └──────────────┴──────────────┘
                     │
                     ▼
     Recommendations • Navigation
     Crowd Insights • Weather Alerts
     Operations Dashboard
```

---

## Technology Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Backend | FastAPI, Python |
| Database | Supabase |
| AI | Google Gemini |
| Maps | MapLibre, OpenStreetMap, OSRM |
| APIs | OpenWeather, SportScore |

---

## Project Structure

```
northstar/
│
├── frontend/
├── backend/
├── docs/
└── README.md
```

---

## APIs

- Google Gemini
- OpenWeather API
- SportScore API
- Supabase
- MapLibre
- OpenStreetMap
- OSRM Routing

---

## Getting Started

Clone the repository

```bash
git clone https://github.com/AbhineetS/northstar.git
```

Install dependencies

```bash
cd frontend
npm install
npm run dev
```

Run backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## Vision

Northstar demonstrates how Generative AI and real-time intelligence can improve crowd management, stadium operations, navigation, safety, and fan engagement during large-scale international sporting events.

---

## License

MIT License
