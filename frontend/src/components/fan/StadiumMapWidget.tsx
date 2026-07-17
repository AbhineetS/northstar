'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Coffee, ShoppingBag, ShieldAlert, Navigation, LucideIcon } from 'lucide-react';
import { VENUE_FOOD_VENDORS, VENUE_WASHROOMS } from '@/services/VenueConfig';

type MapFilter = 'Seat' | 'Food' | 'Merch' | 'Washrooms' | 'Emergency';

const MERCH_LOCATIONS = [
  { name: 'Main Team Store', location: 'Section 101', distance: '150m' },
  { name: 'Pop-up Shop', location: 'Gate A Concourse', distance: '50m' },
];

const EMERGENCY_EXITS = [
  { name: 'Exit Alpha', location: 'Section 120', distance: '20m', status: 'Clear' },
  { name: 'Exit Beta', location: 'Gate B', distance: '45m', status: 'Clear' },
];

export function StadiumMapWidget({ gate, section, seat }: { gate: string, section: string, seat: string }) {
  const [activeFilter, setActiveFilter] = useState<MapFilter>('Seat');

  const getListContent = () => {
    switch (activeFilter) {
      case 'Food':
        return VENUE_FOOD_VENDORS.map((v, i) => (
          <div key={i} className="flex justify-between items-center p-3 bg-white/60 rounded-xl mb-2 shadow-sm backdrop-blur-md group hover:bg-white cursor-pointer transition-colors">
            <div>
              <p className="font-bold text-sm text-text-main">{v.name}</p>
              <p className="text-xs text-text-muted">{v.location}</p>
            </div>
            <div className="text-right">
              <span className="block text-primary font-bold text-sm">{v.queueTimeMinutes}m wait</span>
            </div>
          </div>
        ));
      case 'Washrooms':
        return VENUE_WASHROOMS.map((v, i) => (
          <div key={i} className="flex justify-between items-center p-3 bg-white/60 rounded-xl mb-2 shadow-sm backdrop-blur-md group hover:bg-white cursor-pointer transition-colors">
            <div>
              <p className="font-bold text-sm text-text-main">{v.gender} Restroom</p>
              <p className="text-xs text-text-muted">{v.location}</p>
            </div>
            <div className="text-right">
              <span className="block text-text-main font-bold text-sm">{v.distanceMeters}m</span>
            </div>
          </div>
        ));
      case 'Merch':
        return MERCH_LOCATIONS.map((m, i) => (
          <div key={i} className="flex justify-between items-center p-3 bg-white/60 rounded-xl mb-2 shadow-sm backdrop-blur-md group hover:bg-white cursor-pointer transition-colors">
            <div>
              <p className="font-bold text-sm text-text-main">{m.name}</p>
              <p className="text-xs text-text-muted">{m.location}</p>
            </div>
            <div className="text-right">
              <span className="block text-text-main font-bold text-sm">{m.distance}</span>
            </div>
          </div>
        ));
      case 'Emergency':
        return EMERGENCY_EXITS.map((e, i) => (
          <div key={i} className="flex justify-between items-center p-3 bg-fifa-red/10 rounded-xl mb-2 border border-fifa-red/20 group hover:border-fifa-red/50 cursor-pointer">
            <div>
              <p className="font-bold text-sm text-fifa-red">{e.name}</p>
              <p className="text-xs text-text-muted">{e.location}</p>
            </div>
            <div className="text-right">
              <span className="block text-fifa-red font-bold text-sm">{e.distance}</span>
              <span className="text-[10px] uppercase font-bold text-fifa-red">{e.status}</span>
            </div>
          </div>
        ));
      case 'Seat':
      default:
        return (
          <div className="p-6 bg-white rounded-[32px] shadow-sm backdrop-blur-md">
            <h4 className="font-bold text-black mb-4 text-[13px] tracking-tight">Your Seat Journey</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center text-black text-[10px] font-bold">1</div>
                <div className="flex-1"><p className="text-sm font-bold text-black">Enter {gate}</p></div>
              </div>
              <div className="w-0.5 h-6 bg-black/5 ml-3" />
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center text-black text-[10px] font-bold">2</div>
                <div className="flex-1"><p className="text-sm font-bold text-black">Proceed to {section}</p></div>
              </div>
              <div className="w-0.5 h-6 bg-black/5 ml-3" />
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-[#111] flex items-center justify-center text-white text-[10px] font-bold"><MapPin className="w-3 h-3" /></div>
                <div className="flex-1"><p className="text-sm font-bold text-black">Arrive at {seat}</p></div>
              </div>
            </div>
          </div>
        );
    }
  };

  const filters: { id: MapFilter, icon: LucideIcon, label: string }[] = [
    { id: 'Seat', icon: Navigation, label: 'Seat' },
    { id: 'Food', icon: Coffee, label: 'Food' },
    { id: 'Washrooms', icon: MapPin, label: 'Restrooms' },
    { id: 'Merch', icon: ShoppingBag, label: 'Merch' },
    { id: 'Emergency', icon: ShieldAlert, label: 'Exits' },
  ];

  return (
    <div className="flex h-full relative overflow-hidden bg-[#E3F2FD] rounded-[40px]">
      {/* Abstract Map Background */}
      <div className="absolute inset-0 z-0 bg-transparent flex items-center justify-center overflow-hidden">
         <svg width="100%" height="100%" className="absolute opacity-20 pointer-events-none">
           <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
             <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#2563EB" strokeWidth="1"/>
           </pattern>
           <rect width="100%" height="100%" fill="url(#grid)" />
         </svg>
         
         <motion.div 
            className="absolute w-32 h-32 bg-primary/20 rounded-full blur-2xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
         />
      </div>

      <div className="relative z-10 w-full flex flex-col p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-black text-2xl text-black tracking-tight">Interactive Stadium</h3>
        </div>

        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2 mb-4">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              aria-label={`Filter by ${f.label}`}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                activeFilter === f.id 
                  ? f.id === 'Emergency' ? 'bg-[#DC2626] text-white shadow-md' : 'bg-[#111] text-white shadow-md'
                  : 'bg-white/80 text-text-muted hover:text-black shadow-sm'
              }`}
            >
              <f.icon className="w-4 h-4" />
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar relative rounded-2xl p-2 -mx-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {getListContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
