import { describe, it, expect, beforeEach } from 'vitest';
import { useApiStore } from '../useApiStore';

describe('useApiStore', () => {
  const initialState = useApiStore.getState();

  beforeEach(() => {
    useApiStore.setState(initialState);
  });

  it('initializes with default state', () => {
    const state = useApiStore.getState();
    expect(state.activeRequests).toBe(0);
    expect(state.errors).toEqual({});
    expect(typeof state.isOffline).toBe('boolean');
  });

  it('manages active requests counter', () => {
    useApiStore.getState().startRequest();
    expect(useApiStore.getState().activeRequests).toBe(1);
    
    useApiStore.getState().startRequest();
    expect(useApiStore.getState().activeRequests).toBe(2);
    
    useApiStore.getState().endRequest();
    expect(useApiStore.getState().activeRequests).toBe(1);
    
    useApiStore.getState().endRequest();
    expect(useApiStore.getState().activeRequests).toBe(0);
    
    // Should not go below zero
    useApiStore.getState().endRequest();
    expect(useApiStore.getState().activeRequests).toBe(0);
  });

  it('manages errors', () => {
    useApiStore.getState().setError('Weather', 'API Failed');
    expect(useApiStore.getState().errors['Weather']).toBe('API Failed');
    
    useApiStore.getState().setError('Gemini', 'Rate Limited');
    expect(useApiStore.getState().errors['Weather']).toBe('API Failed');
    expect(useApiStore.getState().errors['Gemini']).toBe('Rate Limited');
    
    useApiStore.getState().clearError('Weather');
    expect(useApiStore.getState().errors['Weather']).toBeUndefined();
    expect(useApiStore.getState().errors['Gemini']).toBe('Rate Limited');
  });

  it('manages offline status', () => {
    useApiStore.getState().setOffline(true);
    expect(useApiStore.getState().isOffline).toBe(true);
    
    useApiStore.getState().setOffline(false);
    expect(useApiStore.getState().isOffline).toBe(false);
  });
});
