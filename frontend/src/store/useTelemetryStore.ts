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

export interface StaffTask {
  id: string;
  assigneeRole: "Staff" | "Volunteer";
  title?: string;
  description: string;
  location: string;
  status: "Pending" | "In Progress" | "Completed";
  priority: "Critical" | "High" | "Medium" | "Low" | "Routine";
  aiSuggested?: boolean;
  timeAssigned?: string;
  timeReported?: string;
  type?: string;
}

export interface SustainabilityMetrics {
  powerConsumptionMw: number;
  waterUsageLpm: number;
  wasteDiversionPercent: number;
  baselineDiffPower: number;
  baselineDiffWater: number;
}

export interface PredictiveAnalytics {
  predictedGateWaitTime: number;
  incidentProbability: number;
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
  staffTasks: StaffTask[];
  sustainability: SustainabilityMetrics;
  predictiveAnalytics: PredictiveAnalytics;
  
  // Simulation Control
  setJourneyStage: (stage: JourneyStage) => void;
  tick: () => void;
  resolveIncident: (id: string) => void;

  // Demo Triggers
  triggerEmergency: () => void;
  triggerCrowdSurge: () => void;
  triggerWeatherChange: () => void;
  triggerTransportDelay: () => void;

  completeStaffTask: (id: string) => void;
  acceptStaffTask: (id: string) => void;
}

export const useTelemetryStore = create<TelemetryState>((set) => ({
  journeyStage: 'before_leaving',
  totalAttendance: 64291, // Keep real/base data
  ingressRate: 1240, // Keep real/base data
  weather: { condition: "clear", temperature_c: 24 }, // Start clear for demo
  transportHubs: [], // Initialize empty
  incidents: [], // Start empty for clean demo buildup
  staffTasks: [
    { id: 't1', title: 'Assist Fan Wheelchair Navigation', description: 'Assist Fan Wheelchair Navigation', location: 'Gate A - Section 102', priority: 'High', status: 'Pending', timeAssigned: '2m ago', aiSuggested: true, assigneeRole: 'Volunteer' } as unknown as StaffTask,
    { id: 't2', title: 'Spill Cleanup Assistance', description: 'Spill Cleanup Assistance', location: 'Concourse East - Food Court', priority: 'Medium', status: 'Pending', timeAssigned: '15m ago', assigneeRole: 'Volunteer' } as unknown as StaffTask,
    { id: 'wo1', type: 'Cleaning', title: 'Large beverage spill', description: 'Large beverage spill', location: 'Section 104 Concourse', priority: 'High', status: 'Pending', timeReported: '4m ago', assigneeRole: 'Staff' } as unknown as StaffTask,
    { id: 'wo2', type: 'Maintenance', title: 'Turnstile 4 offline', description: 'Turnstile 4 offline', location: 'Gate A Entry', priority: 'High', status: 'In Progress', timeReported: '12m ago', assigneeRole: 'Staff' } as unknown as StaffTask,
  ],
  sustainability: {
    powerConsumptionMw: 42.5,
    waterUsageLpm: 1250,
    wasteDiversionPercent: 82,
    baselineDiffPower: -12,
    baselineDiffWater: 4
  },
  predictiveAnalytics: {
    predictedGateWaitTime: 4,
    incidentProbability: 12
  },

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

    // 4. Fluctuate Sustainability and Predictive
    const newPower = Math.max(30, Math.min(60, state.sustainability.powerConsumptionMw + (Math.random() * 2 - 1)));
    const newWater = Math.max(1000, Math.min(2000, state.sustainability.waterUsageLpm + (Math.floor(Math.random() * 20) - 10)));
    const newWait = Math.max(1, Math.min(25, state.predictiveAnalytics.predictedGateWaitTime + (Math.random() > 0.5 ? 1 : -1)));

    return {
      totalAttendance: newAttendance,
      ingressRate: newIngress,
      incidents: updatedIncidents,
      transportHubs: updatedTransport,
      sustainability: {
        ...state.sustainability,
        powerConsumptionMw: Number(newPower.toFixed(1)),
        waterUsageLpm: newWater
      },
      predictiveAnalytics: {
        ...state.predictiveAnalytics,
        predictedGateWaitTime: newWait,
        incidentProbability: state.incidents.length > 0 ? 45 : 12
      }
    };
  }),

  resolveIncident: (id) => set((state) => ({
    incidents: state.incidents.map(inc => inc.id === id ? { ...inc, status: "Resolved" } : inc)
  })),

  completeStaffTask: (id) => set((state) => ({
    staffTasks: state.staffTasks.map(t => t.id === id ? { ...t, status: "Completed" } : t)
  })),

  acceptStaffTask: (id) => set((state) => ({
    staffTasks: state.staffTasks.map(t => t.id === id ? { ...t, status: "In Progress" } : t)
  })),

  // --- DEMO TRIGGERS ---
  triggerEmergency: () => set((state) => {
    const newIncidentId = `INC-${Math.floor(Math.random() * 1000)}`;
    return {
      incidents: [
        { id: newIncidentId, type: "Security", priority: "critical", status: "Active", location: "Concourse A - Gate 4", timeActiveMinutes: 0, description: "Unattended baggage detected by AI camera. Crowd density high." },
        ...state.incidents
      ],
      staffTasks: [
        { id: `TSK-${Math.floor(Math.random() * 1000)}`, assigneeRole: "Volunteer", description: "Crowd control and redirection away from Gate 4.", location: "Concourse A - Gate 4", status: "Pending", priority: "High" },
        ...state.staffTasks
      ],
      predictiveAnalytics: {
        ...state.predictiveAnalytics,
        incidentProbability: 85
      }
    };
  }),

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
