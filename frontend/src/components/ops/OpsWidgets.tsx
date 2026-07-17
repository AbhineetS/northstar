"use client";

import * as React from "react";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { CloudRain, Wind, Users, CheckCircle2, Droplets, ArrowUpRight } from "lucide-react";
import { useTelemetryStore } from "@/store/useTelemetryStore";

export const WeatherImpactWidget = () => {
  const { weather } = useTelemetryStore();
  
  return (
    <PremiumCard variant="glass" className="h-full p-6 flex flex-col bg-surface-elevated/80 backdrop-blur-3xl border-border-subtle shadow-elevation-high">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-surface rounded-lg border border-border-subtle shadow-sm">
             <CloudRain className="w-5 h-5 text-info" />
          </div>
          <div>
             <h3 className="text-sm font-bold text-text-main uppercase tracking-widest">Meteorological</h3>
             <p className="text-xs text-text-muted font-medium">Local Impact</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${weather.condition === 'rain' ? 'bg-warning/10 text-warning border-warning/20' : 'bg-success/10 text-success border-success/20'}`}>
          {weather.condition}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-surface p-3 rounded-xl border border-border-subtle flex flex-col justify-between">
          <span className="text-[10px] uppercase text-text-muted font-bold block mb-1">Temp</span>
          <span className="text-xl font-display font-black text-text-main">{weather.temperature_c}°C</span>
        </div>
        <div className="bg-surface p-3 rounded-xl border border-border-subtle flex flex-col justify-between">
          <span className="text-[10px] uppercase text-text-muted font-bold block mb-1">Wind</span>
          <div className="flex items-center text-text-main">
            <Wind className="w-3 h-3 mr-1 text-info" />
            <span className="text-xl font-display font-black">14<span className="text-[10px] ml-0.5">kph</span></span>
          </div>
        </div>
        <div className="bg-surface p-3 rounded-xl border border-border-subtle flex flex-col justify-between">
          <span className="text-[10px] uppercase text-text-muted font-bold block mb-1">Precip</span>
          <div className="flex items-center text-text-main">
            <Droplets className="w-3 h-3 mr-1 text-fifa-blue" />
            <span className="text-xl font-display font-black">{weather.condition === 'rain' ? '85' : '10'}%</span>
          </div>
        </div>
      </div>
      
      <div className="mt-auto">
        {weather.condition === 'rain' ? (
          <div className="bg-warning/10 p-3 rounded-xl border border-warning/20">
             <p className="text-xs font-bold text-warning mb-1">Adverse Conditions Detected</p>
             <p className="text-[10px] text-text-main font-medium">Precipitation impacting East Concourse. Automatic deployment of extra slip-mats and cleaning crews initiated.</p>
          </div>
        ) : (
          <div className="bg-success/10 p-3 rounded-xl border border-success/20 flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-2 text-success" /> 
            <p className="text-xs font-bold text-success">No operational weather impact expected.</p>
          </div>
        )}
      </div>
    </PremiumCard>
  );
};

export const ResourceStatusWidget = () => {
  return (
    <PremiumCard variant="glass" className="h-full p-6 flex flex-col bg-surface-elevated/80 backdrop-blur-3xl border-border-subtle shadow-elevation-high">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-surface rounded-lg border border-border-subtle shadow-sm">
             <Users className="w-5 h-5 text-fifa-blue" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-main uppercase tracking-widest">Active Resources</h3>
            <p className="text-xs text-text-muted font-medium">Staffing Allocation</p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar">
        <div className="bg-surface p-3 rounded-xl border border-border-subtle group hover:border-info transition-colors">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-text-main">Security Teams</span>
            <span className="text-xs font-bold text-info flex items-center">24 / 24 <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" /></span>
          </div>
          <div className="w-full bg-border-strong h-1.5 rounded-full overflow-hidden">
            <div className="bg-info h-full w-[100%]" />
          </div>
        </div>

        <div className="bg-surface p-3 rounded-xl border border-border-subtle group hover:border-danger transition-colors">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-text-main">Medical Staff</span>
            <span className="text-xs font-bold text-danger flex items-center">8 / 8 <span className="ml-2 px-1.5 py-0.5 rounded bg-danger/10 text-[8px] uppercase">Strained</span></span>
          </div>
          <div className="w-full bg-border-strong h-1.5 rounded-full overflow-hidden">
            <div className="bg-danger h-full w-[100%]" />
          </div>
        </div>

        <div className="bg-surface p-3 rounded-xl border border-border-subtle group hover:border-warning transition-colors">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-text-main">Cleaning Crew</span>
            <span className="text-xs font-bold text-warning flex items-center">12 / 18</span>
          </div>
          <div className="w-full bg-border-strong h-1.5 rounded-full overflow-hidden">
            <div className="bg-warning h-full w-[66%]" />
          </div>
          <p className="text-[10px] text-text-muted mt-2 font-medium">3 active spill requests pending.</p>
        </div>

        <div className="bg-surface p-3 rounded-xl border border-border-subtle group hover:border-success transition-colors">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-text-main">Volunteers</span>
            <span className="text-xs font-bold text-success flex items-center">142 / 150</span>
          </div>
          <div className="w-full bg-border-strong h-1.5 rounded-full overflow-hidden">
            <div className="bg-success h-full w-[94%]" />
          </div>
        </div>
      </div>
    </PremiumCard>
  );
};
