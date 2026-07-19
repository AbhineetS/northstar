"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Bell, CloudRain, Sun, Cloud } from "lucide-react";
import { cn } from "@/utils/cn";
import { DataBoundary } from "@/components/ui/DataBoundary";
import { IWeatherCondition } from "@/services/interfaces";
import { useService } from "@/hooks/useService";

interface OpsHeaderProps {
  currentPhase: string;
  weatherState: ReturnType<typeof useService<IWeatherCondition>>; 
}

const getWeatherIcon = (condition: string) => {
  switch(condition) {
    case "rain": return <CloudRain className="w-4 h-4 mr-1 text-info" />;
    case "cloudy": return <Cloud className="w-4 h-4 mr-1 text-text-muted" />;
    default: return <Sun className="w-4 h-4 mr-1 text-warning" />;
  }
};

export const OpsHeader = ({ currentPhase, weatherState }: OpsHeaderProps) => {
  return (
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
          {(weather: IWeatherCondition) => (
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
  );
};
