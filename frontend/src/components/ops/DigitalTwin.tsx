"use client";

import * as React from "react";
import { MapContainer } from "@/components/map/MapContainer";
import { HeatmapLayer } from "@/components/map/HeatmapLayer";
import { Marker } from "react-map-gl/maplibre";
import { useDemoStore } from "@/store/useDemoStore";
import { motion, AnimatePresence } from "framer-motion";

const heatmapGradient = [
  "rgba(0, 0, 0, 0)",
  "rgba(56, 189, 248, 1)",
  "rgba(234, 179, 8, 1)",
  "rgba(239, 68, 68, 1)"
];

const emergencyGradient = [
  "rgba(0, 0, 0, 0)",
  "rgba(234, 179, 8, 1)",
  "rgba(239, 68, 68, 1)",
  "rgba(185, 28, 28, 1)"
];

export const DigitalTwin = React.memo(() => {
  const currentPhase = useDemoStore(state => state.currentPhase);
  const isEmergency = currentPhase.includes("EMERGENCY");

  const heatmapData = React.useMemo(() => {
    if (isEmergency) {
      return [
        { weight: 100, lng: -74.006, lat: 40.7128 },
        { weight: 95, lng: -74.0062, lat: 40.7129 },
        { weight: 90, lng: -74.0058, lat: 40.7127 },
        { weight: 85, lng: -74.006, lat: 40.713 },
      ];
    }
    return [
      { weight: 70, lng: -74.006, lat: 40.7128 },
      { weight: 40, lng: -74.008, lat: 40.7132 },
      { weight: 10, lng: -74.003, lat: 40.711 },
    ];
  }, [isEmergency]);

  const patrolsData = React.useMemo(() => {
    return isEmergency ? [
      { type: "security", id: "SEC-1", lng: -74.0058, lat: 40.7128 },
      { type: "security", id: "SEC-2", lng: -74.0062, lat: 40.7128 },
      { type: "medical", id: "MED-1", lng: -74.006, lat: 40.7126 },
    ] : [
      { type: "security", id: "SEC-1", lng: -74.005, lat: 40.712 },
      { type: "medical", id: "MED-3", lng: -74.007, lat: 40.714 }
    ];
  }, [isEmergency]);

  return (
    <div className="absolute inset-0 bg-background">
      <MapContainer>
        <HeatmapLayer 
          data={heatmapData} 
          gradient={isEmergency ? emergencyGradient : heatmapGradient} 
          radius={isEmergency ? 40 : 30} 
        />
        
        {patrolsData.map(patrol => (
          <Marker 
            key={patrol.id} 
            latitude={patrol.lat} 
            longitude={patrol.lng}
          >
            <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${patrol.type === 'security' ? 'bg-[#38bdf8]' : 'bg-[#22c55e]'}`} />
          </Marker>
        ))}
      </MapContainer>
      
      {/* HUD Overlays */}
      <AnimatePresence>
        {isEmergency && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_150px_rgba(239,68,68,0.05)]"
          />
        )}
      </AnimatePresence>

      <div className="absolute top-6 left-6 pointer-events-none z-10">
        <h2 className="text-3xl font-display font-bold text-text-main drop-shadow-sm">Northstar Digital Twin</h2>
        <p className="text-text-secondary flex items-center">
          <span className={`w-2 h-2 rounded-full mr-2 ${isEmergency ? 'bg-danger animate-pulse' : 'bg-success'}`} />
          {isEmergency ? "CRITICAL ALERTS ACTIVE" : "Live Telemetry Sync Active"}
        </p>
      </div>
    </div>
  );
});
DigitalTwin.displayName = "DigitalTwin";
