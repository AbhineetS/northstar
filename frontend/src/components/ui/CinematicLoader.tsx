"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const CinematicLoader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Artificial delay to show the cinematic sequence
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="cinematic-loader"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            filter: "blur(10px)",
            transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] } 
          }}
          className="fixed inset-0 z-[99999] bg-[#050505] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Subtle Ambient Background */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.5, scale: 1.2 }}
            transition={{ duration: 3, ease: "easeOut" }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-[#050505] to-[#050505] opacity-50 blur-[100px]"
          />

          <div className="relative z-10 flex flex-col items-center">
            <motion.div
              initial={{ y: 20, opacity: 0, filter: "blur(10px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: [0.32, 0.72, 0, 1], delay: 0.2 }}
              className="flex items-center gap-4 mb-4"
            >
              <div className="w-12 h-12 border-t-2 border-l-2 border-primary rounded-full animate-spin" style={{ animationDuration: '3s' }} />
              <h1 className="text-display-sm font-display font-black tracking-tighter text-white">NORTHSTAR</h1>
            </motion.div>
            
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "200px", opacity: 1 }}
              transition={{ duration: 1.5, ease: [0.32, 0.72, 0, 1], delay: 0.6 }}
              className="h-px bg-gradient-to-r from-transparent via-primary to-transparent"
            />
            
            <motion.p
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1], delay: 1 }}
              className="mt-4 text-xs font-bold uppercase tracking-[0.3em] text-white/50"
            >
              System Core Initializing
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
