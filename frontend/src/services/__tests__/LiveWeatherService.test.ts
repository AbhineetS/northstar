import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LiveWeatherService } from '../LiveWeatherService';
import { useApiStore } from '../../store/useApiStore';

// Mock the global fetch
global.fetch = vi.fn();

describe('LiveWeatherService', () => {
  let service: LiveWeatherService;

  beforeEach(() => {
    service = new LiveWeatherService();
    vi.clearAllMocks();
    useApiStore.setState({ activeRequests: 0, errors: {} });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });



  it('handles successful API responses (Rain)', async () => {
    const mockWeather = { weather: [{ id: 500, description: 'light rain' }], main: { temp: 20 }, wind: { speed: 5 } };
    const mockForecast = { list: [{ pop: 0.8 }] };
    
    (global.fetch as import("vitest").Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ weatherData: mockWeather, forecastData: mockForecast })
    });

    const result = await service.getCurrentWeather(51.5, -0.1);
    
    expect(result.condition).toBe('rain');
    expect(result.temperatureC).toBe(20);
    expect(result.rainProbability).toBe(80);
    expect(result.windSpeedKmh).toBe(18); // 5 * 3.6
    expect(result.alerts).toEqual([]);
    expect(useApiStore.getState().activeRequests).toBe(0);
  });

  it('handles successful API responses with alerts (Thunderstorm & Tornado)', async () => {
    const mockWeather = { weather: [{ id: 200, description: 'thunderstorm with light rain' }], main: { temp: 25 }, wind: { speed: 10 } };
    const mockForecast = { list: [{ pop: 0.9 }] };
    
    (global.fetch as import("vitest").Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ weatherData: mockWeather, forecastData: mockForecast })
    });

    const result = await service.getCurrentWeather(51.5, -0.1);
    
    expect(result.condition).toBe('rain');
    expect(result.alerts).toContain('Thunderstorm Warning');
  });

  it('handles API error response', async () => {
    (global.fetch as import("vitest").Mock).mockResolvedValue({
      ok: false,
    });

    await expect(service.getCurrentWeather(0, 0)).rejects.toThrow('Weather API error');
    expect(useApiStore.getState().errors['Weather']).toBe('Failed to fetch live weather');
    expect(useApiStore.getState().activeRequests).toBe(0);
  });
});
