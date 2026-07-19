import { describe, it, expect, beforeEach } from 'vitest';
import { useTelemetryStore } from '../useTelemetryStore';

describe('useTelemetryStore', () => {
  const initialState = useTelemetryStore.getState();

  beforeEach(() => {
    useTelemetryStore.setState(initialState);
  });

  it('initializes with default state', () => {
    const state = useTelemetryStore.getState();
    expect(state.journeyStage).toBe('before_leaving');
    expect(state.totalAttendance).toBe(64291);
    expect(state.ingressRate).toBe(1240);
    expect(state.weather.condition).toBe('clear');
    expect(state.incidents).toEqual([]);
    expect(state.transportHubs).toEqual([]);
  });

  it('sets journey stage', () => {
    useTelemetryStore.getState().setJourneyStage('travel');
    expect(useTelemetryStore.getState().journeyStage).toBe('travel');
  });

  it('ticks simulation logic', () => {
    // Just verify tick doesn't crash and changes some values
    useTelemetryStore.getState().tick();
    const state = useTelemetryStore.getState();
    expect(state.totalAttendance).toBeGreaterThanOrEqual(64291);
    expect(state.ingressRate).toBeGreaterThanOrEqual(800);
  });

  it('resolves incident', () => {
    useTelemetryStore.setState({
      incidents: [{
        id: 'inc-1',
        type: 'Security',
        priority: 'high',
        status: 'Active',
        location: 'Gate A',
        timeActiveMinutes: 5,
        description: 'Test'
      }]
    });

    useTelemetryStore.getState().resolveIncident('inc-1');
    expect(useTelemetryStore.getState().incidents[0].status).toBe('Resolved');
  });

  it('triggers emergency', () => {
    useTelemetryStore.getState().triggerEmergency();
    expect(useTelemetryStore.getState().incidents.length).toBe(1);
    expect(useTelemetryStore.getState().incidents[0].priority).toBe('critical');
    expect(useTelemetryStore.getState().incidents[0].status).toBe('Active');
  });

  it('triggers crowd surge', () => {
    const prevAttendance = useTelemetryStore.getState().totalAttendance;
    useTelemetryStore.getState().triggerCrowdSurge();
    expect(useTelemetryStore.getState().ingressRate).toBe(5200);
    expect(useTelemetryStore.getState().totalAttendance).toBe(prevAttendance + 1500);
  });

  it('triggers weather change', () => {
    useTelemetryStore.getState().triggerWeatherChange();
    expect(useTelemetryStore.getState().weather.condition).toBe('rain');
    expect(useTelemetryStore.getState().weather.temperature_c).toBe(19);
  });

  it('triggers transport delay', () => {
    useTelemetryStore.setState({
      transportHubs: [{
        id: 'metro-4',
        name: 'Metro Line 4',
        capacity: 50,
        status: 'Nominal',
        trend: 'flat'
      }]
    });

    useTelemetryStore.getState().triggerTransportDelay();
    expect(useTelemetryStore.getState().transportHubs[0].capacity).toBe(145);
    expect(useTelemetryStore.getState().transportHubs[0].status).toBe('Critical');
  });
});
