
"use client";

import * as React from "react";
import { MapContainer } from "@/components/map/MapContainer";
import { useMap } from "react-map-gl/maplibre";
import { NavigationOverlay } from "@/components/map/NavigationOverlay";
import { FanPOIsOverlay } from "@/components/map/FanPOIsOverlay";
import { useTelemetryStore } from "@/store/useTelemetryStore";

interface FanShellProps {
  children: React.ReactNode;
}

const CINEMATIC_START = {
  longitude: -74.006,
  latitude: 40.7200,
  zoom: 13,
  pitch: 20,
  bearing: 0,
};

const CINEMATIC_END = {
  longitude: -74.006,
  latitude: 40.7128,
  zoom: 16,
  pitch: 60,
  bearing: -17.6,
};

const FanMapContent = ({ children }: { children: React.ReactNode }) => {
  const map = useMap();
  const { journeyStage } = useTelemetryStore();

  React.useEffect(() => {
    if (map) {
      if (journeyStage === 'before_leaving') {
        map.current?.flyTo({
          center: [CINEMATIC_START.longitude, CINEMATIC_START.latitude],
          zoom: CINEMATIC_START.zoom,
          bearing: CINEMATIC_START.bearing,
          pitch: CINEMATIC_START.pitch,
          duration: 2000
        });
      } else {
        map.current?.flyTo({
          center: [CINEMATIC_END.longitude, CINEMATIC_END.latitude],
          zoom: CINEMATIC_END.zoom,
          bearing: CINEMATIC_END.bearing,
          pitch: CINEMATIC_END.pitch,
          duration: 2000
        });
      }
    }
  }, [map, journeyStage]);

  const [userLocation, setUserLocation] = React.useState<{ lat: number; lng: number } | null>(null);

  React.useEffect(() => {
    let mounted = true;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (mounted) {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback location if denied
          if (mounted) setUserLocation({ lat: 40.7100, lng: -74.0100 });
        }
      );
    } else {
      setTimeout(() => { if (mounted) setUserLocation({ lat: 40.7100, lng: -74.0100 }); }, 0);
    }
    return () => { mounted = false; };
  }, []);

  return (
    <>
      {journeyStage === 'travel' && userLocation && (
        <NavigationOverlay 
          origin={userLocation} 
          destination={{ lat: 40.7128, lng: -74.0060 }} 
        />
      )}
      <FanPOIsOverlay />
      {children}
    </>
  );
};

export const FanShell = ({ children }: FanShellProps) => {
  return (
    <div className="flex h-screen w-full flex-col bg-background overflow-hidden relative">
      {/* Persistent Background Map */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <MapContainer 
          initialViewState={CINEMATIC_START}
          className="w-full h-full"
        >
           <FanMapContent>{null}</FanMapContent>
        </MapContainer>
        {/* Cinematic vignette / gradient over the map to ensure UI readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none opacity-95" />
      </div>
      
      <main id="main-content" className="absolute inset-0 z-10 pointer-events-none flex flex-col">
        {/* Children must have pointer-events-auto */}
        <div className="pointer-events-auto flex-1 relative flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
};

// NavItem removed since dock is removed
