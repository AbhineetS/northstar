"use client";

import * as React from "react";
import { Sparkles, CheckCircle2, Clock, AlertTriangle, Package, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { motion, AnimatePresence } from "framer-motion";
import { useTelemetryStore } from "@/store/useTelemetryStore";

export const StaffHome = () => {
  const { incidents } = useTelemetryStore();
  const activeIncidents = incidents.filter(i => i.status === 'Active');

  const [shiftEnd] = React.useState(() => new Date(Date.now() + 1000 * 60 * 60 * 4.5)); // 4.5 hours from now

  return (
    <div className="space-y-4 pb-32 overflow-y-auto h-full px-4 pt-6 no-scrollbar relative">
      {/* Premium Shift Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[2rem] font-display font-black text-text-main tracking-[-0.05em] leading-none mb-1">Ops Center</h1>
          <p className="text-xs text-text-secondary font-medium tracking-wide uppercase">East Wing • Zone 4</p>
        </div>
        
        <div className="text-right flex flex-col items-end">
          <Badge variant="success" className="mb-1 bg-success/20 text-success border-none">On Duty</Badge>
          <div className="flex items-center text-[10px] font-bold text-text-muted uppercase tracking-widest">
            <Clock className="w-3 h-3 mr-1" /> Ends {shiftEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {/* Immediate Notification / Escalation Block (AI Driven) */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="bg-primary text-white p-4 rounded-2xl shadow-premium relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-ai/30 rounded-full blur-2xl -mr-10 -mt-10" />
          <div className="flex justify-between items-start mb-3 relative z-10">
            <div className="flex items-center space-x-2">
               <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white animate-pulse" />
               </div>
               <h2 className="font-bold text-sm text-white uppercase tracking-widest">AI Command</h2>
            </div>
            <span className="text-[10px] font-bold bg-white/20 px-2 py-1 rounded-lg uppercase tracking-wider text-white">Action Required</span>
          </div>
          <div className="relative z-10">
             <p className="text-sm font-medium leading-relaxed opacity-90 mb-4">
               Medical incident reported near Gate B. As the closest certified responder, please retrieve the nearby defibrillator and proceed.
             </p>
             <div className="flex gap-2">
                <button className="flex-1 py-2 bg-white text-primary font-bold text-xs rounded-xl shadow-md hover:scale-[1.02] transition-transform">
                  Acknowledge
                </button>
                <button className="flex-1 py-2 bg-danger/80 text-white font-bold text-xs rounded-xl border border-danger hover:scale-[1.02] transition-transform flex items-center justify-center">
                  <AlertTriangle className="w-3 h-3 mr-1" /> Escalate
                </button>
             </div>
          </div>
        </div>
      </motion.div>

      {/* Asset Status Summary */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="pt-2">
         <h2 className="font-bold text-text-main text-sm mb-3">Zone Assets</h2>
         <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface p-3 rounded-xl border border-border-subtle flex flex-col items-center text-center shadow-sm">
               <Package className="w-5 h-5 text-success mb-1" />
               <span className="text-xl font-black text-text-main">4/4</span>
               <span className="text-[9px] uppercase font-bold text-text-muted tracking-widest">Defibrillators</span>
            </div>
            <div className="bg-surface p-3 rounded-xl border border-warning/30 bg-warning/5 flex flex-col items-center text-center shadow-sm">
               <Package className="w-5 h-5 text-warning mb-1" />
               <span className="text-xl font-black text-text-main">1/3</span>
               <span className="text-[9px] uppercase font-bold text-text-muted tracking-widest">Spill Kits (Low)</span>
            </div>
         </div>
      </motion.div>

      {/* Live Zone Alerts */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-text-main text-sm">Active Alerts</h2>
          {activeIncidents.length > 0 && (
             <span className="text-[10px] font-bold bg-danger/10 text-danger px-2 py-1 rounded-full uppercase tracking-wider animate-pulse">
               {activeIncidents.length} Critical
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
                className="bg-danger/5 p-4 rounded-2xl border border-danger/20 flex flex-col group cursor-pointer hover:bg-danger/10 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-sm text-danger">{inc.type} Incident</h3>
                  <span className="text-[10px] font-bold text-danger uppercase tracking-wider">+{inc.timeActiveMinutes}m</span>
                </div>
                <p className="text-xs text-text-secondary mb-3">{inc.description}</p>
                <div className="flex items-center justify-between mt-auto">
                   <div className="flex items-center text-xs text-text-main font-bold">
                     <AlertTriangle className="w-3 h-3 mr-1.5 text-danger" />
                     {inc.location}
                   </div>
                   <ArrowRight className="w-4 h-4 text-danger opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {activeIncidents.length === 0 && (
             <div className="bg-surface border border-border-subtle p-6 rounded-2xl flex flex-col items-center justify-center text-center text-text-muted shadow-sm">
                <CheckCircle2 className="w-8 h-8 mb-2 text-success opacity-50" />
                <p className="text-xs font-bold uppercase tracking-widest text-text-main">No Alerts</p>
                <p className="text-[10px] mt-1 text-text-secondary font-medium">Zone 4 is currently nominal.</p>
             </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
