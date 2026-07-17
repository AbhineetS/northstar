'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapIcon, AlertTriangle, Users } from 'lucide-react';
import { PremiumCard } from '@/components/ui/PremiumCard';

interface Hotspot {
  id: string;
  x: number;
  y: number;
  intensity: 'low' | 'medium' | 'high' | 'critical';
  label: string;
}

const generateMockHotspots = (): Hotspot[] => [
  { id: 'h1', x: 25, y: 30, intensity: 'high', label: 'Gate A Concourse' },
  { id: 'h2', x: 75, y: 20, intensity: 'medium', label: 'Merch Store North' },
  { id: 'h3', x: 50, y: 80, intensity: 'critical', label: 'Gate C Security' },
  { id: 'h4', x: 80, y: 70, intensity: 'low', label: 'East Food Court' },
  { id: 'h5', x: 10, y: 60, intensity: 'medium', label: 'West Exit' },
];

export function StadiumOverviewWidget() {
  const [hotspots, setHotspots] = useState<Hotspot[]>(generateMockHotspots);
  const [activeZone, setActiveZone] = useState<string | null>(null);

  useEffect(() => {
    // Initial load handled by state

    // Simulate real-time heatmap shifting
    const interval = setInterval(() => {
      setHotspots(prev => prev.map(spot => ({
        ...spot,
        intensity: Math.random() > 0.8 
          ? (['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as Hotspot['intensity'])
          : spot.intensity
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'critical': return 'var(--danger)';
      case 'high': return 'var(--warning)';
      case 'medium': return 'var(--info)';
      case 'low': return 'var(--success)';
      default: return 'var(--border-strong)';
    }
  };

  return (
    <PremiumCard variant="glass" className="h-full flex flex-col p-0 overflow-hidden relative group border-border-subtle shadow-elevation-high">
      {/* Header overlay */}
      <div className="absolute top-0 left-0 right-0 p-6 z-20 flex justify-between items-start pointer-events-none">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center shadow-premium border border-border-subtle pointer-events-auto">
              <MapIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-text-main">Stadium Overview</h3>
              <p className="text-xs text-text-muted font-medium">Live Crowd Density & Heatmap</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 pointer-events-auto">
          <div className="bg-surface/90 backdrop-blur px-3 py-2 rounded-lg border border-border-subtle flex items-center gap-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />
            <span className="text-xs font-bold text-text-main">Critical (1)</span>
          </div>
          <div className="bg-surface/90 backdrop-blur px-3 py-2 rounded-lg border border-border-subtle flex items-center gap-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
            <span className="text-xs font-bold text-text-main">High (1)</span>
          </div>
        </div>
      </div>

      {/* Abstract Stadium Map */}
      <div className="absolute inset-0 z-0 bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
        {/* Scanning grid */}
        <div className="absolute inset-0 opacity-[0.15]" 
             style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        {/* Radar sweep */}
        <motion.div 
          className="absolute w-[200%] h-[200%] origin-center pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{ background: 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(var(--primary-rgb), 0.1) 360deg)' }}
        />

        {/* Stadium outline */}
        <div className="relative w-[80%] h-[70%] border border-border-strong rounded-[100px] flex items-center justify-center">
          <div className="w-[90%] h-[85%] border border-border-subtle/50 rounded-[80px] flex items-center justify-center">
             {/* Pitch */}
             <div className="w-[40%] h-[60%] border-2 border-success/30 rounded-lg flex items-center justify-center relative">
                <div className="w-full h-[1px] bg-success/30 absolute top-1/2" />
                <div className="w-8 h-8 rounded-full border-2 border-success/30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
             </div>
          </div>
        </div>

        {/* Hotspots */}
        {hotspots.map((spot) => (
          <motion.div
            key={spot.id}
            className="absolute z-10 cursor-pointer"
            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onHoverStart={() => setActiveZone(spot.id)}
            onHoverEnd={() => setActiveZone(null)}
          >
            {/* Pulsing ring */}
            <motion.div 
              className="absolute -inset-4 rounded-full"
              style={{ backgroundColor: getIntensityColor(spot.intensity) }}
              animate={{ scale: [1, 2], opacity: [0.4, 0] }}
              transition={{ duration: spot.intensity === 'critical' ? 1 : 2, repeat: Infinity }}
            />
            {/* Core dot */}
            <div className="relative w-4 h-4 rounded-full border-2 border-[#0a0a0a] shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                 style={{ backgroundColor: getIntensityColor(spot.intensity) }} />

            {/* Label Tooltip */}
            <AnimatePresence>
              {activeZone === spot.id && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-6 left-1/2 -translate-x-1/2 bg-surface border border-border-subtle px-3 py-2 rounded-xl shadow-premium whitespace-nowrap z-30"
                >
                  <p className="text-xs font-bold text-text-main">{spot.label}</p>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5 flex items-center gap-1">
                    <Users className="w-3 h-3" /> Density: {spot.intensity}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
      
      {/* Footer Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20 pointer-events-none">
        <div className="flex justify-between items-end">
          <div className="bg-surface/80 backdrop-blur px-4 py-3 rounded-xl border border-border-subtle shadow-premium pointer-events-auto w-64">
            <div className="flex items-center gap-2 mb-2">
               <AlertTriangle className="w-4 h-4 text-warning" />
               <span className="text-xs font-bold text-text-main">AI Congestion Alert</span>
            </div>
            <p className="text-xs text-text-muted font-medium mb-2">Gate C approaching critical density limit in 15 mins.</p>
            <button className="w-full py-1.5 bg-primary/10 text-primary font-bold text-[10px] rounded hover:bg-primary hover:text-white transition-colors uppercase tracking-widest">
              Re-route Staff
            </button>
          </div>
          
          <div className="bg-background/90 backdrop-blur rounded-full px-4 py-2 border border-border-subtle flex items-center gap-3">
             <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
             </span>
             <span className="text-xs font-mono font-medium text-text-muted tracking-widest">LIVE SAT-LINK ACTIVE</span>
          </div>
        </div>
      </div>
    </PremiumCard>
  );
}
