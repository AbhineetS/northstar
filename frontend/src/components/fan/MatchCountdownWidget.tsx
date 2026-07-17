'use client';

import React, { useState, useEffect } from 'react';
import { IMatchDetails } from '@/services/interfaces';
import { Clock } from 'lucide-react';

interface MatchCountdownWidgetProps {
  match: IMatchDetails;
}

const TeamCrest = ({ teamName }: { teamName: string }) => {
  // Deterministic colors based on team name length for mock purposes
  const isHome = teamName.toLowerCase().includes('argentina') || teamName.length % 2 === 0;
  const primary = isHome ? 'url(#homeGrad)' : 'url(#awayGrad)';
  const stroke = 'rgba(255,255,255,0.2)';

  return (
    <svg viewBox="0 0 100 120" className="w-[84px] h-[100px] drop-shadow-xl mb-3 transform group-hover:scale-105 transition-transform duration-500">
      <defs>
        <linearGradient id="homeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A90E2" />
          <stop offset="100%" stopColor="#1C6EE4" />
        </linearGradient>
        <linearGradient id="awayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
      </defs>
      <path d="M50 5 L95 20 L95 70 C95 95 50 115 50 115 C50 115 5 95 5 70 L5 20 Z" fill={primary} stroke={stroke} strokeWidth="1" />
      <path d="M50 5 L95 20 L95 70 C95 95 50 115 50 115 L50 5" fill="white" fillOpacity="0.15" />
      <text x="50" y="68" fontFamily="Inter, sans-serif" fontSize="26" fontWeight="900" fill="white" textAnchor="middle" style={{ letterSpacing: '1px' }}>
        {teamName.substring(0, 3).toUpperCase()}
      </text>
      <path d="M 38 32 L 62 32 M 42 38 L 58 38" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
};

export function MatchCountdownWidget({ match }: MatchCountdownWidgetProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Mock countdown since actual kickoff time is likely past or static in mock data
    const target = new Date();
    target.setHours(target.getHours() + 2);
    target.setMinutes(target.getMinutes() + 45);

    const interval = setInterval(() => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      
      if (diff <= 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full relative overflow-hidden justify-between p-8 rounded-[40px] bg-[#E8F5E9]">
      
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="bg-black/5 rounded-full px-3 py-1.5 flex items-center shadow-inner-soft">
          <span className="text-[9px] font-bold uppercase tracking-widest text-black">UPCOMING MATCH</span>
        </div>
        <span className="text-sm font-bold text-black/60 flex items-center">
          <Clock className="w-4 h-4 mr-1.5 opacity-60" /> 
          04:01 PM
        </span>
      </div>

      <div className="flex items-center justify-between mb-8 relative z-10 px-2">
        <div className="text-center flex flex-col items-center group cursor-pointer w-24">
          <TeamCrest teamName={match.homeTeam} />
          <span className="font-bold text-text-main tracking-tight text-sm">{match.homeTeam}</span>
        </div>
        
        <div className="flex flex-col items-center translate-y-[-10px]">
          <span className="text-[10px] font-bold text-black/40 tracking-widest mb-3 uppercase">VS</span>
          <div className="flex gap-2.5">
            <div className="bg-white rounded-full w-14 h-16 flex flex-col items-center justify-center shadow-sm">
              <span className="block text-2xl font-bold font-display leading-none tracking-tighter">{timeLeft.hours.toString().padStart(2, '0')}</span>
              <span className="text-[8px] uppercase font-bold text-black/40 mt-0.5">HRS</span>
            </div>
            <div className="bg-white rounded-full w-14 h-16 flex flex-col items-center justify-center shadow-sm">
              <span className="block text-2xl font-bold font-display leading-none tracking-tighter">{timeLeft.minutes.toString().padStart(2, '0')}</span>
              <span className="text-[8px] uppercase font-bold text-black/40 mt-0.5">MIN</span>
            </div>
            <div className="bg-white rounded-full w-14 h-16 flex flex-col items-center justify-center shadow-sm">
              <span className="block text-2xl font-bold font-display leading-none tracking-tighter">{timeLeft.seconds.toString().padStart(2, '0')}</span>
              <span className="text-[8px] uppercase font-bold text-black/40 mt-0.5">SEC</span>
            </div>
          </div>
        </div>

        <div className="text-center flex flex-col items-center group cursor-pointer w-24">
          <TeamCrest teamName={match.awayTeam} />
          <span className="font-bold text-text-main tracking-tight text-sm">{match.awayTeam}</span>
        </div>
      </div>

      <div className="flex gap-3 mt-auto relative z-10">
        <div className="flex-1 bg-white/70 rounded-[24px] p-4 shadow-sm border border-white">
          <span className="text-[8px] uppercase font-bold text-black/50 block mb-0.5 tracking-wider">Entry Gate</span>
          <span className="text-lg font-bold text-text-main tracking-tight">Gate D</span>
        </div>
        <div className="flex-1 bg-white/70 rounded-[24px] p-4 shadow-sm border border-white">
          <span className="text-[8px] uppercase font-bold text-black/50 block mb-0.5 tracking-wider">Seating</span>
          <span className="text-lg font-bold text-text-main tracking-tight">143</span>
        </div>
        <div className="flex-[1.5] bg-white/70 rounded-[24px] p-4 shadow-sm border border-white">
          <span className="text-[8px] uppercase font-bold text-black/50 block mb-0.5 tracking-wider">Venue</span>
          <span className="text-sm font-bold text-text-main truncate block mt-1">MetLife Stadium</span>
        </div>
      </div>
    </div>
  );
}
