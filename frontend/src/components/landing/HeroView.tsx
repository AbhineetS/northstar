import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface HeroViewProps {
  onStart: () => void;
  metrics: { label: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }[];
}

export const HeroView: React.FC<HeroViewProps> = ({ onStart, metrics }) => {
  return (
    <motion.div 
      key="hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12 2xl:px-20 z-10 pointer-events-none"
    >
      {/* Header inside hero */}
      <header className="absolute top-0 left-0 w-full px-8 md:px-12 py-10 flex justify-between items-center z-50 pointer-events-none">
        <div className="text-xs uppercase tracking-[0.3em] font-bold flex items-center text-primary pointer-events-auto">
          N<Image src="/football_real.svg" alt="O" width={12} height={12} className="mx-[2px]" />RTHSTAR
        </div>
        <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-text-secondary pointer-events-auto">
          Tournament Edition
        </div>
      </header>

      {/* Premium Centered Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[800px] pointer-events-auto flex flex-col items-center text-center relative z-20 mt-12"
      >
        <div className="inline-flex items-center gap-2 mb-10 px-4 py-2 rounded-full border border-border-strong bg-white/50 shadow-sm backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Live AI Matchday Intelligence</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter leading-[1.05] text-primary mb-8" style={{ letterSpacing: '-0.04em' }}>
          MASTER THE <br className="hidden md:block" />MATCHDAY.
        </h1>
        
        <p className="text-lg md:text-xl text-text-secondary font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
          Your intelligent companion for navigating the FIFA World Cup with live routing, crowd intelligence, and personalised recommendations.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 w-full sm:w-auto">
          <button 
            onClick={onStart}
            aria-label="Begin your Northstar matchday experience"
            className="group relative px-10 py-4 bg-primary hover:bg-black text-white font-bold text-[15px] rounded-full overflow-hidden transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-3 shadow-premium hover:shadow-premium-hover"
          >
            Let&apos;s Begin
            <span aria-hidden="true" className="transform group-hover:translate-x-1 transition-transform">→</span>
          </button>
          <button 
            aria-label="Learn more about Northstar features"
            className="group relative px-10 py-4 bg-transparent hover:bg-black/5 text-primary font-bold text-[15px] rounded-full transition-all duration-300 w-full sm:w-auto border border-border-strong"
          >
            Learn More
          </button>
        </div>

        {/* Metrics Horizontal Bar */}
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 pt-12 border-t border-border-subtle w-full">
          {metrics.map((metric, i) => (
            <div key={i} className="flex flex-col items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-border-subtle flex items-center justify-center group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                <metric.icon className="w-4 h-4 text-primary" strokeWidth={1.5} />
              </div>
              <span className="text-xs font-bold tracking-wide text-text-secondary">{metric.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
