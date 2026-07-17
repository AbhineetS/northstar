"use client";

import * as React from "react";
import { MapPin, ArrowRight, ShieldAlert, Sparkles, Radio } from "lucide-react";
import { useTelemetryStore } from "@/store/useTelemetryStore";
import { motion, AnimatePresence } from "framer-motion";

export const VolunteerHome = () => {
  const { incidents } = useTelemetryStore();
  const activeIncidents = incidents.filter(i => i.status === 'Active');
  
  // Mock shift progression
  const [shiftProgress, setShiftProgress] = React.useState(68); // percentage

  React.useEffect(() => {
    const interval = setInterval(() => {
      setShiftProgress(p => Math.min(100, p + 0.1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4 pb-24 overflow-y-auto h-full px-4 pt-6 no-scrollbar relative">
      
      {/* Header Profile with Premium Shift Progress */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[2rem] font-display font-black text-text-main tracking-[-0.05em] leading-none mb-1">Zone A</h1>
          <p className="text-xs text-text-secondary font-medium tracking-wide uppercase">Gates 1-4 • Concourses</p>
        </div>
        
        <div className="relative w-16 h-16 flex items-center justify-center bg-surface rounded-full shadow-inner-soft">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="32" cy="32" r="28" fill="none" stroke="var(--border-subtle)" strokeWidth="6" />
            <motion.circle 
              cx="32" cy="32" r="28" fill="none" 
              stroke="var(--success)" strokeWidth="6" strokeLinecap="round"
              strokeDasharray="175.93"
              animate={{ strokeDashoffset: 175.93 - (175.93 * shiftProgress) / 100 }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </svg>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-success leading-none">2h</span>
            <span className="text-[8px] font-bold text-text-muted uppercase tracking-widest leading-none mt-0.5">Left</span>
          </div>
        </div>
      </div>

      {/* Live Stadium Communication Feed */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="bg-primary text-white p-4 rounded-2xl shadow-premium relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
          <div className="flex items-center space-x-2 mb-3 relative z-10">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
               <Radio className="w-3 h-3 text-white animate-pulse" />
            </div>
            <h3 className="font-bold text-sm text-white uppercase tracking-widest">Global Comms</h3>
          </div>
          <div className="relative z-10">
             <span className="inline-block px-2 py-0.5 bg-fifa-red text-white text-[10px] font-bold rounded uppercase tracking-wider mb-2">Priority Update</span>
             <p className="text-sm font-medium leading-relaxed opacity-90">
               All Zone A volunteers, please direct fan traffic towards Gate 4 to alleviate Gate 2 congestion.
             </p>
          </div>
        </div>
      </motion.div>

      {/* AI Recommendation Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="p-4 bg-gradient-to-br from-ai/10 to-transparent border border-ai/20 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles className="w-16 h-16 text-ai" />
          </div>
          <div className="flex items-center space-x-2 mb-2 relative z-10">
            <Sparkles className="w-4 h-4 text-ai animate-pulse" />
            <h3 className="font-bold text-sm text-text-main">AI Insight</h3>
          </div>
          <p className="text-sm text-text-secondary font-medium relative z-10 mb-3">
            Predicting a post-match surge near the North Exit in 45 mins. Consider repositioning.
          </p>
          <button className="text-xs font-bold text-ai flex items-center hover:underline relative z-10">
            Review predictive map <ArrowRight className="w-3 h-3 ml-1" />
          </button>
        </div>
      </motion.div>

      {/* Live Incident Reports & Requests */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-text-main">Live Zone Alerts</h3>
          {activeIncidents.length > 0 && (
             <span className="text-[10px] font-bold bg-danger/10 text-danger px-2 py-1 rounded-full uppercase tracking-wider animate-pulse">
               {activeIncidents.length} Active
             </span>
          )}
        </div>
        
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {activeIncidents.map((inc) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={inc.id} 
                className="bg-danger/5 p-4 rounded-2xl border border-danger/20 flex flex-col"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-sm text-danger">{inc.type} Emergency</h4>
                  <span className="text-[10px] font-bold text-danger uppercase tracking-wider">{inc.timeActiveMinutes}m ago</span>
                </div>
                <p className="text-xs text-text-secondary mb-3">{inc.description}</p>
                <div className="flex items-center text-xs text-text-main font-bold mb-4 bg-surface p-2 rounded-lg border border-danger/10">
                  <MapPin className="w-3 h-3 mr-1.5 text-danger" />
                  {inc.location}
                </div>
                <div className="flex gap-2">
                   <button className="flex-1 py-2 bg-danger text-white font-bold text-xs rounded-xl shadow-md">
                     Respond
                   </button>
                   <button className="flex-1 py-2 bg-surface text-danger font-bold text-xs rounded-xl border border-danger/20">
                     Navigate
                   </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {activeIncidents.length === 0 && (
             <div className="bg-surface border border-border-subtle p-6 rounded-2xl flex flex-col items-center justify-center text-center text-text-muted">
                <ShieldAlert className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest">Zone Clear</p>
                <p className="text-xs mt-1">No active incidents in your assigned area.</p>
             </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
