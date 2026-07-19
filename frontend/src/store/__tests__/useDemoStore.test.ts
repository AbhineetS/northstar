import { describe, it, expect, beforeEach } from 'vitest';
import { useDemoStore } from '../useDemoStore';

describe('useDemoStore', () => {
  const initialState = useDemoStore.getState();

  beforeEach(() => {
    useDemoStore.setState(initialState);
  });

  it('initializes with default state', () => {
    const state = useDemoStore.getState();
    expect(state.currentPhase).toBe('0_WELCOME');
    expect(state.showDemoPanel).toBe(true);
  });

  it('sets phase correctly', () => {
    useDemoStore.getState().setPhase('2_ORG_EXP');
    expect(useDemoStore.getState().currentPhase).toBe('2_ORG_EXP');
  });

  it('advances phase sequentially', () => {
    useDemoStore.getState().advancePhase();
    expect(useDemoStore.getState().currentPhase).toBe('1_FAN_EXP');
    
    useDemoStore.getState().advancePhase();
    expect(useDemoStore.getState().currentPhase).toBe('2_ORG_EXP');
  });

  it('does not advance past the last phase', () => {
    useDemoStore.getState().setPhase('5_CLOSING');
    useDemoStore.getState().advancePhase();
    expect(useDemoStore.getState().currentPhase).toBe('5_CLOSING');
  });

  it('toggles demo panel visibility', () => {
    useDemoStore.getState().setShowDemoPanel(false);
    expect(useDemoStore.getState().showDemoPanel).toBe(false);
  });
});
