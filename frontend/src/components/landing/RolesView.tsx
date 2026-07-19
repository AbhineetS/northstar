import React from 'react';
import { motion } from 'framer-motion';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { PersonaDetails } from '@/components/ui/ProfileLoader';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';

const CountingNumber = ({ target }: { target: number }) => {
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    const timer = setTimeout(() => setVal(target), 400);
    return () => clearTimeout(timer);
  }, [target]);
  
  if (target >= 1000000) {
    return (
      <span className="flex items-center">
        <AnimatedNumber value={val / 1000000} />
        <span className="ml-0.5">M</span>
      </span>
    );
  }
  return <AnimatedNumber value={val} />;
};

interface RolesViewProps {
  personas: PersonaDetails[];
  onBack: () => void;
  onSelectPersona: (persona: PersonaDetails) => void;
}

export const RolesView: React.FC<RolesViewProps> = ({ personas, onBack, onSelectPersona }) => {
  return (
    <motion.div 
      key="roles"
      initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      className="flex flex-col flex-grow px-6 md:px-12 lg:px-16 py-12 justify-center z-10 min-h-screen bg-transparent relative"
    >
      <div className="max-w-[1400px] mx-auto w-full relative z-20">
        <div className="mb-12 text-center">
          <button 
            onClick={onBack}
            className="text-xs uppercase tracking-widest font-bold text-text-muted hover:text-primary mb-6 transition-colors"
          >
            ← Back to Hub
          </button>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-display font-black tracking-tighter text-primary leading-none"
          >
            Select Protocol
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {personas.map((persona, i) => (
            <motion.div
              key={persona.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + (i * 0.05), duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              <PremiumCard 
                variant="solid" 
                padding="lg" 
                hoverEffect="lift"
                className="h-full cursor-pointer group bg-surface hover:bg-surface-elevated border-border-subtle flex flex-col justify-between overflow-hidden relative shadow-sm"
                onClick={() => onSelectPersona(persona)}
              >
                <div className="relative z-10 flex justify-between items-start mb-8">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${persona.color} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm bg-white/50 border border-white`}>
                    <persona.icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-text-muted">Online</span>
                  </div>
                </div>
                
                <div className="relative z-10 mb-8">
                  <h3 className="text-xl font-bold tracking-tight mb-3 text-primary">{persona.title}</h3>
                  <p className="text-sm text-text-secondary font-medium leading-relaxed">
                    {persona.description}
                  </p>
                </div>
                
                <div className="relative z-10 mt-auto pt-6 border-t border-border-subtle flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black tracking-tighter text-primary flex items-baseline gap-1">
                      <CountingNumber target={persona.metric || 0} />
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-text-muted mt-1">
                      {persona.metricLabel}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-background border border-border-strong flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300">
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </PremiumCard>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
