"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, AlertTriangle, Users, Train, Leaf } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTelemetryStore } from "@/store/useTelemetryStore";
import { useDemoStore } from "@/store/useDemoStore";
import { weatherService } from "@/services";
import { useService } from "@/hooks/useService";
import { IWeatherCondition } from "@/services/interfaces";
import { OpsSidebar } from "./OpsSidebar";
import { OpsHeader } from "./OpsHeader";

interface OpsShellProps {
  children: React.ReactNode;
}

export const OpsShell = ({ children }: OpsShellProps) => {
  const pathname = usePathname();
  const tick = useTelemetryStore(state => state.tick);
  const currentPhase = useDemoStore(state => state.currentPhase);
  
  const [weatherCoords, setWeatherCoords] = React.useState<{lat: number, lon: number} | null>(null);

  React.useEffect(() => {
    let mounted = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => { if (mounted) setWeatherCoords({ lat: position.coords.latitude, lon: position.coords.longitude }) },
        () => { if (mounted) setWeatherCoords({ lat: 40.8128, lon: -74.0742 }) } // fallback to stadium
      );
    } else {
      setTimeout(() => { if (mounted) setWeatherCoords({ lat: 40.8128, lon: -74.0742 }) }, 0);
    }
    return () => { mounted = false; };
  }, []);

  const fetchWeather = React.useCallback(() => {
    if (weatherCoords) return weatherService.getCurrentWeather(weatherCoords.lat, weatherCoords.lon);
    return new Promise<IWeatherCondition>(() => {});
  }, [weatherCoords]);
  
  const weatherState = useService(fetchWeather);

  React.useEffect(() => {
    const interval = setInterval(() => {
      tick();
    }, 5000); // 5 second ticks for the simulation
    return () => clearInterval(interval);
  }, [tick]);

  const navItems = [
    { href: "/ops", icon: <Map />, label: "Digital Twin", exact: true },
    { href: "/ops/incidents", icon: <AlertTriangle />, label: "Incidents" },
    { href: "/ops/crowd", icon: <Users />, label: "Crowd Intel" },
    { href: "/ops/transport", icon: <Train />, label: "Transport" },
    { href: "/ops/sustainability", icon: <Leaf />, label: "Sustainability" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} // Cinematic long fade
      className="flex h-screen w-full bg-background overflow-hidden font-sans text-text-main"
    >
      <OpsSidebar currentPhase={currentPhase} pathname={pathname} navItems={navItems} />

      {/* Main Workspace */}
      <main id="main-content" className="flex-1 flex flex-col relative overflow-hidden bg-background">
        <OpsHeader currentPhase={currentPhase} weatherState={weatherState} />

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={pathname}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5 }}
            className="flex-1 overflow-hidden relative"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </motion.div>
  );
};
