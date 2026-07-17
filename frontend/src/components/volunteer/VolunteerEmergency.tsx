"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, PhoneCall, ShieldAlert, Cross, Users, PlusCircle, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const VolunteerEmergency = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-surface-elevated rounded-t-[32px] p-6 shadow-[0_-10px_40px_rgba(255,0,85,0.2)] border-t border-danger/20"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5 text-danger" />
                </div>
                <h2 className="text-xl font-bold text-text-main">Emergency Actions</h2>
              </div>
              <Button variant="ghost" className="p-2" onClick={() => setIsOpen(false)}>
                <X className="w-6 h-6" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <EmergencyButton icon={<Cross />} label="Medical Team" color="danger" />
              <EmergencyButton icon={<ShieldAlert />} label="Security" color="warning" />
              <EmergencyButton icon={<Users />} label="Lost Child" color="info" />
              <EmergencyButton icon={<AlertTriangle />} label="Crowd Issue" color="accent" />
            </div>

            <Button variant="outline" className="w-full py-4 text-text-main border-border-strong font-bold" onClick={() => setIsOpen(false)}>
              <PhoneCall className="w-5 h-5 mr-2" />
              Request Supervisor
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-30 w-14 h-14 bg-danger rounded-full shadow-[0_0_20px_rgba(255,0,85,0.5)] flex items-center justify-center text-white"
      >
        <PlusCircle className="w-6 h-6" />
      </motion.button>
    </>
  );
};

const EmergencyButton = ({ icon, label, color }: { icon: React.ReactNode, label: string, color: string }) => (
  <button className={`flex flex-col items-center justify-center p-4 bg-${color}/10 rounded-2xl border border-${color}/20 active:scale-95 transition-transform`}>
    <div className={`text-${color} mb-2 [&>svg]:w-6 [&>svg]:h-6`}>{icon}</div>
    <span className={`text-${color} font-bold text-sm text-center`}>{label}</span>
  </button>
);
