'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, LogOut, GitMerge } from 'lucide-react';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';

interface GateData {
  id: string;
  name: string;
  entryRate: number; // ppm (people per min)
  exitRate: number;
  capacity: number; // percentage
  status: 'optimal' | 'moderate' | 'congested';
}

const INITIAL_GATES: GateData[] = [
  { id: 'gA', name: 'Gate A (North)', entryRate: 120, exitRate: 15, capacity: 45, status: 'optimal' },
  { id: 'gB', name: 'Gate B (VIP)', entryRate: 45, exitRate: 5, capacity: 20, status: 'optimal' },
  { id: 'gC', name: 'Gate C (East)', entryRate: 310, exitRate: 40, capacity: 88, status: 'congested' },
  { id: 'gD', name: 'Gate D (South)', entryRate: 205, exitRate: 20, capacity: 65, status: 'moderate' },
];

export function GateMonitoringWidget() {
  const [gates, setGates] = useState<GateData[]>(INITIAL_GATES);

  useEffect(() => {
    const interval = setInterval(() => {
      setGates(prev => prev.map(gate => {
        // Fluctuate rates slightly
        const entryVar = Math.floor(Math.random() * 21) - 10;
        const newEntryRate = Math.max(0, gate.entryRate + entryVar);
        
        // Adjust capacity based on entry
        let newCap = gate.capacity + (entryVar > 0 ? 1 : -1);
        if (newCap > 95) newCap = 95;
        if (newCap < 5) newCap = 5;

        let status: 'optimal' | 'moderate' | 'congested' = 'optimal';
        if (newCap >= 80) status = 'congested';
        else if (newCap >= 50) status = 'moderate';

        return {
          ...gate,
          entryRate: newEntryRate,
          capacity: newCap,
          status
        };
      }));
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const totalEntry = gates.reduce((acc, g) => acc + g.entryRate, 0);

  return (
    <PremiumCard variant="glass" className="h-full flex flex-col p-6 bg-surface-elevated/80 backdrop-blur-3xl border-border-subtle shadow-elevation-high">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-surface rounded-lg border border-border-subtle shadow-sm">
            <GitMerge className="w-5 h-5 text-text-main" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-main uppercase tracking-widest">Access Control</h3>
            <p className="text-xs text-text-muted font-medium">Live Telemetry</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-text-muted font-bold uppercase tracking-wider block mb-0.5">Total Ingress</span>
          <div className="text-2xl font-display font-black text-primary flex items-baseline gap-1">
            <AnimatedNumber value={totalEntry} />
            <span className="text-sm font-bold text-text-muted">/min</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
        {gates.map((gate) => (
          <div key={gate.id} className="bg-surface p-4 rounded-xl border border-border-subtle flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm text-text-main">{gate.name}</span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                gate.status === 'congested' ? 'bg-danger/10 text-danger border border-danger/20' :
                gate.status === 'moderate' ? 'bg-warning/10 text-warning border border-warning/20' :
                'bg-success/10 text-success border border-success/20'
              }`}>
                {gate.status}
              </span>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1 flex items-center gap-2">
                 <LogIn className="w-3 h-3 text-info" />
                 <span className="text-xs font-bold text-text-muted"><span className="text-text-main">{gate.entryRate}</span> in/min</span>
              </div>
              <div className="flex-1 flex items-center gap-2">
                 <LogOut className="w-3 h-3 text-text-muted" />
                 <span className="text-xs font-bold text-text-muted"><span className="text-text-main">{gate.exitRate}</span> out/min</span>
              </div>
            </div>

            {/* Capacity Bar */}
            <div className="relative h-1.5 w-full bg-border-strong rounded-full overflow-hidden">
               <motion.div 
                 className={`absolute top-0 left-0 h-full rounded-full ${
                   gate.status === 'congested' ? 'bg-danger' :
                   gate.status === 'moderate' ? 'bg-warning' :
                   'bg-success'
                 }`}
                 initial={{ width: 0 }}
                 animate={{ width: `${gate.capacity}%` }}
                 transition={{ duration: 0.5 }}
               />
            </div>
          </div>
        ))}
      </div>
    </PremiumCard>
  );
}
