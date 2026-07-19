'use client';

import * as React from "react";
import { Sparkles } from "lucide-react";
import { NotificationToaster } from "@/components/ui/NotificationToaster";
import { useTelemetryStore } from "@/store/useTelemetryStore";
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
import { OrganizerHeader } from "@/components/organizer/OrganizerHeader";
import { AttendanceWidget } from "@/components/organizer/AttendanceWidget";
import { ActiveIncidentsWidget } from "@/components/organizer/ActiveIncidentsWidget";

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
      <div className="h-screen w-full bg-[#0a0a0a] text-primary relative overflow-y-auto overflow-x-hidden font-sans pb-24 no-scrollbar">
        <NotificationToaster profile="Organizer" />
        
        {/* Abstract Background */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-fifa-blue/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-[1800px] mx-auto px-6 md:px-12 pt-12">
          
          <OrganizerHeader />

          {/* Massive Bento Grid for Organizer */}
          <BentoGrid className="auto-rows-[minmax(250px,auto)] gap-6">
            
            {/* Primary KPI - Total Attendance */}
            <BentoGridItem colSpan={2} rowSpan={1} className="p-0 border-none bg-transparent shadow-none">
              <AttendanceWidget totalAttendance={totalAttendance} />
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
               <ActiveIncidentsWidget activeMedical={activeMedical} activeSecurity={activeSecurity} />
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
