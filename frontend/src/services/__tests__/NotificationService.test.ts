import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NotificationService } from '../NotificationService';
import { useNotificationStore } from '../../store/useNotificationStore';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    vi.useFakeTimers();
    useNotificationStore.setState({ notifications: [] });
    service = new NotificationService();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('allows subscribing and unsubscribing', () => {
    const callback = vi.fn();
    const unsubscribe = service.subscribe('Fan', callback);

    service.broadcast({
      type: 'info',
      title: 'Test',
      message: 'Test msg',
      targetProfile: "Fan" as "Fan" | "Organizer" | "Volunteer" | "Staff" | "All"
    });

    expect(callback).toHaveBeenCalledTimes(1);

    unsubscribe();
    service.broadcast({
      type: 'info',
      title: 'Test 2',
      message: 'Test msg 2',
      targetProfile: "Fan" as "Fan" | "Organizer" | "Volunteer" | "Staff" | "All"
    });

    expect(callback).toHaveBeenCalledTimes(1); // Should not have been called again
  });

  it('broadcasts to All subscribers when profile is specific', () => {
    const allCallback = vi.fn();
    const fanCallback = vi.fn();

    service.subscribe('All', allCallback);
    service.subscribe('Fan', fanCallback);

    service.broadcast({
      type: 'info',
      title: 'Test',
      message: 'Test msg',
      targetProfile: "Fan" as "Fan" | "Organizer" | "Volunteer" | "Staff" | "All"
    });

    expect(allCallback).toHaveBeenCalledTimes(1);
    expect(fanCallback).toHaveBeenCalledTimes(1);
  });

  it('adds notification to global store on broadcast', () => {
    service.broadcast({
      type: 'emergency',
      title: 'Global Test',
      message: 'Global msg',
      targetProfile: "All" as "Fan" | "Organizer" | "Volunteer" | "Staff" | "All"
    });

    const storeState = useNotificationStore.getState();
    expect(storeState.notifications).toHaveLength(1);
    expect(storeState.notifications[0].title).toBe('Global Test');
  });

  it('simulates mock event loop properly', () => {
    const fanCallback = vi.fn();
    service.subscribe('Fan', fanCallback);

    // Advance by 16s to trigger the 15s fan notification
    vi.advanceTimersByTime(16000);
    expect(fanCallback).toHaveBeenCalledTimes(1);
    expect(fanCallback).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Weather Alert'
    }));
  });
});
