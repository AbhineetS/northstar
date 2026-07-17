import { create } from "zustand";

interface ApiState {
  isOffline: boolean;
  activeRequests: number;
  errors: Record<string, string>;
  setOffline: (offline: boolean) => void;
  startRequest: () => void;
  endRequest: () => void;
  setError: (service: string, error: string) => void;
  clearError: (service: string) => void;
}

export const useApiStore = create<ApiState>((set) => ({
  isOffline: typeof window !== 'undefined' ? !navigator.onLine : false,
  activeRequests: 0,
  errors: {},
  setOffline: (offline) => set({ isOffline: offline }),
  startRequest: () => set((state) => ({ activeRequests: state.activeRequests + 1 })),
  endRequest: () => set((state) => ({ activeRequests: Math.max(0, state.activeRequests - 1) })),
  setError: (service, error) => set((state) => ({ errors: { ...state.errors, [service]: error } })),
  clearError: (service) => set((state) => {
    const newErrors = { ...state.errors };
    delete newErrors[service];
    return { errors: newErrors };
  })
}));
