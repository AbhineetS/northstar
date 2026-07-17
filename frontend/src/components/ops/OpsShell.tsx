"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  Map, 
  AlertTriangle, 
  Users, 
  Train, 
  Leaf, 
  Settings,
  ShieldCheck,
  Bell
} from "lucide-react";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { useTelemetryStore } from "@/store/useTelemetryStore";
import { useDemoStore } from "@/store/useDemoStore";
import { weatherService } from "@/services";
import { useService } from "@/hooks/useService";
import { DataBoundary } from "@/components/ui/DataBoundary";
import { CloudRain, Sun, Cloud } from "lucide-react";
import { IWeatherCondition } from "@/services/interfaces";

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

  const getWeatherIcon = (condition: string) => {
    switch(condition) {
      case "rain": return <CloudRain className="w-4 h-4 mr-1 text-info" />;
      case "cloudy": return <Cloud className="w-4 h-4 mr-1 text-text-muted" />;
      default: return <Sun className="w-4 h-4 mr-1 text-warning" />;
    }
  };
  
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
      {/* Left Sidebar (Mission Control style) */}
      <motion.aside 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 200, delay: 0.2 }}
        className="w-64 border-r border-border-subtle bg-surface-elevated/80 backdrop-blur-3xl flex flex-col z-20 shadow-premium"
      >
        <div className="p-6 border-b border-border-subtle">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 rounded-md bg-fifa-blue flex items-center justify-center shadow-premium">
              <Activity className="w-5 h-5 text-white animate-pulse" />
            </div>
            <h1 className="font-display font-bold text-lg tracking-tight text-text-main">NORTHSTAR</h1>
          </div>
          <Badge variant={currentPhase.includes("EMERGENCY") ? "danger" : "success"} isLive className="text-xs">
            Ops Status: {currentPhase.includes("EMERGENCY") ? "CRITICAL" : "Nominal"}
          </Badge>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link 
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-xl transition-all group relative outline-none",
                  isActive ? "bg-fifa-blue/5 text-fifa-blue" : "text-text-secondary hover:bg-border-subtle hover:text-text-main"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="ops-sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1/2 w-1 bg-fifa-blue rounded-r-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className={cn("mr-3", isActive ? "text-fifa-blue" : "text-text-muted group-hover:text-text-secondary")}>
                  {React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, { className: "w-5 h-5" })}
                </div>
                <span className="font-semibold text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border-subtle space-y-2">
          <button aria-label="System Configuration" className="flex items-center w-full px-3 py-2 rounded-xl text-text-secondary hover:bg-border-subtle hover:text-text-main transition-colors font-semibold">
            <Settings className="w-5 h-5 mr-3 text-text-muted" />
            <span className="text-sm">System Config</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-background">
        {/* Top Global Status Bar */}
        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="h-16 border-b border-border-subtle bg-surface-elevated/80 backdrop-blur-2xl flex items-center justify-between px-8 z-20 shadow-sm"
        >
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm text-text-secondary font-semibold">
              <span className={cn("w-2 h-2 rounded-full animate-pulse", currentPhase.includes("EMERGENCY") ? "bg-fifa-red" : "bg-success")} />
              <span className={currentPhase.includes("EMERGENCY") ? "text-fifa-red" : ""}>
                {currentPhase.includes("EMERGENCY") ? "DEFCON 2" : "DEFCON 5"}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-text-secondary font-semibold">
              <ShieldCheck className="w-4 h-4 text-text-muted" />
              <span>{currentPhase.includes("EMERGENCY") ? "Sector B Lockdown" : "All Gates Secure"}</span>
            </div>
            <div className="h-4 w-px bg-border-strong" />
            <DataBoundary 
              state={weatherState} 
              loadingFallback={<div className="h-4 w-16 bg-border-subtle animate-pulse rounded" />}
            >
              {(weather) => (
                <div className="flex items-center text-sm text-text-secondary font-semibold">
                  {getWeatherIcon(weather.condition)}
                  <span>{weather.temperatureC}°C</span>
                </div>
              )}
            </DataBoundary>
          </div>

          <div className="flex items-center space-x-4">
            <button aria-label="Notifications" className="relative text-text-muted hover:text-text-main transition-colors">
              <Bell className="w-5 h-5" />
              {currentPhase.includes("EMERGENCY") && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-fifa-red rounded-full animate-pulse" />}
            </button>
            <div className="flex items-center space-x-3 border-l border-border-strong pl-5">
              <button aria-label="User Profile" className="w-9 h-9 rounded-full bg-surface border border-border-subtle shadow-sm flex items-center justify-center hover:bg-surface-elevated transition-colors">
                <span className="text-xs font-bold text-text-main">OP</span>
              </button>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-text-main leading-none">Commander</span>
                <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">ID: 001</span>
              </div>
            </div>
          </div>
        </motion.header>

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
