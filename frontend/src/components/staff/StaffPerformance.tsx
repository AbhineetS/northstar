"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Activity, TrendingUp, CheckCircle, Clock, Zap } from "lucide-react";
import { motion } from "framer-motion";

export const StaffPerformance = () => {
  return (
    <div className="space-y-4 pb-24 overflow-y-auto h-full px-4 pt-6 no-scrollbar">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-success/10 rounded-xl">
          <Activity className="w-5 h-5 text-success" />
        </div>
        <h2 className="text-xl font-bold text-text-main tracking-tight">Performance</h2>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 gap-3 mb-6">
        <Card variant="glass" className="p-4 flex flex-col items-center justify-center text-center bg-success/5 border-success/20">
          <CheckCircle className="w-6 h-6 text-success mb-2" />
          <span className="text-3xl font-black text-success">14</span>
          <span className="text-[10px] uppercase font-bold text-success tracking-widest mt-1">Completed</span>
        </Card>
        <Card variant="glass" className="p-4 flex flex-col items-center justify-center text-center">
          <TrendingUp className="w-6 h-6 text-info mb-2" />
          <span className="text-3xl font-black text-text-main">3</span>
          <span className="text-[10px] uppercase font-bold text-text-muted tracking-widest mt-1">Pending</span>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-3">
         <Card variant="glass" className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
               <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-text-muted" />
               </div>
               <div>
                  <h4 className="font-bold text-sm text-text-main">Avg Response Time</h4>
                  <p className="text-xs text-text-secondary">Last 7 days</p>
               </div>
            </div>
            <span className="font-black text-xl text-text-main">4.2m</span>
         </Card>

         <Card variant="glass" className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
               <div className="w-10 h-10 rounded-full bg-ai/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-ai" />
               </div>
               <div>
                  <h4 className="font-bold text-sm text-text-main">AI Efficiency Gain</h4>
                  <p className="text-xs text-text-secondary">Routing optimization</p>
               </div>
            </div>
            <span className="font-black text-xl text-success">+18%</span>
         </Card>
      </motion.div>
    </div>
  );
};
