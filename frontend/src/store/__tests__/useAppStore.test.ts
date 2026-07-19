import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAppStore } from '../useAppStore';
import { weatherService, matchService, mapService } from '../../services';

// Mock the services
vi.mock('../../services', () => ({
  weatherService: {
    getCurrentWeather: vi.fn(),
  },
  matchService: {
    getLiveMatch: vi.fn(),
    getMatchDetails: vi.fn(),
  },
  mapService: {
    getOptimizedRoute: vi.fn(),
  }
}));

describe('useAppStore', () => {
  const initialState = useAppStore.getState();

  beforeEach(() => {
    useAppStore.setState(initialState);
    vi.clearAllMocks();
  });

  it('sets role correctly', () => {
    useAppStore.getState().setRole('Organizer');
    expect(useAppStore.getState().role as any).toBe('Organizer');
  });

  it('sets location and fetches weather', async () => {
    vi.mocked(weatherService.getCurrentWeather).mockResolvedValueOnce({ condition: 'clear' });
    
    useAppStore.getState().setLocation(51.5, -0.1);
    
    expect(useAppStore.getState().location as any).toEqual({ lat: 51.5, lon: -0.1 });
    expect(weatherService.getCurrentWeather).toHaveBeenCalledWith(51.5, -0.1);
  });

  describe('fetchWeather', () => {
    it('handles success', async () => {
      const mockWeather = { condition: 'rain' };
      vi.mocked(weatherService.getCurrentWeather).mockResolvedValueOnce(mockWeather);
      
      await useAppStore.getState().fetchWeather();
      
      const state = useAppStore.getState().weather;
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.data).toEqual(mockWeather);
      expect(state.isEmpty).toBe(false);
    });

    it('handles error', async () => {
      const error = new Error('Weather Failed');
      (weatherService.getCurrentWeather as unknown).mockRejectedValueOnce(error);
      
      await useAppStore.getState().fetchWeather();
      
      const state = useAppStore.getState().weather;
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(error);
      expect(state.data).toBeNull();
    });
  });

  describe('fetchMatch', () => {
    it('handles success', async () => {
      const mockMatch = { status: 'Live' };
      (matchService.getLiveMatch as unknown).mockResolvedValueOnce(mockMatch);
      
      await useAppStore.getState().fetchMatch();
      
      const state = useAppStore.getState().match;
      expect(state.isLoading).toBe(false);
      expect(state.data).toEqual(mockMatch);
    });
  });

  describe('fetchMatchDetails', () => {
    it('handles success', async () => {
      const mockDetails = { homeTeam: 'Team A' };
      (matchService.getMatchDetails as unknown).mockResolvedValueOnce(mockDetails);
      
      await useAppStore.getState().fetchMatchDetails();
      
      const state = useAppStore.getState().matchDetails;
      expect(state.isLoading).toBe(false);
      expect(state.data).toEqual(mockDetails);
    });
  });

  describe('fetchRoute', () => {
    it('handles success with parsed coordinates', async () => {
      const mockRoute = { estimatedMinutes: 20 };
      (mapService.getOptimizedRoute as unknown).mockResolvedValueOnce(mockRoute);
      
      await useAppStore.getState().fetchRoute('51.5,-0.1', '51.6,-0.2');
      
      expect(mapService.getOptimizedRoute).toHaveBeenCalledWith([51.5, -0.1], [51.6, -0.2]);
      const state = useAppStore.getState().route;
      expect(state.isLoading).toBe(false);
      expect(state.data).toEqual(mockRoute);
    });

    it('handles error', async () => {
      const error = new Error('Route Failed');
      (mapService.getOptimizedRoute as unknown).mockRejectedValueOnce(error);
      
      await useAppStore.getState().fetchRoute('0,0', '1,1');
      
      const state = useAppStore.getState().route;
      expect(state.error).toBe(error);
    });
  });
});
