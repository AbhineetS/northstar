import * as React from "react";
import { Source, Layer } from "react-map-gl/maplibre";

interface HeatmapLayerProps {
  data: { lat: number; lng: number; weight: number }[];
  gradient?: string[];
  radius?: number;
  opacity?: number;
}

export const HeatmapLayer = ({ data, gradient, radius = 30, opacity = 0.8 }: HeatmapLayerProps) => {
  const geojson: GeoJSON.FeatureCollection = React.useMemo(() => ({
    type: "FeatureCollection",
    features: data.map((point) => ({
      type: "Feature",
      properties: { weight: point.weight },
      geometry: { type: "Point", coordinates: [point.lng, point.lat] },
    })),
  }), [data]);

  const heatmapLayerStyle: React.ComponentProps<typeof Layer> = React.useMemo(() => {
    // MapLibre requires gradient to have step values, but for simplicity we will just provide basic colors if custom gradients are used, or fallback to mapbox default behavior if complex.
    // For now we'll just use the default heatmap colors or a custom one if possible, but maplibre's heatmap-color expression requires specific format.
    return {
      id: "heatmap-layer",
      type: "heatmap",
      paint: {
        "heatmap-weight": ["get", "weight"],
        "heatmap-intensity": 1,
        "heatmap-radius": radius,
        "heatmap-opacity": opacity,
        ...(gradient ? {
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0, "rgba(0,0,0,0)",
            0.2, gradient[1] || "rgba(56, 189, 248, 1)",
            0.5, gradient[2] || "rgba(234, 179, 8, 1)",
            1, gradient[3] || "rgba(239, 68, 68, 1)"
          ]
        } : {})
      },
    };
  }, [radius, opacity, gradient]);

  return (
    <Source type="geojson" data={geojson}>
      <Layer {...heatmapLayerStyle} />
    </Source>
  );
};

