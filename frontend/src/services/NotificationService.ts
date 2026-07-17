import { INotification, INotificationService } from "./interfaces";
import { useNotificationStore } from "../store/useNotificationStore";

export class NotificationService implements INotificationService {
  private subscribers: Map<string, Array<(notification: INotification) => void>> = new Map();

  constructor() {
    // In a real app, we would initialize WebSocket or SSE connections here.
    // For Northstar V2, we simulate periodic contextual alerts.
    this.startMockEventLoop();
  }

  subscribe(profile: string, callback: (notification: INotification) => void): () => void {
    if (!this.subscribers.has(profile)) {
      this.subscribers.set(profile, []);
    }
    
    // Also subscribe to 'All' profile broadcasts automatically
    if (profile !== 'All' && !this.subscribers.has('All')) {
       this.subscribers.set('All', []);
    }

    this.subscribers.get(profile)!.push(callback);
    
    return () => {
      const subs = this.subscribers.get(profile);
      if (subs) {
        this.subscribers.set(profile, subs.filter(cb => cb !== callback));
      }
    };
  }

  broadcast(notificationPayload: Omit<INotification, "id" | "timestamp">): void {
    const notification: INotification = {
      ...notificationPayload,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date()
    };

    // Store in global state
    useNotificationStore.getState().addNotification(notification);

    // Notify targeted subscribers
    const profileSubs = this.subscribers.get(notification.targetProfile) || [];
    const allSubs = notification.targetProfile !== 'All' ? (this.subscribers.get('All') || []) : [];
    
    [...profileSubs, ...allSubs].forEach(callback => callback(notification));
  }

  private startMockEventLoop() {
    // Simulate some real-time intelligence events arriving after app launch
    setTimeout(() => {
      this.broadcast({
        type: "warning",
        title: "Weather Alert",
        message: "Rain is expected in 30 minutes. Consider bringing a jacket.",
        targetProfile: "Fan",
        actionLabel: "View Forecast"
      });
    }, 15000); // 15s after boot

    setTimeout(() => {
      this.broadcast({
        type: "emergency",
        title: "Crowd Surge Detected",
        message: "Gate B is experiencing unexpected congestion. Reroute Fan traffic immediately.",
        targetProfile: "Organizer",
        actionLabel: "View Heatmap"
      });
    }, 20000);
    
    setTimeout(() => {
      this.broadcast({
        type: "info",
        title: "Sector 143 Cleaning",
        message: "Spill reported in Sector 143 near Concourse C. Please dispatch.",
        targetProfile: "Staff",
        actionLabel: "Accept Task"
      });
    }, 25000);
  }
}
