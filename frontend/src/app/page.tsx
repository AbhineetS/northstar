'use client';

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Users, Briefcase, ClipboardList, ShieldCheck, Map, Clock, Navigation } from "lucide-react";
import { ProfileLoader, PersonaDetails } from "@/components/ui/ProfileLoader";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { PageTransition } from "@/components/ui/PageTransition";
import dynamic from "next/dynamic";
const RealisticPitch = dynamic(() => import("@/components/ui/RealisticPitch").then(m => m.RealisticPitch), { ssr: false });
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

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

const PERSONAS = [
  { id: "fan", title: "Fan Experience", description: "Your personal Matchday Companion.", icon: Users, href: "/fan", color: "bg-fifa-blue/10 text-fifa-blue", loadingSteps: ["Curating matchday experience...", "Analyzing optimal routes...", "Syncing digital twin..."], metric: 1200000, metricLabel: "Fans Connected" },
  { id: "organizer", title: "Control Room", description: "Operational intelligence and crowd heatmaps.", icon: Briefcase, href: "/organizer", color: "bg-fifa-red/10 text-fifa-red", loadingSteps: ["Initializing executive summary...", "Aggregating telemetry...", "Loading spatial models..."], metric: 12, metricLabel: "Active Incidents" },
  { id: "ops", title: "Field Operations", description: "Command center for ground ops and crowd control.", icon: ShieldCheck, href: "/ops", color: "bg-fifa-green/10 text-fifa-green", loadingSteps: ["Establishing secure connection...", "Mapping sector zones...", "Syncing incident logs..."], metric: 248, metricLabel: "Active Tasks" },
  { id: "staff", title: "Venue Staff", description: "Live work orders and maintenance routing.", icon: ClipboardList, href: "/staff", color: "bg-fifa-gold/10 text-fifa-gold", loadingSteps: ["Loading task matrix...", "Syncing communication nodes...", "Activating copilot..."], metric: 82, metricLabel: "Staff Online" }
];

const METRICS = [
  { label: "64 Matches", icon: ClipboardList },
  { label: "16 Host Cities", icon: Map },
  { label: "Real-Time AI", icon: Clock },
  { label: "Live Navigation", icon: Navigation }
];


export default function LandingPage() {
  const router = useRouter();
  const [view, setView] = React.useState<"hero" | "roles" | "loader">("hero");
  const [selectedPersona, setSelectedPersona] = React.useState<PersonaDetails | null>(null);

  const handlePersonaSelect = async (persona: PersonaDetails) => {
    setSelectedPersona(persona);
    // Bypass authentication entirely for seamless access
    setView("loader");
  };

  return (
    <PageTransition>
      <div className="relative min-h-screen w-full overflow-x-hidden flex flex-col font-sans bg-[#FCFCFA] text-primary">
        
        {/* Full Viewport 3D Cinematic Background - Muted for Clean Aesthetic */}
        <div className="absolute inset-0 opacity-[0.03] blur-sm pointer-events-none mix-blend-multiply z-0">
          <RealisticPitch />
        </div>

        <AnimatePresence mode="wait">
          {view === "hero" ? (
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
                    onClick={() => setView("roles")}
                    className="group relative px-10 py-4 bg-primary hover:bg-black text-white font-bold text-[15px] rounded-full overflow-hidden transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-3 shadow-premium hover:shadow-premium-hover"
                  >
                    Let&apos;s Begin
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                  <button 
                    className="group relative px-10 py-4 bg-transparent hover:bg-black/5 text-primary font-bold text-[15px] rounded-full transition-all duration-300 w-full sm:w-auto border border-border-strong"
                  >
                    Learn More
                  </button>
                </div>

                {/* Metrics Horizontal Bar */}
                <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 pt-12 border-t border-border-subtle w-full">
                  {METRICS.map((metric, i) => (
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
          ) : view === "roles" ? (
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
                    onClick={() => setView("hero")}
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
                  {PERSONAS.map((persona, i) => (
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
                        onClick={() => handlePersonaSelect(persona as PersonaDetails)}
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
                              <CountingNumber target={persona.metric} />
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
          ) : (
            <ProfileLoader 
              key="profile-loader"
              persona={selectedPersona!} 
              onComplete={() => router.push(selectedPersona!.href)} 
            />
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  );
}
