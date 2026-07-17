"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

export interface PersonaDetails {
  id: string;
  title: string;
  color: string;
  href: string;
  loadingSteps: string[];
}

interface ProfileLoaderProps {
  persona: PersonaDetails;
  onComplete: () => void;
}

export function ProfileLoader({ persona, onComplete }: ProfileLoaderProps) {
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);
  const [isFinishing, setIsFinishing] = React.useState(false);

  React.useEffect(() => {
    if (currentStepIndex < persona.loadingSteps.length) {
      const timer = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, 800); // 800ms per step
      return () => clearTimeout(timer);
    } else if (currentStepIndex === persona.loadingSteps.length) {
      // Transition to final "Preparing..." state
      const timer = setTimeout(() => {
        setIsFinishing(true);
        setTimeout(() => {
          onComplete();
        }, 1500);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [currentStepIndex, persona.loadingSteps.length, onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden"
    >
      {/* Dynamic Background Aura based on persona color */}
      <div className={`absolute inset-0 bg-gradient-to-br ${persona.color} opacity-10 blur-[150px] animate-pulse pointer-events-none`} />

      <div className="relative z-10 w-full max-w-2xl px-6 flex flex-col items-center text-center">
        
        <AnimatePresence mode="wait">
          {!isFinishing ? (
            <motion.div
              key="steps"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center w-full"
            >
              <h2 className="text-3xl font-display font-bold text-white mb-12 tracking-tight">
                Initializing {persona.title} Environment
              </h2>
              
              <div className="flex flex-col items-center space-y-4">
                {persona.loadingSteps.map((step, index) => {
                  const isActive = index === currentStepIndex;
                  const isDone = index < currentStepIndex;

                  return (
                    <motion.div 
                      key={step}
                      animate={{
                        opacity: isActive ? 1 : isDone ? 0.3 : 0,
                        y: isActive ? 0 : isDone ? -10 : 10,
                        scale: isActive ? 1.05 : 1
                      }}
                      transition={{ duration: 0.4 }}
                      className={`text-xl font-medium tracking-wide ${isActive ? "text-white" : "text-white/50"}`}
                    >
                      {step}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="finishing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
              <Sparkles className="w-12 h-12 text-white animate-pulse mb-6" />
              <h2 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 tracking-tight">
                Preparing your Matchday Companion...
              </h2>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
