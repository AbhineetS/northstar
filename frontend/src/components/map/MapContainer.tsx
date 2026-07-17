"use client";

import * as React from "react";
import Map from "react-map-gl/maplibre";
import maplibreGl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { cn } from "@/utils/cn";

interface MapContainerProps {
  className?: string;
  initialViewState?: {
    longitude: number;
    latitude: number;
    zoom: number;
    pitch?: number;
    bearing?: number;
  };
  children?: React.ReactNode;
}

const DEFAULT_VIEW = {
  longitude: -74.006, // MetLife Stadium
  latitude: 40.7128,
  zoom: 16,
  pitch: 45,
  bearing: -17.6,
};

export const MapContainer = ({ className, initialViewState = DEFAULT_VIEW, children }: MapContainerProps) => {
  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-neutral-100 flex items-center justify-center", className)}>
      <Map
        initialViewState={initialViewState}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
        mapLib={maplibreGl}
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
      >
        {children}
      </Map>
    </div>
  );
};
MapContainer.displayName = "MapContainer";

