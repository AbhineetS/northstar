'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ILiveMatchStats } from '@/services/interfaces';
import { Badge } from '@/components/ui/Badge';
import { ChevronRight } from 'lucide-react';

interface LiveMatchWidgetProps {
  liveMatch: ILiveMatchStats;
}

export function LiveMatchWidget({ liveMatch }: LiveMatchWidgetProps) {
  return (
    <div className="flex flex-col h-full relative overflow-hidden justify-between p-6 cursor-pointer group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <Badge variant="danger" className="animate-pulse shadow-sm px-4 py-1.5 font-bold tracking-widest text-xs bg-white/60 backdrop-blur-md border-none text-fifa-red">LIVE • {liveMatch.minute}&apos;</Badge>
        <span className="text-sm font-bold text-primary flex items-center group-hover:translate-x-1 transition-transform">Match Center <ChevronRight className="w-4 h-4 ml-1" /></span>
      </div>

      <div className="flex items-center justify-between mb-6 relative z-10 flex-1">
        <div className="text-center w-1/3">
          <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">HOME</span>
          <span className="text-7xl font-display font-black text-text-main tracking-tighter">{liveMatch.homeScore}</span>
        </div>
        <div className="text-4xl font-display font-black text-text-muted/30 w-1/3 text-center">-</div>
        <div className="text-center w-1/3">
          <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">AWAY</span>
          <span className="text-7xl font-display font-black text-text-main tracking-tighter">{liveMatch.awayScore}</span>
        </div>
      </div>

      <div className="space-y-2 relative z-10 w-full mb-6 bg-white/60 shadow-sm p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center justify-between text-xs font-bold text-text-secondary mb-1">
          <span>{liveMatch.homePossession}%</span>
          <span className="uppercase tracking-widest">Possession</span>
          <span>{liveMatch.awayPossession}%</span>
        </div>
        <div className="w-full h-2 bg-primary/10 rounded-full overflow-hidden flex">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${liveMatch.homePossession}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-primary"
          />
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${liveMatch.awayPossession}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-fifa-red"
          />
        </div>
      </div>

      <div className="space-y-2 relative z-10">
        {liveMatch.events.slice(-2).map((evt, i) => (
          <div key={i} className="flex items-center gap-4 bg-white/60 p-3 rounded-[20px] shadow-sm backdrop-blur-md">
            <span className="font-bold text-fifa-blue w-8 pt-1">{evt.minute}&apos;</span>
            <span className="font-bold text-text-main text-sm flex-1 truncate">{evt.player}</span>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider px-2 py-1 bg-white rounded-lg border-none shadow-sm">{evt.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
