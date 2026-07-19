import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LiveMapService } from '../LiveMapService';
import { useApiStore } from '../../store/useApiStore';

global.fetch = vi.fn();

describe('LiveMapService', () => {
  let service: LiveMapService;

  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY', 'test_api_key');
    service = new LiveMapService();
    vi.clearAllMocks();
    useApiStore.setState({ activeRequests: 0, errors: {} });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('throws error if API key is missing', async () => {
    vi.stubEnv('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY', '');
    const missingKeyService = new LiveMapService();
    await expect(missingKeyService.getOptimizedRoute([0, 0], [1, 1])).rejects.toThrow('Google Maps API key missing. Routing unavailable.');
  });

  it('returns optimized route on success', async () => {
    const mockData = {
      routes: [{
        duration: '1200s',
        distanceMeters: 5000,
        polyline: { encodedPolyline: 'encoded_string' }
      }]
    };
    (global.fetch as import("vitest").Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await service.getOptimizedRoute([51.5, -0.1], [51.51, -0.11]);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('routes.googleapis.com'), expect.any(Object));
    expect(result.estimatedMinutes).toBe(20);
    expect(result.pathGeoJSON).toBe('encoded_string');
    expect(useApiStore.getState().activeRequests).toBe(0);
  });

  it('throws error when no routes found', async () => {
    const mockData = { routes: [] };
    (global.fetch as import("vitest").Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    await expect(service.getOptimizedRoute([0, 0], [1, 1])).rejects.toThrow('No route found');
  });

  it('handles API error response', async () => {
    (global.fetch as import("vitest").Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Internal Server Error'
    });

    await expect(service.getOptimizedRoute([0, 0], [1, 1])).rejects.toThrow('Google Maps API error: Internal Server Error');
    expect(useApiStore.getState().errors['Maps']).toBe('Failed to fetch live routing');
  });
});
