import { create } from "zustand";

export interface TransportHub {
  id: string;
  name: string;
  capacity: number; // 0 to 150
  status: "Nominal" | "Warning" | "Critical";
  trend: string;
}

export interface Incident {
  id: string;
  type: string;
  priority: "critical" | "high" | "medium";
  status: "Active" | "Resolved";
  location: string;
  timeActiveMinutes: number;
  description: string;
}

export type JourneyStage = 'before_leaving' | 'travel' | 'arrival' | 'inside_stadium' | 'during_match' | 'leaving_stadium';

export interface TelemetryState {
  // Global Data
  journeyStage: JourneyStage;
  totalAttendance: number;
  ingressRate: number;
  weather: {
    condition: "rain" | "cloudy" | "clear";
    temperature_c: number;
  };
  
  // Modules
  transportHubs: TransportHub[];
  incidents: Incident[];
  
  // Simulation Control
  setJourneyStage: (stage: JourneyStage) => void;
  tick: () => void;
  resolveIncident: (id: string) => void;

  // Demo Triggers
  triggerEmergency: () => void;
  triggerCrowdSurge: () => void;
  triggerWeatherChange: () => void;
  triggerTransportDelay: () => void;
}

export const useTelemetryStore = create<TelemetryState>((set) => ({
  journeyStage: 'before_leaving',
  totalAttendance: 64291, // Keep real/base data
  ingressRate: 1240, // Keep real/base data
  weather: { condition: "clear", temperature_c: 24 }, // Start clear for demo
  transportHubs: [], // Initialize empty
  incidents: [], // Start empty for clean demo buildup

  setJourneyStage: (stage) => set({ journeyStage: stage }),

  // Called every 5-10s to simulate live data
  tick: () => set((state) => {
    // 1. Randomly fluctuate attendance and ingress
    const newAttendance = state.totalAttendance + Math.floor(Math.random() * 5);
    const newIngress = Math.max(800, Math.min(6000, state.ingressRate + (Math.floor(Math.random() * 100) - 50)));

    // 2. Increment active incident times
    const updatedIncidents = state.incidents.map(inc => {
      if (inc.status === "Active") {
        return { ...inc, timeActiveMinutes: inc.timeActiveMinutes + (Math.random() > 0.8 ? 1 : 0) };
      }
      return inc;
    });

    // 3. Fluctuate transport capacities
    const updatedTransport = state.transportHubs.map(hub => {
      const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
      const newCap = Math.max(0, Math.min(150, hub.capacity + change));
      let newStatus: "Nominal" | "Warning" | "Critical" = "Nominal";
      if (newCap > 100) newStatus = "Critical";
      else if (newCap > 80) newStatus = "Warning";
      
      return { ...hub, capacity: newCap, status: newStatus };
    });

    return {
      totalAttendance: newAttendance,
      ingressRate: newIngress,
      incidents: updatedIncidents,
      transportHubs: updatedTransport,
    };
  }),

  resolveIncident: (id) => set((state) => ({
    incidents: state.incidents.map(inc => inc.id === id ? { ...inc, status: "Resolved" } : inc)
  })),

  // --- DEMO TRIGGERS ---
  triggerEmergency: () => set((state) => ({
    incidents: [
      { id: `INC-${Math.floor(Math.random() * 1000)}`, type: "Security", priority: "critical", status: "Active", location: "Concourse A - Gate 4", timeActiveMinutes: 0, description: "Unattended baggage detected by AI camera. Crowd density high." },
      ...state.incidents
    ]
  })),

  triggerCrowdSurge: () => set((state) => ({
    ingressRate: 5200,
    totalAttendance: state.totalAttendance + 1500
  })),

  triggerWeatherChange: () => set(() => ({
    weather: { condition: "rain", temperature_c: 19 }
  })),

  triggerTransportDelay: () => set((state) => ({
    transportHubs: state.transportHubs.map(h => 
      h.id === "metro-4" ? { ...h, capacity: 145, status: "Critical", trend: "+40% / 10m (Delayed)" } : h
    )
  })),
}));
