"use client";

import { useTelemetryStore } from "@/store/useTelemetryStore";
import { Marker } from "react-map-gl/maplibre";

const POIS = {
  stadium: { lat: 40.7128, lng: -74.0060 },
  gate: { lat: 40.7130, lng: -74.0055 },
  food: { lat: 40.7126, lng: -74.0062 },
  washroom: { lat: 40.7129, lng: -74.0058 },
  metro: { lat: 40.7115, lng: -74.0040 },
};

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

export const FanPOIsOverlay = () => {
  const { journeyStage } = useTelemetryStore();

  return (
    <>
      {journeyStage === "arrival" && (
        <Marker longitude={POIS.gate.lng} latitude={POIS.gate.lat}>
          <CustomPin color="#00E5FF" textColor="#000000" />
        </Marker>
      )}

      {journeyStage === "inside_stadium" && (
        <>
          <Marker longitude={POIS.food.lng} latitude={POIS.food.lat}>
            <CustomPin color="#FF3366" textColor="#FFFFFF" />
          </Marker>
          <Marker longitude={POIS.washroom.lng} latitude={POIS.washroom.lat}>
            <CustomPin color="#3366FF" textColor="#FFFFFF" />
          </Marker>
          <Marker longitude={POIS.stadium.lng} latitude={POIS.stadium.lat}>
            <CustomPin color="#00E5FF" textColor="#000000" />
          </Marker>
        </>
      )}

      {journeyStage === "leaving_stadium" && (
        <>
          <Marker longitude={POIS.gate.lng} latitude={POIS.gate.lat}>
            <CustomPin color="#00FF66" textColor="#000000" />
          </Marker>
          <Marker longitude={POIS.metro.lng} latitude={POIS.metro.lat}>
            <CustomPin color="#00E5FF" textColor="#000000" />
          </Marker>
        </>
      )}
    </>
  );
};
