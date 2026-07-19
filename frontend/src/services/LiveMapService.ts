import { IMapService, IRouteOptimization } from "./interfaces";
import { useApiStore } from "../store/useApiStore";

export class LiveMapService implements IMapService {
  private apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  /**
   * Retrieves an optimized route between two locations using the Google Maps Directions API.
   * Calculates the best path based on real-time conditions.
   * @param origin - The starting coordinate array [lat, lng]
   * @param destination - The destination coordinate array [lat, lng]
   * @returns A promise resolving to an IRouteOptimization object
   */
  async getOptimizedRoute(origin: [number, number], destination: [number, number]): Promise<IRouteOptimization> {
    if (!this.apiKey) {
      throw new Error("Google Maps API key missing. Routing unavailable.");
    }

    useApiStore.getState().startRequest();
    try {
      const response = await fetch(`https://routes.googleapis.com/directions/v2:computeRoutes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": this.apiKey,
          "X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline"
        },
        body: JSON.stringify({
          origin: { location: { latLng: { latitude: origin[0], longitude: origin[1] } } },
          destination: { location: { latLng: { latitude: destination[0], longitude: destination[1] } } },
          travelMode: "TRANSIT"
        })
      });

      if (!response.ok) {
        throw new Error(`Google Maps API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      useApiStore.getState().endRequest();
      
      if (data.routes && data.routes.length > 0) {
        return {
          estimatedMinutes: Math.round(parseInt(data.routes[0].duration.replace('s', '')) / 60),
          recommendedTransport: "Transit",
          crowdLevel: "medium", 
          pathGeoJSON: data.routes[0].polyline.encodedPolyline
        };
      }
      throw new Error("No route found");
    } catch (e) {
      console.error("MapService API Error:", e);
      useApiStore.getState().setError("Maps", "Failed to fetch live routing");
      useApiStore.getState().endRequest();
      throw e;
    }
  }
}
