'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IPlayer } from '@/services/interfaces';

interface LineupWidgetProps {
  homeTeam: string;
  awayTeam: string;
}

// Map positions to relative X/Y coordinates on a vertical pitch (0-100%)
// Y is from top to bottom (0 = top, 100 = bottom)
// X is from left to right (0 = left, 100 = right)
const POSITION_MAP: Record<string, { x: number, y: number }> = {
  'GK': { x: 50, y: 90 },
  'LB': { x: 15, y: 75 },
  'CB1': { x: 35, y: 78 },
  'CB2': { x: 65, y: 78 },
  'RB': { x: 85, y: 75 },
  'CDM': { x: 50, y: 62 },
  'CM1': { x: 30, y: 50 },
  'CM2': { x: 70, y: 50 },
  'CAM': { x: 50, y: 38 },
  'LW': { x: 20, y: 25 },
  'RW': { x: 80, y: 25 },
  'ST': { x: 50, y: 15 },
};

// Generate squad matching the positions exactly
const generateMockSquad = (prefix: string): IPlayer[] => {
  return [
    { id: `${prefix}-1`, name: `${prefix} Keeper`, number: 1, position: 'GK', isStarting: true, rating: 7.5 },
    { id: `${prefix}-2`, name: `${prefix} LB`, number: 3, position: 'LB', isStarting: true, rating: 7.2 },
    { id: `${prefix}-3`, name: `${prefix} CB`, number: 4, position: 'CB1', isStarting: true, rating: 6.8 },
    { id: `${prefix}-4`, name: `${prefix} CB`, number: 5, position: 'CB2', isStarting: true, rating: 7.1 },
    { id: `${prefix}-5`, name: `${prefix} RB`, number: 2, position: 'RB', isStarting: true, rating: 7.4 },
    { id: `${prefix}-6`, name: `${prefix} CDM`, number: 6, position: 'CDM', isStarting: true, rating: 8.1 },
    { id: `${prefix}-7`, name: `${prefix} CM`, number: 8, position: 'CM1', isStarting: true, rating: 7.9 },
    { id: `${prefix}-8`, name: `${prefix} CM`, number: 10, position: 'CM2', isStarting: true, rating: 8.5 },
    { id: `${prefix}-9`, name: `${prefix} LW`, number: 11, position: 'LW', isStarting: true, rating: 8.2 },
    { id: `${prefix}-10`, name: `${prefix} RW`, number: 7, position: 'RW', isStarting: true, rating: 7.7 },
    { id: `${prefix}-11`, name: `${prefix} ST`, number: 9, position: 'ST', isStarting: true, rating: 8.8 },
  ];
};

export function LineupWidget({ homeTeam, awayTeam }: LineupWidgetProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'away'>('home');
  const [hoveredPlayer, setHoveredPlayer] = useState<string | null>(null);
  
  const homeSquad = generateMockSquad((homeTeam || "TBA").substring(0, 3));
  const awaySquad = generateMockSquad((awayTeam || "TBA").substring(0, 3));
  
  const activeSquad = activeTab === 'home' ? homeSquad : awaySquad;
  const isHome = activeTab === 'home';
  const playerColor = isHome ? 'bg-[#2563EB]' : 'bg-[#DC2626]'; // Blue for home, Red for away

  return (
    <div className="flex flex-col h-full p-8 rounded-[40px] bg-[#F4F1EB]">
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className="font-display font-black text-2xl text-black tracking-tight">Starting XI</h3>
        <div className="flex bg-white rounded-full p-1 shadow-sm">
          <button 
            onClick={() => setActiveTab('home')}
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all ${activeTab === 'home' ? 'bg-[#111] text-white shadow-md' : 'text-text-muted hover:text-black'}`}
          >
            {(homeTeam || "TBA").substring(0, 3).toUpperCase()}
          </button>
          <button 
            onClick={() => setActiveTab('away')}
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all ${activeTab === 'away' ? 'bg-[#111] text-white shadow-md' : 'text-text-muted hover:text-black'}`}
          >
            {(awayTeam || "TBA").substring(0, 3).toUpperCase()}
          </button>
        </div>
      </div>

      <div className="flex-1 relative w-full rounded-[32px] overflow-hidden shadow-inner-soft bg-[#E4F1EB] mt-2 border border-white/40">
        {/* Graphical Pitch Background */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 opacity-30">
          <div className="w-full h-[15%] border-[1.5px] border-[#29A865]/30 rounded-b-xl border-t-0 mx-auto max-w-[40%]" />
          <div className="w-full h-0 border-t-[1.5px] border-[#29A865]/30 border-dashed" />
          <div className="w-24 h-24 border-[1.5px] border-[#29A865]/30 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <div className="w-full h-[15%] border-[1.5px] border-[#29A865]/30 rounded-t-xl border-b-0 mx-auto max-w-[40%]" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            {activeSquad.map((player) => {
              const pos = POSITION_MAP[player.position];
              if (!pos) return null;
              
              const isHovered = hoveredPlayer === player.id;
              
              return (
                <div 
                  key={player.id} 
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group z-20"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  onMouseEnter={() => setHoveredPlayer(player.id)}
                  onMouseLeave={() => setHoveredPlayer(null)}
                >
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className={`w-6 h-6 ${playerColor} text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-md relative z-10 transition-colors shadow-black/20`}
                  >
                    {player.number}
                  </motion.div>
                  
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute top-8 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg border border-black/5 flex flex-col items-center min-w-[80px] pointer-events-none"
                      >
                        <span className="text-[10px] font-bold text-text-main whitespace-nowrap">{player.name}</span>
                        <span className="text-[9px] font-medium text-text-muted">{player.position.replace(/[0-9]/g, '')} • {player.rating}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
