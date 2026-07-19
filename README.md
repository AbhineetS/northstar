# Northstar

**AI-Powered Digital Twin for Smart Stadiums & Tournament Operations**

Northstar is an intelligent platform built for the FIFA World Cup 2026 that unifies real-time operations, AI assistance, live weather, navigation, and tournament analytics into a single experience for fans, staff, volunteers, and organizers.

---

## Overview

Large sporting events require continuous coordination between thousands of people and systems. Northstar combines AI and live data to improve decision-making, operational efficiency, safety, and fan experience through one centralized platform.

---

## Features

### Fan Experience & Accessibility

- AI Matchday Assistant
- Live Match Information
- Smart Stadium Navigation (incl. Wheelchair & Low-sensory Routes)
- Interactive Maps
- Weather Intelligence
- Personalized Recommendations & Fan Safety

### Operations & Real-time Intelligence

- Digital Twin & Stadium Operations
- Crowd Management & Monitoring
- AI-Assisted Decision Making
- Predictive Analytics (Queue times, Incident Probabilities)
- Live Weather Monitoring
- Real-time Operational Intelligence
- Sustainability Dashboard (Energy, Water, Waste)
- Tournament Management (Cross-venue visibility)

### Staff & Volunteer Coordination

- Volunteer Coordination & Dispatch
- Smart Task Assignment
- Staff Productivity & AI Copilot
- Emergency Response & Support
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

Northstar demonstrates how Generative AI and real-time intelligence can revolutionize **Stadium Operations** and **Tournament Management**. By providing tools tailored for Organizers, Staff, Volunteers, and Fans, Northstar improves **Crowd Management**, **Fan Safety**, **Staff Productivity**, and **Emergency Response**.

With integrated **Sustainability** tracking, **Predictive Analytics**, and **Smart Navigation** emphasizing **Accessibility**, Northstar acts as the definitive digital brain for the FIFA World Cup 2026.

---

## License

MIT License
