import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Sparkles, Activity, Clock } from 'lucide-react';
import Link from 'next/link';
import { MagneticButton } from '@/components/ui/MagneticButton';

export const OrganizerHeader: React.FC = () => {
  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-8">
      <div className="flex flex-col gap-4">
        <Link href="/">
          <MagneticButton variant="ghost" size="sm" className="w-fit -ml-2 rounded-2xl text-text-muted hover:text-primary h-10 px-3 gap-2">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-bold">Back to Hub</span>
          </MagneticButton>
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-white/70">FIFA Global Control</span>
          </div>
          <h1 className="text-[5.5rem] font-display font-black tracking-[-0.07em] leading-[0.8] text-white mb-2 -ml-1">
            Tournament<br/>Command
          </h1>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.6, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
        className="flex gap-4"
      >
        <div className="bg-surface-elevated/80 backdrop-blur-xl border border-border-subtle rounded-3xl p-6 shadow-elevation-high min-w-[200px]">
          <div className="flex items-center gap-2 mb-4 text-text-muted">
            <Activity className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Venue Status</span>
          </div>
          <div className="flex items-end gap-3">
            <div className="w-3 h-3 rounded-full bg-success animate-pulse mb-2" />
            <span className="text-3xl font-display font-black text-text-main">NOMINAL</span>
          </div>
        </div>
        <div className="bg-primary text-white rounded-3xl p-6 shadow-glow-primary min-w-[200px] flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
          <div className="flex items-center gap-2 mb-4 text-white/80 relative z-10">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Next Match</span>
          </div>
          <div className="relative z-10">
            <span className="text-3xl font-display font-black block leading-none mb-1">15:00</span>
            <span className="text-sm font-medium text-white/80">Gate Opening in 45m</span>
          </div>
        </div>
      </motion.div>
    </header>
  );
};
