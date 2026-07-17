'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Wind, Car, Train, Navigation, AlertCircle } from 'lucide-react';
import { IWeatherCondition, IRouteOptimization } from '@/services/interfaces';

interface LogisticsWidgetProps {
  weather: IWeatherCondition | null;
  route: IRouteOptimization | null;
}

type TabType = 'Weather' | 'Transport' | 'Parking';

export function LogisticsWidget({ weather, route }: LogisticsWidgetProps) {
  const [activeTab, setActiveTab] = useState<TabType>('Weather');

  const tabs: TabType[] = ['Weather', 'Transport', 'Parking'];

  return (
    <div className="flex flex-col h-full p-8 rounded-[40px] bg-[#FFF3E0]">
      <div className="flex bg-white/50 rounded-full p-1 shadow-sm mb-8 w-max">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            aria-label={`Switch to ${tab} tab`}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${activeTab === tab ? 'bg-[#111] text-white shadow-md' : 'text-text-muted hover:text-black'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="h-full flex flex-col"
          >
            {activeTab === 'Weather' && (
              <div className="flex flex-col justify-between h-full">
                {weather ? (
                  <>
                    <div className="flex items-center justify-between mb-4 mt-2">
                      <div>
                        <span className="text-[3.5rem] font-display font-black text-black leading-none tracking-tighter block mb-1">42°</span>
                        <p className="text-[15px] font-bold text-black/40 capitalize tracking-tight">Scattered Clouds</p>
                      </div>
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <Cloud className="w-8 h-8 text-black/30" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mt-auto">
                      <div className="bg-white p-4 rounded-[24px] shadow-sm flex flex-col justify-between h-24">
                        <span className="text-[9px] uppercase font-bold text-black/40 tracking-wider">Precipitation</span>
                        <span className="text-xl font-black text-black tracking-tighter">0%</span>
                      </div>
                      <div className="bg-white p-4 rounded-[24px] shadow-sm flex flex-col justify-between h-24">
                        <span className="text-[9px] uppercase font-bold text-black/40 tracking-wider">Wind</span>
                        <div className="flex items-center gap-1.5">
                          <Wind className="w-4 h-4 text-black/30" />
                          <span className="text-xl font-black text-black tracking-tighter">22 km/h</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-text-muted text-sm font-medium">Weather Data Unavailable</div>
                )}
              </div>
            )}

            {activeTab === 'Transport' && (
              <div className="flex flex-col justify-between h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <Train className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-main text-sm">Public Transit</h4>
                    <p className="text-xs text-text-muted">{route?.recommendedTransport || 'Subway Line 1 & 2'}</p>
                  </div>
                </div>
                
                <div className="bg-white/60 p-3 rounded-[20px] shadow-sm backdrop-blur-md mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-text-main">Est. Travel Time</span>
                    <span className="text-sm font-bold text-primary">{route?.estimatedMinutes || 45} mins</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-text-main">Crowd Level</span>
                    <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full capitalize">{route?.crowdLevel || 'Medium'}</span>
                  </div>
                </div>
                
                <button className="mt-auto w-full flex items-center justify-center gap-2 bg-white/60 hover:bg-white text-primary py-2.5 rounded-[20px] shadow-sm backdrop-blur-md font-bold text-xs transition-colors">
                  <Navigation className="w-3 h-3" /> Live Directions
                </button>
              </div>
            )}

            {activeTab === 'Parking' && (
              <div className="flex flex-col justify-between h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-fifa-blue/10 rounded-full flex items-center justify-center text-fifa-blue">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-main text-sm">Pre-Booked Parking</h4>
                    <p className="text-xs text-text-muted">Lot P3 - VIP Section</p>
                  </div>
                </div>
                
                <div className="bg-white/60 p-4 rounded-[20px] shadow-sm backdrop-blur-md mb-3 flex flex-col items-center text-center">
                  <span className="text-xs font-medium text-text-muted mb-1">Scan at Gate</span>
                  <div className="w-full h-12 bg-white rounded-lg flex items-center justify-center mt-2 opacity-50">
                    <span className="text-xs font-mono text-black font-bold tracking-widest">|| ||| | ||| || || |</span>
                  </div>
                </div>
                
                <div className="mt-auto flex items-center gap-2 text-xs font-medium text-amber-500 bg-amber-500/10 p-2 rounded-lg">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  Heavy traffic expected on approach routes.
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
