# Northstar API Integration Guide

This guide explains how Northstar connects to external data sources, how the fallback architecture works, and how to configure environment variables.

## Overview

Northstar uses a **Graceful Fallback Architecture** for its API layer. If an API key is missing or an external service fails, the system automatically falls back to realistic mock data. This ensures the application **never crashes** during presentations, development, or network outages.

All external service calls must be made through the exported instances in `src/services/index.ts`.

### Available Services

- **`aiService`**: Powers the dynamic recommendations and reasoning engine.
- **`mapService`**: Handles geographic routing and optimization.
- **`matchService`**: Retrieves live football match details and events.
- **`weatherService`**: Fetches real-time weather at the stadium.

---

## 1. Environment Setup (API Keys)

To connect Northstar to live data, you must provide the following API keys in a `.env.local` file located in the `frontend/` directory. If any key is omitted, the corresponding service will run in "Mock Mode".

```env
# 1. Gemini API Key (AI Reasoning Engine)
# Obtain from: https://aistudio.google.com/
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key_here

# 2. Mapbox / Google Maps API Key (Routing & Digital Twin)
# Obtain from: https://console.cloud.google.com/
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_gmaps_key_here
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here

# 3. Football Data API (Match Events & Details)
# Obtain from: https://www.api-football.com/
NEXT_PUBLIC_FOOTBALL_API_KEY=your_football_key_here

# 4. OpenWeatherMap API (Live Weather)
# Obtain from: https://openweathermap.org/api
NEXT_PUBLIC_WEATHER_API_KEY=your_weather_key_here
```

---

## 2. Switching Between Mock and Live Mode

You **do not** need to change any code to switch between Mock and Live modes. 

**To use Mock Mode:**
Simply leave the API key blank or undefined in your `.env.local` file. The service will automatically log a warning and return data from `MockData.ts`.

**To use Live Mode:**
Populate the corresponding key in `.env.local` and restart the development server. The service will detect the key and attempt to fetch live data. If the live fetch fails (e.g. timeout or invalid key), it will catch the error, report it to the `useApiStore`, and return Mock data so the UI does not break.

---

## 3. Using Services in UI Components

To maintain consistent Loading, Error, and Empty states, **do not** call services directly in `useEffect`. Instead, use the custom `useService` hook combined with the `<DataBoundary>` component.

### Example Implementation

```tsx
import { useCallback } from "react";
import { weatherService } from "@/services";
import { useService } from "@/hooks/useService";
import { DataBoundary } from "@/components/ui/DataBoundary";

export function WeatherWidget() {
  // 1. Wrap the service call in a useCallback
  const fetchWeather = useCallback(() => weatherService.getCurrentWeather(40.8128, -74.0742), []);
  
  // 2. Pass it to the useService hook
  const weatherState = useService(fetchWeather);

  return (
    // 3. Render the DataBoundary with fallback options
    <DataBoundary 
      state={weatherState}
      loadingFallback={<div className="animate-pulse">Loading weather...</div>}
      errorFallback={(err, retry) => <button onClick={retry}>Failed. Retry?</button>}
    >
      {(weather) => (
        <div>
          Temperature: {weather.temperatureC}°C ({weather.condition})
        </div>
      )}
    </DataBoundary>
  );
}
```

This pattern ensures that every asynchronous call provides a premium user experience without blank screens or unhandled promise rejections.
