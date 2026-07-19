# 🛠️ Northstar Development Guide

Welcome to the Northstar Development Guide. This document provides a comprehensive overview of how to set up, develop, and contribute to the Northstar Smart Stadium Platform, targeting the FIFA World Cup 2026 Hackathon problem statement.

---

## 1. System Requirements

Ensure your local development environment meets the following requirements:
- **Node.js**: v18.17.0 or higher
- **npm**: v9.0.0 or higher
- **Python**: v3.10 or higher (for backend simulator services)
- **Git**: Latest version

---

## 2. Local Setup & Installation

### Frontend Environment (Next.js)

The core application is housed in the `frontend` directory.

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Configure Environment Variables
cp .env.example .env.local
# Fill in your Gemini, MapLibre, and Supabase keys.

# 4. Start the development server
npm run dev
```
The application will be accessible at `http://localhost:3000`.

### Backend Environment (FastAPI)

The backend provides AI simulation routing and advanced predictive models (if running the full stack).

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start the backend server
uvicorn main:app --reload --port 8000
```
The API documentation will be available at `http://localhost:8000/docs`.

---

## 3. Architecture & Code Organization

### Frontend Architecture (`/frontend/src`)

- `/app`: Next.js App Router structure. Contains route groups for `(fans)`, `(organizer)`, `(staff)`, and `(volunteer)`.
- `/components`: Reusable UI components categorized by feature (e.g., `/map`, `/ops`, `/ui`).
- `/hooks`: Custom React hooks for data fetching and state encapsulation.
- `/services`: Abstraction layers for external APIs (Gemini, OpenWeather, LiveMapService).
- `/store`: Zustand state managers (`useAppStore`, `useTelemetryStore`, `useAIEngine`).
- `/lib`: Utility functions, formatters, and Supabase client configurations.

### Key Design Principles

1. **Strict TypeScript:** All components and services must be strictly typed. Avoid `any`.
2. **Server/Client Components:** Use `"use client"` only when necessary (e.g., Zustand stores, interactive maps, forms). Keep heavy data fetching on the server.
3. **Accessibility (a11y):** All UI components must implement ARIA labels, semantic HTML, and proper focus management.

---

## 4. Working with the AI Engine (Gemini)

The core feature of Northstar is the `useAIEngine` hook which interfaces with the `GeminiAIService`.

To add new AI workflows:
1. Define the input parameters and expected output schema in `GeminiAIService.ts`.
2. Add a new action to the `useAIEngine` Zustand store.
3. Ensure the prompt explicitly instructs the model to return structured JSON.

```typescript
// Example usage in a component
const { getOpsRecommendation, isProcessing } = useAIEngine();

const handleOptimize = async () => {
  const result = await getOpsRecommendation(telemetryData);
  console.log(result);
};
```

---

## 5. Map & Digital Twin Integration

Northstar uses `react-map-gl` (MapLibre GL JS) for the stadium digital twin.

- **Adding Layers:** Define new layers in `src/components/map/HeatmapLayer.tsx` or `FanPOIsOverlay.tsx`.
- **Coordinates:** All stadium coordinates are anchored to a central constant in `VenueConfig.ts`.
- **Testing:** The MapLibre library is mocked in the Vitest suite using a global alias. Do not attempt to mount the actual WebGL canvas in unit tests.

---

## 6. Testing Protocol

We enforce a **100% test coverage** requirement for all core components and services.

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npx vitest run --coverage
```

### Writing Tests
- Use `@testing-library/react` for components.
- Mock external services (e.g., `aiService`, `Supabase`) using `vi.mock()`.
- Ensure you test empty states, loading states, and error boundaries.

---

## 7. Linting & Formatting

Before committing, ensure your code adheres to our quality standards:

```bash
# Check for ESLint errors
npm run lint

# Check for TypeScript compilation errors
npx tsc --noEmit
```

*Note: The CI/CD pipeline will fail if either of these commands returns errors.*

---

## 8. Deployment

Northstar uses **Vercel** for automated deployments.

- **Main Branch:** Pushes to the `main` branch trigger a production deployment.
- **Preview Branches:** Pull Requests automatically generate preview deployments.

If adding new environment variables, ensure they are added to the Vercel project settings before deploying.

---

*Thank you for contributing to the Northstar Smart Stadium Platform!*
