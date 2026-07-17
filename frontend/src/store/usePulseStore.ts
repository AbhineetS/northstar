import { create } from "zustand";

interface PulseState {
  // Global App State
  activeRole: "fan" | "organizer" | "responder";
  setActiveRole: (role: "fan" | "organizer" | "responder") => void;

  // Real-time Context
  activeZoneId: string | null;
  setActiveZone: (zoneId: string) => void;

  // AI & Interactions
  isAIActive: boolean;
  setAIActive: (active: boolean) => void;
}

export const usePulseStore = create<PulseState>((set) => ({
  activeRole: "fan",
  setActiveRole: (role) => set({ activeRole: role }),

  activeZoneId: null,
  setActiveZone: (zoneId) => set({ activeZoneId: zoneId }),

  isAIActive: false,
  setAIActive: (active) => set({ isAIActive: active }),
}));
