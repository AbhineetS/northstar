'use client';

import * as React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Users, Activity, Sparkles, ShieldCheck, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";
import { NotificationToaster } from "@/components/ui/NotificationToaster";
import { useTelemetryStore } from "@/store/useTelemetryStore";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { AICommandPanel, RecommendationProps } from "@/components/ops/AICommandPanel";
import { IncidentManager } from "@/components/ops/IncidentManager";
import { WeatherImpactWidget, ResourceStatusWidget } from "@/components/ops/OpsWidgets";
import { StadiumOverviewWidget } from "@/components/ops/StadiumOverviewWidget";
import { GateMonitoringWidget } from "@/components/ops/GateMonitoringWidget";
import { PredictiveAnalyticsWidget } from "@/components/ops/PredictiveAnalyticsWidget";
import { aiService } from "@/services";
import { BentoGrid, BentoGridItem } from "@/components/ui/BentoGrid";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { PageTransition } from "@/components/ui/PageTransition";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

const MOCK_ATTENDANCE_DATA = [
  { time: '12:00', value: 12000 },
  { time: '13:00', value: 25000 },
  { time: '14:00', value: 45000 },
  { time: '15:00', value: 68000 },
  { time: '16:00', value: 81000 },
  { time: '17:00', value: 84500 },
];

export default function OrganizerDashboard() {
  const { totalAttendance, ingressRate, incidents, resolveIncident, tick } = useTelemetryStore();
  const activeMedical = incidents.filter(i => i.type === "Medical" && i.status === "Active").length;
  const activeSecurity = incidents.filter(i => i.type === "Security" && i.status === "Active").length;
  
  const [recommendations, setRecommendations] = React.useState<RecommendationProps[]>([]);

  React.useEffect(() => {
    let isMounted = true;
    
    // Simulate real-time telemetry updates
    const interval = setInterval(() => {
      if (isMounted) tick();
    }, 5000);

    aiService.generateOpsRecommendations({ role: 'Organizer', ingressRate, incidents })
      .then((recs) => {
        if (isMounted) setRecommendations(recs);
      })
      .catch((err) => {
        console.error("Failed to load ops recs", err);
        if (isMounted) setRecommendations([]);
      });
      
    return () => { 
      isMounted = false; 
      clearInterval(interval);
    };
  }, [ingressRate, incidents, tick]);

  return (
    <PageTransition>
      <div className="min-h-screen w-full bg-[#0a0a0a] text-primary relative overflow-x-hidden font-sans pb-24">
        <NotificationToaster profile="Organizer" />
        
        {/* Abstract Background */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-fifa-blue/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-[1800px] mx-auto px-6 md:px-12 pt-12">
          
          {/* Executive Header */}
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

          {/* Massive Bento Grid for Organizer */}
          <BentoGrid className="auto-rows-[250px] gap-6">
            
            {/* Primary KPI - Total Attendance */}
            <BentoGridItem colSpan={2} rowSpan={1} className="p-0 border-none bg-transparent shadow-none">
              <PremiumCard variant="glass" enableTilt className="h-full bg-surface-elevated/80 p-8 flex flex-col justify-between group overflow-hidden border-border-subtle shadow-elevation-high">
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-surface rounded-2xl text-text-main group-hover:bg-primary group-hover:text-white transition-colors duration-500 border border-border-subtle group-hover:border-transparent">
                      <Users className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-widest text-text-muted">Total Attendance</span>
                  </div>
                  <div className="flex items-center gap-1 text-success bg-success/10 px-3 py-1.5 rounded-full font-bold text-xs border border-success/20">
                    <TrendingUp className="w-3 h-3" />
                    <span>+12% vs expected</span>
                  </div>
                </div>
                <div className="relative z-10 flex items-end justify-between">
                  <div>
                    <span className="text-[120px] font-display font-black leading-none tracking-tighter text-text-main">
                      <AnimatedNumber value={totalAttendance} />
                    </span>
                  </div>
                  <div className="w-[300px] h-[100px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={MOCK_ATTENDANCE_DATA}>
                        <defs>
                          <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--text-main)" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="var(--text-main)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="value" stroke="var(--text-main)" strokeWidth={3} fillOpacity={1} fill="url(#attGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </PremiumCard>
            </BentoGridItem>

            {/* Stadium Overview / Crowd Heatmap */}
            <BentoGridItem colSpan={2} rowSpan={2} className="p-0">
               <StadiumOverviewWidget />
            </BentoGridItem>

            {/* AI Command Center */}
            <BentoGridItem colSpan={1} rowSpan={2} className="p-0 border-none bg-transparent shadow-none">
              <PremiumCard variant="glass" enableTilt className="h-full flex flex-col overflow-hidden bg-surface-elevated/80 backdrop-blur-3xl shadow-elevation-high border-border-subtle">
                <div className="p-6 border-b border-border-subtle bg-surface/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-glow-primary">
                      <Sparkles className="w-5 h-5 text-white animate-pulse" />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg text-text-main leading-tight">Executive Copilot</h2>
                      <p className="text-xs text-text-secondary font-medium">Real-time operational intelligence</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar p-6 bg-surface-elevated/30">
                  <AICommandPanel 
                    recommendations={recommendations} 
                    onDismiss={resolveIncident} 
                  />
                </div>
              </PremiumCard>
            </BentoGridItem>

            {/* Predictive Analytics */}
            <BentoGridItem colSpan={1} rowSpan={2} className="p-0">
               <PredictiveAnalyticsWidget />
            </BentoGridItem>

            {/* Gate Monitoring */}
            <BentoGridItem colSpan={1} rowSpan={2} className="p-0">
               <GateMonitoringWidget />
            </BentoGridItem>

            {/* Weather Impact */}
            <BentoGridItem colSpan={1} rowSpan={1} className="p-0">
               <WeatherImpactWidget />
            </BentoGridItem>

            {/* Critical Metrics Row: Active Incidents */}
            <BentoGridItem colSpan={1} rowSpan={1} className="p-0 border-none bg-transparent shadow-none">
               <PremiumCard variant="solid" enableTilt className="h-full p-8 flex flex-col justify-between bg-fifa-red text-white shadow-[0_10px_40px_rgba(238,50,78,0.3)]">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/10 rounded-2xl text-white backdrop-blur-sm">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-widest text-white/90">Active Incidents</span>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-8xl font-display font-black leading-none tracking-tighter">
                      <AnimatedNumber value={activeMedical + activeSecurity} />
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 pb-2">
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      <span className="text-sm font-bold">{activeMedical} Medical</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                      <span className="w-2 h-2 rounded-full bg-[#fbbc05] animate-pulse" />
                      <span className="text-sm font-bold">{activeSecurity} Security</span>
                    </div>
                  </div>
                </div>
              </PremiumCard>
            </BentoGridItem>

            {/* Resource Status */}
            <BentoGridItem colSpan={1} rowSpan={1} className="p-0">
               <ResourceStatusWidget />
            </BentoGridItem>

            {/* Incident Manager Log */}
            <BentoGridItem colSpan={2} rowSpan={1} className="p-0 border-none bg-transparent shadow-none">
               <PremiumCard variant="glass" enableTilt className="h-full p-0 bg-surface-elevated/80 backdrop-blur-3xl shadow-elevation-high border-border-subtle overflow-hidden">
                 <IncidentManager />
               </PremiumCard>
            </BentoGridItem>

          </BentoGrid>
        </div>
      </div>
    </PageTransition>
  );
}
