import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Weather API key missing" }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json({ error: "Missing lat or lon parameters" }, { status: 400 });
  }

  try {
    const [weatherRes, forecastRes] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    ]);

    if (!weatherRes.ok || !forecastRes.ok) {
      return NextResponse.json({ error: "Failed to fetch weather data from provider" }, { status: 502 });
    }

    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();

    return NextResponse.json({ weatherData, forecastData });
  } catch (error) {
    console.error("Weather Proxy Error:", error);
    return NextResponse.json({ error: "Internal server error fetching weather" }, { status: 500 });
  }
}
