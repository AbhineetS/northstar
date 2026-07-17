import { create } from 'zustand';
import { IWeatherCondition, ILiveMatchStats, IRouteOptimization, IMatchDetails } from '@/services/interfaces';
import { weatherService, matchService, mapService } from '@/services';
import { ServiceState } from '@/hooks/useService';

export type UserRole = 'Fan' | 'Volunteer' | 'Organizer' | 'Staff';

const createEmptyState = <T>(): ServiceState<T> => ({
  data: null,
  isLoading: true,
  error: null,
  isEmpty: true
});

interface AppState {
  role: UserRole;
  setRole: (role: UserRole) => void;
  
  location: { lat: number; lon: number } | null;
  setLocation: (lat: number, lon: number) => void;

  weather: ServiceState<IWeatherCondition>;
  fetchWeather: () => Promise<void>;

  match: ServiceState<ILiveMatchStats>;
  fetchMatch: () => Promise<void>;

  matchDetails: ServiceState<IMatchDetails>;
  fetchMatchDetails: () => Promise<void>;

  route: ServiceState<IRouteOptimization>;
  fetchRoute: (origin: string, dest: string) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  role: 'Fan',
  setRole: (role) => set({ role }),

  location: null,
  setLocation: (lat, lon) => {
    set({ location: { lat, lon } });
    get().fetchWeather();
  },

  weather: createEmptyState(),
  fetchWeather: async () => {
    set({ weather: { ...get().weather, isLoading: true, error: null } });
    try {
      const loc = get().location || { lat: 40.8128, lon: -74.0742 }; 
      const w = await weatherService.getCurrentWeather(loc.lat, loc.lon);
      set({ weather: { data: w, isLoading: false, error: null, isEmpty: !w } });
    } catch (e) {
      set({ weather: { data: null, isLoading: false, error: e as Error, isEmpty: true } });
    }
  },

  match: createEmptyState(),
  fetchMatch: async () => {
    set({ match: { ...get().match, isLoading: true, error: null } });
    try {
      const ms = await matchService.getLiveMatch("m-1"); 
      set({ match: { data: ms, isLoading: false, error: null, isEmpty: !ms } });
    } catch (e) {
      set({ match: { data: null, isLoading: false, error: e as Error, isEmpty: true } });
    }
  },

  matchDetails: createEmptyState(),
  fetchMatchDetails: async () => {
    set({ matchDetails: { ...get().matchDetails, isLoading: true, error: null } });
    try {
      const md = await matchService.getMatchDetails("m-1"); 
      set({ matchDetails: { data: md, isLoading: false, error: null, isEmpty: !md } });
    } catch (e) {
      set({ matchDetails: { data: null, isLoading: false, error: e as Error, isEmpty: true } });
    }
  },

  route: createEmptyState(),
  fetchRoute: async (origin, dest) => {
    set({ route: { ...get().route, isLoading: true, error: null } });
    try {
      // For map routes we need [number, number] but let's assume origin/dest are strings that mapService can handle or adjust
      // MapLibre uses coords, wait mapService takes [number, number], [number, number]
      // Let's just bypass this in fetchRoute, we can cast them
      const originCoords = origin.split(',').map(Number) as [number, number];
      const destCoords = dest.split(',').map(Number) as [number, number];
      const rt = await mapService.getOptimizedRoute(originCoords, destCoords);
      set({ route: { data: rt, isLoading: false, error: null, isEmpty: !rt } });
    } catch (e) {
      set({ route: { data: null, isLoading: false, error: e as Error, isEmpty: true } });
    }
  },
}));
