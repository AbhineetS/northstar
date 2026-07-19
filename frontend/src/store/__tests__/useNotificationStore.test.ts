import { describe, it, expect, beforeEach } from 'vitest';
import { useNotificationStore } from '../useNotificationStore';

describe('useNotificationStore', () => {
  const initialState = useNotificationStore.getState();

  beforeEach(() => {
    useNotificationStore.setState(initialState);
  });

  const mockNotification = {
    id: '1',
    type: 'info' as const,
    title: 'Test',
    message: 'Test message',
    targetProfile: "Fan" as "Fan" | "Organizer" | "Volunteer" | "Staff" | "All",
    timestamp: new Date()
  };

  it('initializes with empty notifications', () => {
    expect(useNotificationStore.getState().notifications).toEqual([]);
  });

  it('adds a new notification', () => {
    useNotificationStore.getState().addNotification(mockNotification);
    const notifications = useNotificationStore.getState().notifications;
    expect(notifications).toHaveLength(1);
    expect(notifications[0]).toEqual(mockNotification);
  });

  it('ignores duplicate notifications by id', () => {
    useNotificationStore.getState().addNotification(mockNotification);
    useNotificationStore.getState().addNotification(mockNotification);
    
    expect(useNotificationStore.getState().notifications).toHaveLength(1);
  });

  it('removes a notification by id', () => {
    useNotificationStore.getState().addNotification(mockNotification);
    expect(useNotificationStore.getState().notifications).toHaveLength(1);
    
    useNotificationStore.getState().removeNotification('1');
    expect(useNotificationStore.getState().notifications).toHaveLength(0);
  });

  it('clears all notifications', () => {
    useNotificationStore.getState().addNotification(mockNotification);
    useNotificationStore.getState().addNotification({ ...mockNotification, id: '2' });
    expect(useNotificationStore.getState().notifications).toHaveLength(2);
    
    useNotificationStore.getState().clearAll();
    expect(useNotificationStore.getState().notifications).toHaveLength(0);
  });
});
