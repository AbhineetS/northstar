import { useEffect, useState } from "react";
import { Source, Layer, Marker } from "react-map-gl/maplibre";
import { Loader2, AlertCircle } from "lucide-react";

interface NavigationOverlayProps {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
}

interface RouteData {
  distance: number; // in meters
  duration: number; // in seconds
  geometry: GeoJSON.Geometry;
}

const CustomPin = ({ color, textColor }: { color: string, textColor: string }) => (
  <div
    style={{
      width: '24px',
      height: '24px',
      backgroundColor: color,
      border: '2px solid white',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: textColor,
      boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
      transform: 'translate(-50%, -50%)',
    }}
  />
);

export const NavigationOverlay = ({ origin, destination }: NavigationOverlayProps) => {
  const [route, setRoute] = useState<RouteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoute = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://router.project-osrm.org/route/v1/walking/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`);
        if (!res.ok) throw new Error("Failed to fetch route");
        
        const data = await res.json();
        if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
          throw new Error("No route found");
        }

        setRoute({
          distance: data.routes[0].distance,
          duration: data.routes[0].duration,
          geometry: data.routes[0].geometry,
        });
      } catch (err: unknown) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to load route");
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [origin, destination]);

  const routeLayer: React.ComponentProps<typeof Layer> = {
    id: "route-layer",
    type: "line",
    paint: {
      "line-color": "#00E5FF",
      "line-width": 6,
      "line-opacity": 0.8,
    },
  };

  const formatDistance = (meters: number) => (meters / 1000).toFixed(2) + " km";
  const formatDuration = (seconds: number) => Math.ceil(seconds / 60) + " min";

  return (
    <>
      {route && (
        <Source type="geojson" data={route.geometry}>
          <Layer {...routeLayer} />
        </Source>
      )}

      <Marker longitude={origin.lng} latitude={origin.lat}>
        <CustomPin color="#FFFFFF" textColor="#000000" />
      </Marker>
      <Marker longitude={destination.lng} latitude={destination.lat}>
        <CustomPin color="#00E5FF" textColor="#000000" />
      </Marker>

      {/* HUD for ETA / Loading / Error */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-neutral-200 pointer-events-auto z-10 flex items-center justify-center min-w-[200px]">
        {loading ? (
          <div className="flex items-center space-x-2 text-neutral-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="font-medium text-sm">Calculating route...</span>
          </div>
        ) : error ? (
          <div className="flex items-center space-x-2 text-red-500">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium text-sm">{error}</span>
          </div>
        ) : route ? (
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">ETA</span>
              <span className="font-bold text-lg text-neutral-900 leading-none">{formatDuration(route.duration)}</span>
            </div>
            <div className="w-px h-8 bg-neutral-300" />
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Distance</span>
              <span className="font-bold text-lg text-neutral-900 leading-none">{formatDistance(route.distance)}</span>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};
