"use client";

import * as React from "react";
import { Marker, Source, Layer, useMap } from "react-map-gl/maplibre";
import { MapContainer } from "@/components/map/MapContainer";
import { Users, Cross, ShieldCheck, MapPin, ShieldAlert, Navigation } from "lucide-react";
import { useTelemetryStore } from "@/store/useTelemetryStore";
import { motion, AnimatePresence } from "framer-motion";

const VOLUNTEER_ZONE_CENTER = { lat: 40.7132, lng: -74.0055 };

const MARKERS = [
  { id: "v1", pos: { lat: 40.7135, lng: -74.0068 }, type: "gate", label: "Gate A" },
  { id: "v2", pos: { lat: 40.7120, lng: -74.0050 }, type: "gate", label: "Gate B" },
  { id: "sec-1", pos: { lat: 40.7138, lng: -74.0060 }, type: "security" },
  { id: "med-1", pos: { lat: 40.7125, lng: -74.0070 }, type: "medical" },
  { id: "vol-2", pos: { lat: 40.7130, lng: -74.0045 }, type: "volunteer" },
  { id: "vol-3", pos: { lat: 40.7122, lng: -74.0058 }, type: "volunteer" },
];

const MOCK_ROUTE_GEOJSON = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'LineString',
    coordinates: [
      [-74.0055, 40.7132], // Volunteer Current
      [-74.0060, 40.7133],
      [-74.0065, 40.7134],
      [-74.0068, 40.7135]  // Incident at Gate A
    ]
  }
};

const MapOverlay = () => {
  const map = useMap();
  const { incidents } = useTelemetryStore();
  const activeIncidents = incidents.filter(i => i.status === 'Active');

  React.useEffect(() => {
    if (map) {
      map.current?.flyTo({
        center: [VOLUNTEER_ZONE_CENTER.lng, VOLUNTEER_ZONE_CENTER.lat],
        zoom: 17.5,
        bearing: 0,
        pitch: 45,
      });
    }
  }, [map]);

  return (
    <>
      {/* Route Line if there is an active incident */}
      {activeIncidents.length > 0 && (
        <Source type="geojson" data={MOCK_ROUTE_GEOJSON as GeoJSON.Feature}>
          <Layer
            id="route-line"
            type="line"
            layout={{
              'line-join': 'round',
              'line-cap': 'round'
            }}
            paint={{
              'line-color': 'var(--primary)',
              'line-width': 6,
              'line-opacity': 0.8
            }}
          />
          <Layer
            id="route-line-dash"
            type="line"
            layout={{
              'line-join': 'round',
              'line-cap': 'round'
            }}
            paint={{
              'line-color': '#ffffff',
              'line-width': 2,
              'line-dasharray': [0, 2, 2]
            }}
          />
        </Source>
      )}

      {/* POI Markers */}
      {MARKERS.map((marker) => (
        <Marker key={marker.id} longitude={marker.pos.lng} latitude={marker.pos.lat}>
          <div className={`p-1.5 rounded-full border shadow-md ${
            marker.type === 'security' ? 'bg-info border-info/50 text-white' : 
            marker.type === 'medical' ? 'bg-danger border-danger/50 text-white' : 
            marker.type === 'volunteer' ? 'bg-success border-success/50 text-white' :
            'bg-surface border-border-strong text-text-main'
          }`}>
            {marker.type === 'security' && <ShieldCheck className="w-3 h-3" />}
            {marker.type === 'medical' && <Cross className="w-3 h-3" />}
            {marker.type === 'volunteer' && <Users className="w-3 h-3" />}
            {marker.type === 'gate' && <span className="text-[10px] font-bold px-1">{marker.label}</span>}
          </div>
        </Marker>
      ))}

      {/* Active Incidents */}
      {activeIncidents.map((inc) => (
        <Marker key={`inc-${inc.id}`} longitude={-74.0068} latitude={40.7135}>
          <div className="flex flex-col items-center">
            <div className="px-2 py-1 bg-danger text-white text-[10px] font-bold rounded-lg shadow-premium animate-bounce uppercase flex items-center">
               <ShieldAlert className="w-3 h-3 mr-1" />
               {inc.type}
            </div>
            <div className="w-1 h-8 bg-gradient-to-b from-danger to-transparent" />
            <div className="w-4 h-1 bg-black/20 blur-sm rounded-full mt-1" />
          </div>
        </Marker>
      ))}

      {/* Volunteer Current Location */}
      <Marker longitude={VOLUNTEER_ZONE_CENTER.lng} latitude={VOLUNTEER_ZONE_CENTER.lat}>
         <div className="relative flex flex-col items-center">
            <div className="px-2 py-1 bg-primary text-white text-[10px] font-bold rounded-lg shadow-premium mb-1 flex items-center">
               You
            </div>
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center relative">
               <div className="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg z-10" />
               <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-40" />
            </div>
         </div>
      </Marker>
    </>
  );
};

export const VolunteerMap = () => {
  const { incidents } = useTelemetryStore();
  const activeIncidents = incidents.filter(i => i.status === 'Active');

  return (
    <div className="h-full w-full relative pb-20">
      <MapContainer>
        <MapOverlay />
      </MapContainer>
      
      {/* Top Floating Status */}
      <div className="absolute top-4 left-4 right-4 bg-surface-elevated/90 backdrop-blur-3xl p-3 rounded-2xl shadow-sm border border-border-subtle flex items-center space-x-3 z-10 pointer-events-none">
         <MapPin className="w-5 h-5 text-success" />
         <div className="flex-1">
            <h3 className="font-bold text-sm text-text-main leading-tight">Zone A Operations</h3>
            <p className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">Tracking 2 volunteers, 1 medical team</p>
         </div>
      </div>

      {/* Bottom Floating Navigation Card if active incident */}
      <AnimatePresence>
        {activeIncidents.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-6 left-4 right-4 bg-primary text-white p-4 rounded-2xl shadow-premium z-10"
          >
             <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Navigation className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm leading-tight">Routing to Incident</h4>
                    <p className="text-[10px] text-white/80 uppercase tracking-wider font-bold">Est. 2 mins walking</p>
                  </div>
                </div>
                <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg">150m</span>
             </div>
             <p className="text-xs font-medium opacity-90">Head North-West towards Gate A Concourse.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
