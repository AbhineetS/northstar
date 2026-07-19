import { IWeatherCondition, IWeatherService } from "./interfaces";
import { useApiStore } from "../store/useApiStore";

export class LiveWeatherService implements IWeatherService {

  async getCurrentWeather(lat: number, lon: number): Promise<IWeatherCondition> {
    useApiStore.getState().startRequest();
    try {
      const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      
      if (!response.ok) {
        throw new Error(`Weather API error`);
      }

      const { weatherData, forecastData } = await response.json();
      useApiStore.getState().endRequest();

      const pop = forecastData.list && forecastData.list.length > 0 ? forecastData.list[0].pop : 0;
      
      let internalCondition: IWeatherCondition["condition"] = "clear";
      const weatherId = weatherData.weather[0].id;
      const alerts: string[] = [];

      if (weatherId >= 200 && weatherId < 600) internalCondition = "rain";
      else if (weatherId >= 600 && weatherId < 700) internalCondition = "snow";
      else if (weatherId >= 700 && weatherId < 800) internalCondition = "extreme";
      else if (weatherId > 800) internalCondition = "clouds";

      if (weatherId >= 200 && weatherId < 232) alerts.push("Thunderstorm Warning");
      if (weatherId === 781) alerts.push("Tornado Warning");
      if (weatherId === 771) alerts.push("Squall Warning");
      if (weatherId === 762) alerts.push("Volcanic Ash Warning");
      if (weatherId === 711) alerts.push("Smoke Alert");
      if (weatherId === 751 || weatherId === 731) alerts.push("Sand/Dust Alert");

      return {
        condition: internalCondition,
        temperatureC: Math.round(weatherData.main.temp),
        description: weatherData.weather[0].description,
        rainProbability: Math.round(pop * 100),
        windSpeedKmh: Math.round(weatherData.wind.speed * 3.6),
        uvIndex: 4, 
        alerts: alerts
      };
    } catch (e) {
      console.error("WeatherService API Error:", e);
      useApiStore.getState().setError("Weather", "Failed to fetch live weather");
      useApiStore.getState().endRequest();
      throw e;
    }
  }
}
