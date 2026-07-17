"use client";

import * as React from "react";
import { Marker, useMap } from "react-map-gl/maplibre";
import { useTelemetryStore } from "@/store/useTelemetryStore";
import { ShieldCheck, Cross, Users } from "lucide-react";

const STADIUM_CENTER = { lat: 40.7128, lng: -74.0060 };

const CROWD_ZONES = [
  { id: "gate-a", pos: { lat: 40.7135, lng: -74.0068 }, density: "high", label: "Gate A" },
  { id: "gate-b", pos: { lat: 40.7120, lng: -74.0050 }, density: "critical", label: "Gate B" },
  { id: "east-concourse", pos: { lat: 40.7128, lng: -74.0040 }, density: "medium", label: "East Concourse" },
  { id: "west-concourse", pos: { lat: 40.7128, lng: -74.0080 }, density: "low", label: "West Concourse" },
];

const STAFF_LOCATIONS = [
  { id: "sec-1", pos: { lat: 40.7138, lng: -74.0060 }, type: "security" },
  { id: "sec-2", pos: { lat: 40.7118, lng: -74.0055 }, type: "security" },
  { id: "med-1", pos: { lat: 40.7125, lng: -74.0070 }, type: "medical" },
  { id: "vol-1", pos: { lat: 40.7130, lng: -74.0045 }, type: "volunteer" },
];

export const OpsMapOverlay = () => {
  const map = useMap();
  const { incidents, ingressRate } = useTelemetryStore();

  React.useEffect(() => {
    if (map) {
      map.current?.flyTo({
        center: [STADIUM_CENTER.lng, STADIUM_CENTER.lat],
        zoom: 17,
        bearing: -17.6,
        pitch: 45,
      });
    }
  }, [map]);

  return (
    <>
      {/* Crowd Density Heatmap (Simulated via glowing markers) */}
      {CROWD_ZONES.map((zone) => {
        let size = "w-48 h-48";
        let color = "bg-success/20";
        if (zone.density === "medium") { size = "w-64 h-64"; color = "bg-warning/20"; }
        if (zone.density === "high") { size = "w-72 h-72"; color = "bg-danger/20"; }
        if (zone.density === "critical" || ingressRate > 4000) { size = "w-96 h-96"; color = "bg-danger/40"; }

        return (
          <Marker key={`crowd-${zone.id}`} longitude={zone.pos.lng} latitude={zone.pos.lat}>
            <div className="relative">
              <div className={`rounded-full blur-3xl animate-pulse pointer-events-none ${size} ${color}`} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
                 <span className="text-white/80 font-bold text-xs uppercase tracking-widest drop-shadow-md">{zone.label}</span>
              </div>
            </div>
          </Marker>
        );
      })}

      {/* Staff Markers */}
      {STAFF_LOCATIONS.map((staff) => (
        <Marker key={staff.id} longitude={staff.pos.lng} latitude={staff.pos.lat}>
          <div className={`p-1.5 rounded-full border shadow-lg ${
            staff.type === 'security' ? 'bg-info border-info/50 text-white' : 
            staff.type === 'medical' ? 'bg-danger border-danger/50 text-white' : 
            'bg-success border-success/50 text-white'
          }`}>
            {staff.type === 'security' && <ShieldCheck className="w-3 h-3" />}
            {staff.type === 'medical' && <Cross className="w-3 h-3" />}
            {staff.type === 'volunteer' && <Users className="w-3 h-3" />}
          </div>
        </Marker>
      ))}

      {/* Active Incidents */}
      {incidents.filter(i => i.status === 'Active').map((inc) => (
        <Marker key={`inc-${inc.id}`} longitude={-74.0068} latitude={40.7135}>
          <div className="flex flex-col items-center">
            <div className="px-2 py-1 bg-danger text-white text-[10px] font-bold rounded shadow-lg animate-bounce uppercase">
              {inc.type}
            </div>
            <div className="w-1 h-8 bg-gradient-to-b from-danger to-transparent" />
          </div>
        </Marker>
      ))}
    </>
  );
};
