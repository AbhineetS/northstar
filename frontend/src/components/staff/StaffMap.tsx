"use client";

import * as React from "react";
import { Marker, Source, Layer, useMap } from "react-map-gl/maplibre";
import { MapContainer } from "@/components/map/MapContainer";
import { Navigation, AlertTriangle, Package } from "lucide-react";
import { useTelemetryStore } from "@/store/useTelemetryStore";
import { motion, AnimatePresence } from "framer-motion";

const STAFF_ZONE_CENTER = { lat: 40.7128, lng: -74.0060 }; // Base of ops

const EQUIPMENT_MARKERS = [
  { id: "eq1", pos: { lat: 40.7125, lng: -74.0065 }, type: "defibrillator", status: "Available" },
  { id: "eq2", pos: { lat: 40.7132, lng: -74.0050 }, type: "defibrillator", status: "Available" },
  { id: "eq3", pos: { lat: 40.7120, lng: -74.0055 }, type: "spill_kit", status: "Low" },
  { id: "eq4", pos: { lat: 40.7135, lng: -74.0068 }, type: "wheelchair", status: "In Use" },
];

const MOCK_ROUTE_GEOJSON = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'LineString',
    coordinates: [
      [-74.0060, 40.7128], // Staff Current
      [-74.0062, 40.7126], // Defibrillator
      [-74.0068, 40.7135]  // Incident
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
        center: [STAFF_ZONE_CENTER.lng, STAFF_ZONE_CENTER.lat],
        zoom: 17.5,
        bearing: -30,
        pitch: 60,
      });
    }
  }, [map]);

  return (
    <>
      {/* Route Line if there is an active incident */}
      {activeIncidents.length > 0 && (
        <Source type="geojson" data={MOCK_ROUTE_GEOJSON as GeoJSON.Feature}>
          <Layer
            id="staff-route-line"
            type="line"
            layout={{
              'line-join': 'round',
              'line-cap': 'round'
            }}
            paint={{
              'line-color': 'var(--danger)',
              'line-width': 6,
              'line-opacity': 0.8
            }}
          />
          <Layer
            id="staff-route-line-dash"
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

      {/* Equipment Markers */}
      {EQUIPMENT_MARKERS.map((eq) => (
        <Marker key={eq.id} longitude={eq.pos.lng} latitude={eq.pos.lat}>
          <div className={`p-1.5 rounded-lg border shadow-sm ${
            eq.status === 'Available' ? 'bg-success/10 border-success text-success' : 
            eq.status === 'Low' ? 'bg-warning/10 border-warning text-warning' : 
            'bg-surface border-border-strong text-text-muted opacity-50'
          }`}>
             <Package className="w-3 h-3" />
          </div>
        </Marker>
      ))}

      {/* Active Incidents */}
      {activeIncidents.map((inc) => (
        <Marker key={`inc-${inc.id}`} longitude={-74.0068} latitude={40.7135}>
          <div className="flex flex-col items-center">
            <div className="px-2 py-1 bg-danger text-white text-[10px] font-bold rounded-lg shadow-premium animate-bounce uppercase flex items-center">
               <AlertTriangle className="w-3 h-3 mr-1" />
               {inc.type} Incident
            </div>
            <div className="w-1 h-8 bg-gradient-to-b from-danger to-transparent" />
            <div className="w-4 h-1 bg-black/20 blur-sm rounded-full mt-1" />
          </div>
        </Marker>
      ))}

      {/* Staff Current Location */}
      <Marker longitude={STAFF_ZONE_CENTER.lng} latitude={STAFF_ZONE_CENTER.lat}>
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

export const StaffMap = () => {
  const { incidents } = useTelemetryStore();
  const activeIncidents = incidents.filter(i => i.status === 'Active');

  return (
    <div className="h-full w-full relative pb-20">
      <MapContainer>
        <MapOverlay />
      </MapContainer>
      
      {/* Top Floating Status */}
      <div className="absolute top-4 left-4 right-4 bg-surface-elevated/90 backdrop-blur-3xl p-3 rounded-2xl shadow-sm border border-border-subtle flex items-center justify-between z-10 pointer-events-none">
         <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-bold text-text-main">Zone 4 (East)</span>
         </div>
         <div className="flex space-x-3 text-[10px] font-bold uppercase tracking-wider text-text-muted">
            <span className="flex items-center"><Package className="w-3 h-3 mr-1" /> 4 Assets</span>
            <span className="flex items-center">
               <AlertTriangle className={`w-3 h-3 mr-1 ${activeIncidents.length > 0 ? 'text-danger animate-pulse' : ''}`} /> 
               {activeIncidents.length} Alerts
            </span>
         </div>
      </div>

      {/* Bottom Floating Navigation Card if active incident */}
      <AnimatePresence>
        {activeIncidents.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-6 left-4 right-4 bg-danger text-white p-4 rounded-2xl shadow-premium z-10"
          >
             <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Navigation className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm leading-tight">Priority Escalation Route</h4>
                    <p className="text-[10px] text-white/80 uppercase tracking-wider font-bold">Via Defibrillator Station</p>
                  </div>
                </div>
                <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg">3 mins</span>
             </div>
             <div className="flex items-center text-xs font-medium bg-white/10 p-2 rounded-lg border border-white/20">
                <Package className="w-3 h-3 mr-1 shrink-0" />
                Pickup required at Eq Station 1 prior to arrival.
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
