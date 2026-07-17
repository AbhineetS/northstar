import { create } from "zustand";

export type DemoPhase = 
  | "0_WELCOME"
  | "1_FAN_EXP"
  | "2_ORG_EXP"
  | "3_EMERGENCY"
  | "4_SUSTAINABILITY"
  | "5_CLOSING";

interface DemoState {
  currentPhase: DemoPhase;
  setPhase: (phase: DemoPhase) => void;
  advancePhase: () => void;
  showDemoPanel: boolean;
  setShowDemoPanel: (show: boolean) => void;
}

const PHASES: DemoPhase[] = [
  "0_WELCOME",
  "1_FAN_EXP",
  "2_ORG_EXP",
  "3_EMERGENCY",
  "4_SUSTAINABILITY",
  "5_CLOSING"
];

export const useDemoStore = create<DemoState>((set, get) => ({
  currentPhase: "0_WELCOME",
  showDemoPanel: true, // Visible for presenter
  setPhase: (phase) => set({ currentPhase: phase }),
  advancePhase: () => {
    const { currentPhase } = get();
    const currentIndex = PHASES.indexOf(currentPhase);
    if (currentIndex < PHASES.length - 1) {
      set({ currentPhase: PHASES[currentIndex + 1] });
    }
  },
  setShowDemoPanel: (show) => set({ showDemoPanel: show })
}));
