import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { PremiumCard } from "@/components/ui/PremiumCard";

interface ActiveIncidentsWidgetProps {
  activeMedical: number;
  activeSecurity: number;
}

export const ActiveIncidentsWidget: React.FC<ActiveIncidentsWidgetProps> = ({ activeMedical, activeSecurity }) => {
  return (
    <PremiumCard variant="solid" enableTilt className="h-full p-8 flex flex-col justify-between bg-fifa-red text-white shadow-[0_10px_40px_rgba(238,50,78,0.3)]">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-2xl text-white backdrop-blur-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold uppercase tracking-widest text-white/90">Active Incidents</span>
        </div>
      </div>
      <div className="flex justify-between items-end">
        <div>
          <span className="text-8xl font-display font-black leading-none tracking-tighter">
            <AnimatedNumber value={activeMedical + activeSecurity} />
          </span>
        </div>
        <div className="flex flex-col gap-2 pb-2">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-sm font-bold">{activeMedical} Medical</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#fbbc05] animate-pulse" />
            <span className="text-sm font-bold">{activeSecurity} Security</span>
          </div>
        </div>
      </div>
    </PremiumCard>
  );
};
