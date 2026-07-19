import { describe, it, expect, beforeEach } from 'vitest';
import { usePulseStore } from '../usePulseStore';

describe('usePulseStore', () => {
  const initialState = usePulseStore.getState();

  beforeEach(() => {
    usePulseStore.setState(initialState);
  });

  it('initializes with default state', () => {
    const state = usePulseStore.getState();
    expect(state.activeRole).toBe('fan');
    expect(state.activeZoneId).toBeNull();
    expect(state.isAIActive).toBe(false);
  });

  it('sets active role correctly', () => {
    usePulseStore.getState().setActiveRole('organizer');
    expect(usePulseStore.getState().activeRole).toBe('organizer');
  });

  it('sets active zone correctly', () => {
    usePulseStore.getState().setActiveZone('zone_b');
    expect(usePulseStore.getState().activeZoneId).toBe('zone_b');
  });

  it('toggles AI active state', () => {
    usePulseStore.getState().setAIActive(true);
    expect(usePulseStore.getState().isAIActive).toBe(true);
  });
});
