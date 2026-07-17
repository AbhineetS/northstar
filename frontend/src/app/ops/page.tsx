'use client';

import * as React from "react";
import { DigitalTwin } from "@/components/ops/DigitalTwin";
import { AICommandPanel, RecommendationProps } from "@/components/ops/AICommandPanel";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { PageTransition } from "@/components/ui/PageTransition";
import { Users, Activity, Cross } from "lucide-react";
import { motion } from "framer-motion";
import { NotificationToaster } from "@/components/ui/NotificationToaster";
import { useTelemetryStore } from "@/store/useTelemetryStore";
import { useAppStore } from "@/store/useAppStore";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { aiService } from "@/services";

export default function OpsDashboard() {
  const { totalAttendance, ingressRate, incidents, resolveIncident } = useTelemetryStore();
  const activeMedical = incidents.filter(i => i.type === "Medical" && i.status === "Active").length;
  
  const [recommendations, setRecommendations] = React.useState<RecommendationProps[]>([]);
  const { weather, match } = useAppStore();

  React.useEffect(() => {
    let isMounted = true;
    aiService.generateOpsRecommendations({ 
      role: 'Organizer', 
      ingressRate, 
      incidents,
      weather: weather.data,
      match: match.data
    })
      .then((recs) => {
        if (isMounted) setRecommendations(recs);
      })
      .catch((err) => {
        console.error("Failed to load ops recs", err);
        if (isMounted) setRecommendations([]);
      });
      
    return () => { isMounted = false; };
  }, [ingressRate, incidents, weather.data, match.data]);

  return (
    <PageTransition>
      <div className="flex h-screen w-full relative bg-primary overflow-hidden">
        <NotificationToaster profile="Organizer" />
        
        {/* Massive Edge-to-Edge Map Backdrop */}
        <div className="absolute inset-0 z-0">
          <DigitalTwin />
          {/* Subtle vignette for premium cinematic feel */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-primary/40 pointer-events-none" />
        </div>

        {/* Floating Widgets overlaying the Digital Twin (Arc Browser / VisionOS inspired) */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          className="absolute bottom-10 left-10 flex space-x-6 z-10 pointer-events-none"
        >
          <Widget 
            title="Total Attendance" 
            value={totalAttendance} 
            trend="+2.4% vs expected" 
            icon={<Users className="w-5 h-5" />} 
          />
          <Widget 
            title="Gate Flow Rate" 
            value={ingressRate} 
            suffix="/ min" 
            trend={ingressRate > 4000 ? "Critical" : "Optimal"} 
            icon={<Activity className="w-5 h-5" />} 
            status={ingressRate > 4000 ? "danger" : "primary"} 
          />
          <Widget 
            title="Active Medical" 
            value={activeMedical} 
            trend={activeMedical === 0 ? "Nominal" : "Action Required"} 
            icon={<Cross className="w-5 h-5" />} 
            status={activeMedical === 0 ? "success" : "warning"} 
          />
        </motion.div>

        {/* Right Sidebar: AI Command Panel */}
        <motion.div 
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1], delay: 0.2 }}
          className="absolute right-6 top-6 bottom-6 w-[420px] z-20 shadow-premium"
        >
          <div className="h-full rounded-4xl overflow-hidden glass-panel-strong border-white/20">
            <AICommandPanel 
              recommendations={recommendations} 
              onDismiss={(id) => resolveIncident(id)} 
            />
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}

const Widget = ({ title, value, suffix, trend, icon, status = "primary" }: { title: string, value: number, suffix?: string, trend: string, icon: React.ReactNode, status?: string }) => {
  const isNumber = typeof value === 'number';
  
  const statusColors: Record<string, string> = {
    primary: 'text-white',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger'
  };

  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 40, scale: 0.9 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] } }
      }} 
      className="pointer-events-auto"
    >
      <PremiumCard 
        variant="glass" 
        padding="lg"
        hoverEffect="lift"
        className="w-72 bg-black/40 backdrop-blur-3xl border-white/10 text-white shadow-premium"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-white/60 font-medium tracking-wide uppercase">{title}</span>
          <div className={`p-2 rounded-full bg-white/5 ${statusColors[status]}`}>
            {icon}
          </div>
        </div>
        <div className="text-4xl font-display font-bold mb-2 flex items-baseline tracking-tight">
          {isNumber ? <AnimatedNumber value={value} /> : value}
          {suffix && <span className="text-base font-sans font-normal text-white/50 ml-2">{suffix}</span>}
        </div>
        <div className={`text-sm font-medium ${status === 'success' ? 'text-success' : status === 'danger' ? 'text-danger' : 'text-white/40'}`}>
          {trend}
        </div>
      </PremiumCard>
    </motion.div>
  );
};
