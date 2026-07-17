"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, AlertTriangle, AlertCircle, Clock, MapPin } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useTelemetryStore } from "@/store/useTelemetryStore";
import { Badge } from "@/components/ui/Badge";

export const IncidentManager = () => {
  const { incidents } = useTelemetryStore();
  const activeIncidents = incidents.filter(i => i.status === 'Active');

  return (
    <Card variant="glass" className="flex flex-col h-full bg-surface-elevated/80 backdrop-blur-3xl shadow-elevation-high border-border-subtle relative overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-border-subtle flex items-center justify-between z-10 bg-surface/50">
        <div className="flex items-center space-x-3">
          <ShieldAlert className="w-5 h-5 text-warning" />
          <h2 className="font-display font-bold text-lg text-text-main">Incident Feed</h2>
        </div>
        <Badge variant={activeIncidents.length > 0 ? "danger" : "outline"} className={activeIncidents.length > 0 ? "animate-pulse" : ""}>
          {activeIncidents.length} Active
        </Badge>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 relative z-10 no-scrollbar">
        <AnimatePresence mode="popLayout">
          {activeIncidents.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full text-center p-6 text-text-muted"
            >
              <ShieldAlert className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-medium text-sm">No active incidents.</p>
              <p className="text-xs mt-1">Stadium operations are nominal.</p>
            </motion.div>
          ) : (
            activeIncidents.map((inc) => (
              <motion.div
                key={inc.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group cursor-pointer"
              >
                <div className={`p-4 rounded-2xl border bg-surface/80 shadow-sm transition-all hover:bg-neutral-50 ${
                  inc.priority === 'critical' ? 'border-danger/40 hover:border-danger' :
                  inc.priority === 'high' ? 'border-warning/40 hover:border-warning' :
                  'border-info/40 hover:border-info'
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {inc.priority === 'critical' ? <AlertTriangle className="w-4 h-4 text-danger animate-pulse" /> : <AlertCircle className="w-4 h-4 text-warning" />}
                      <span className="font-bold text-sm text-text-main">{inc.type}</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {inc.timeActiveMinutes}m
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-xs text-text-secondary mb-3 font-medium">
                    <MapPin className="w-3 h-3" />
                    <span>{inc.location}</span>
                  </div>

                  <p className="text-xs text-text-main leading-relaxed bg-background p-2 rounded-lg border border-border-subtle">
                    {inc.description}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};
