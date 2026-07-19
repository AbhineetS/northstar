/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { NotificationToaster } from '../NotificationToaster';
import { useNotificationStore } from '@/store/useNotificationStore';
import { notificationService } from '@/services';

vi.mock('@/store/useNotificationStore');
vi.mock('@/services');

describe('NotificationToaster', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders different notification types correctly', () => {
    (useNotificationStore as any).mockReturnValue({
      notifications: [
        { id: '1', type: 'info', title: 'Info', message: 'Msg 1', targetProfile: 'All' },
        { id: '2', type: 'emergency', title: 'Emergency', message: 'Msg 2', targetProfile: 'All' },
        { id: '3', type: 'warning', title: 'Warning', message: 'Msg 3', targetProfile: 'All' },
        { id: '4', type: 'success', title: 'Success', message: 'Msg 4', targetProfile: 'All' },
        { id: '5', type: 'info', title: 'With Action', message: 'Msg 5', targetProfile: 'All', actionLabel: 'Click Me' },
      ],
      removeNotification: vi.fn(),
    });
    
    (notificationService.subscribe as any).mockImplementation((_p: string, cb: any) => {
      return () => {}; // return unsubscribe fn
    });

    render(<NotificationToaster profile="All" />);
    
    expect(screen.getByText('Info')).toBeInTheDocument();
    expect(screen.getByText('Emergency')).toBeInTheDocument();
    expect(screen.getByText('Warning')).toBeInTheDocument();
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('filters notifications by profile', () => {
    (useNotificationStore as any).mockReturnValue({
      notifications: [
        { id: '1', type: 'info', title: 'Fan Notif', message: 'Msg', targetProfile: 'Fan' },
        { id: '2', type: 'info', title: 'Staff Notif', message: 'Msg', targetProfile: 'Staff' },
      ],
      removeNotification: vi.fn(),
    });

    (notificationService.subscribe as any).mockReturnValue(vi.fn());

    render(<NotificationToaster profile="Fan" />);
    
    expect(screen.getByText('Fan Notif')).toBeInTheDocument();
    expect(screen.queryByText('Staff Notif')).not.toBeInTheDocument();
  });
});
