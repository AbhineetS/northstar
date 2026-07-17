import { create } from 'zustand';
import { INotification } from '../services/interfaces';

interface NotificationState {
  notifications: INotification[];
  addNotification: (notification: INotification) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (notification) => set((state) => {
    // Avoid duplicates
    if (state.notifications.some(n => n.id === notification.id)) return state;
    return { notifications: [...state.notifications, notification] };
  }),
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  clearAll: () => set({ notifications: [] })
}));
