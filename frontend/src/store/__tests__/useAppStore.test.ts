import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAppStore } from '../useAppStore';
import { weatherService, matchService, mapService } from '../../services';
import { IWeatherCondition, ILiveMatchStats, IMatchDetails, IRouteOptimization } from '../../services/interfaces';

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
    expect(useAppStore.getState().role).toBe('Organizer');
  });

  it('sets location and fetches weather', async () => {
    vi.mocked(weatherService.getCurrentWeather).mockResolvedValueOnce({ condition: 'clear' } as unknown as IWeatherCondition);
    
    useAppStore.getState().setLocation(51.5, -0.1);
    
    expect(useAppStore.getState().location).toEqual({ lat: 51.5, lon: -0.1 });
    expect(weatherService.getCurrentWeather).toHaveBeenCalledWith(51.5, -0.1);
  });

  describe('fetchWeather', () => {
    it('handles success', async () => {
      const mockWeather = { condition: 'rain' };
      vi.mocked(weatherService.getCurrentWeather).mockResolvedValueOnce(mockWeather as unknown as IWeatherCondition);
      
      await useAppStore.getState().fetchWeather();
      
      const state = useAppStore.getState().weather;
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.data).toEqual(mockWeather);
      expect(state.isEmpty).toBe(false);
    });

    it('handles error', async () => {
      const error = new Error('Weather Failed');
      vi.mocked(weatherService.getCurrentWeather).mockRejectedValueOnce(error);
      
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
      vi.mocked(matchService.getLiveMatch).mockResolvedValueOnce(mockMatch as unknown as ILiveMatchStats);
      
      await useAppStore.getState().fetchMatch();
      
      const state = useAppStore.getState().match;
      expect(state.isLoading).toBe(false);
      expect(state.data).toEqual(mockMatch);
    });
  });

  describe('fetchMatchDetails', () => {
    it('handles success', async () => {
      const mockDetails = { homeTeam: 'Team A' };
      vi.mocked(matchService.getMatchDetails).mockResolvedValueOnce(mockDetails as unknown as IMatchDetails);
      
      await useAppStore.getState().fetchMatchDetails();
      
      const state = useAppStore.getState().matchDetails;
      expect(state.isLoading).toBe(false);
      expect(state.data).toEqual(mockDetails);
    });
  });

  describe('fetchRoute', () => {
    it('handles success with parsed coordinates', async () => {
      const mockRoute = { estimatedMinutes: 20 };
      vi.mocked(mapService.getOptimizedRoute).mockResolvedValueOnce(mockRoute as unknown as IRouteOptimization);
      
      await useAppStore.getState().fetchRoute('51.5,-0.1', '51.6,-0.2');
      
      expect(mapService.getOptimizedRoute).toHaveBeenCalledWith([51.5, -0.1], [51.6, -0.2]);
      const state = useAppStore.getState().route;
      expect(state.isLoading).toBe(false);
      expect(state.data).toEqual(mockRoute);
    });

    it('handles error', async () => {
      const error = new Error('Route Failed');
      vi.mocked(mapService.getOptimizedRoute).mockRejectedValueOnce(error);
      
      await useAppStore.getState().fetchRoute('0,0', '1,1');
      
      const state = useAppStore.getState().route;
      expect(state.error).toBe(error);
    });
  });
});
