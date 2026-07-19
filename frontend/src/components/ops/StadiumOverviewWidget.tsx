'use client';

import * as React from 'react';
import { MapIcon, AlertTriangle } from 'lucide-react';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { MapContainer } from '@/components/map/MapContainer';
import { HeatmapLayer } from '@/components/map/HeatmapLayer';

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
  const [hotspots, setHotspots] = React.useState<Hotspot[]>(generateMockHotspots);

  React.useEffect(() => {
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

      {/* Real Mapbox Stadium Map */}
      <div className="absolute inset-0 z-0 bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
        <MapContainer 
          className="w-full h-full opacity-80"
          initialViewState={{
            latitude: 40.7128,
            longitude: -74.006,
            zoom: 16.5,
            pitch: 60,
            bearing: -17.6
          }}
        >
          <HeatmapLayer 
            data={hotspots.map(spot => ({
              lat: 40.7128 + (spot.y - 50) * 0.00005,
              lng: -74.006 + (spot.x - 50) * 0.00005,
              weight: spot.intensity === 'critical' ? 1.0 : spot.intensity === 'high' ? 0.8 : spot.intensity === 'medium' ? 0.5 : 0.2
            }))} 
            radius={50} 
            opacity={0.7} 
          />
        </MapContainer>
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background via-transparent to-background/50" />
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
