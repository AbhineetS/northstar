'use client';

import * as React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import { BentoGrid, BentoGridItem } from "@/components/ui/BentoGrid";
import { useTelemetryStore } from "@/store/useTelemetryStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useAppStore } from "@/store/useAppStore";
import { aiService, mapService } from "@/services";
import { DataBoundary } from "@/components/ui/DataBoundary";

// Widgets
import { MatchCountdownWidget } from "@/components/fan/MatchCountdownWidget";
import { LiveMatchWidget } from "@/components/fan/LiveMatchWidget";
import { LineupWidget } from "@/components/fan/LineupWidget";
import { StadiumMapWidget } from "@/components/fan/StadiumMapWidget";
import { LogisticsWidget } from "@/components/fan/LogisticsWidget";
import { MatchdayAssistantWidget } from "@/components/fan/MatchdayAssistantWidget";

export default function FanHome() {
  const { journeyStage } = useTelemetryStore();
  const { notifications } = useNotificationStore();
  const { weather: weatherState, match: liveMatchState, matchDetails: matchState, route: routeState, fetchMatch, fetchMatchDetails, fetchRoute, setLocation, setRole } = useAppStore();

  const [aiRecommendation, setAiRecommendation] = useState<{ title: string; text: string; action: string | null }>({
    title: "Curating your experience...",
    text: "Analyzing optimal routes and current stadium telemetry.",
    action: null
  });

  useEffect(() => {
    setRole('Fan');
    fetchMatch();
    fetchMatchDetails();
    fetchRoute("40.7100,-74.0100", "40.7128,-74.0060"); // Mock locations
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setLocation(position.coords.latitude, position.coords.longitude),
        () => setLocation(40.8128, -74.0742)
      );
    } else {
      setLocation(40.8128, -74.0742);
    }
  }, [fetchMatch, fetchMatchDetails, fetchRoute, setLocation, setRole]);

  useEffect(() => {
    let isMounted = true;
    const origin: [number, number] = [40.7100, -74.0100]; 
    const destination: [number, number] = [40.7128, -74.0060];

    mapService.getOptimizedRoute(origin, destination).then((route) => {
      if (!isMounted) return;
      aiService.generateRecommendation({ 
        role: 'Fan', 
        stage: journeyStage, 
        weather: weatherState,
        routeContext: route ? `Estimated ${route.estimatedMinutes} mins via ${route.recommendedTransport}.` : "No active route.",
        liveMatch: journeyStage === 'during_match' ? liveMatchState : null,
        activeAlerts: notifications.filter(n => n.targetProfile === 'Fan' || n.targetProfile === 'All').map(n => n.message)
      }).then((res) => {
        if (isMounted) setAiRecommendation(res);
      }).catch(() => {
        if (isMounted) setAiRecommendation({ title: "Offline", text: "AI Assistant unavailable.", action: null });
      });
    });
    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [journeyStage, weatherState.data, notifications, liveMatchState]);

  return (
    <PageTransition>
      <div className="relative h-screen w-full bg-surface pb-24 overflow-y-auto no-scrollbar pt-20 px-8">
        
        <div className="max-w-7xl mx-auto mb-12 flex justify-between items-end px-4 md:px-0">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          >
            <h1 className="text-[5.5rem] font-display font-black text-text-main leading-[0.8] tracking-[-0.07em] mb-2 -ml-1">
              Matchday<br/>
              <span className="text-black font-black">Companion</span>
            </h1>
          </motion.div>
        </div>

        {/* BentoGrid Dashboard */}
        <motion.div 
          className="max-w-7xl mx-auto pb-12"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          animate="show"
        >
          <BentoGrid className="auto-rows-[320px] gap-6">
            
            {/* Top Left: Match Countdown or Live Match (conditionally rendered) */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } }} className="md:col-span-2 md:row-span-1">
              <BentoGridItem className="p-0 h-full bg-[#E8F5E9] border-none shadow-sm">
                {journeyStage === 'during_match' ? (
                  <DataBoundary state={{ ...liveMatchState, retry: fetchMatch }}>
                    {(liveMatch) => <LiveMatchWidget liveMatch={liveMatch} />}
                  </DataBoundary>
                ) : (
                  <DataBoundary state={{ ...matchState, retry: fetchMatchDetails }}>
                    {(match) => <MatchCountdownWidget match={match} />}
                  </DataBoundary>
                )}
              </BentoGridItem>
            </motion.div>

            {/* Top Right: AI Assistant */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } }} className="md:col-span-1 md:row-span-2">
              <BentoGridItem className="p-0 h-full bg-[#F3E5F5] border-none shadow-sm">
                <MatchdayAssistantWidget recommendation={aiRecommendation} />
              </BentoGridItem>
            </motion.div>

            {/* Middle Left: Logistics & Weather */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } }} className="md:col-span-1 md:row-span-1">
              <BentoGridItem className="p-0 h-full bg-[#FFF3E0] border-none shadow-sm">
                <LogisticsWidget weather={weatherState.data} route={routeState.data} />
              </BentoGridItem>
            </motion.div>

            {/* Middle Center: Interactive Map */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } }} className="md:col-span-1 md:row-span-2">
              <BentoGridItem className="p-0 h-full bg-[#E3F2FD] border-none shadow-sm">
                <DataBoundary state={{ ...matchState, retry: fetchMatchDetails }}>
                  {(match) => <StadiumMapWidget gate={match.gate} section={match.section} seat={match.seat} />}
                </DataBoundary>
              </BentoGridItem>
            </motion.div>

            {/* Bottom Left: Lineups */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } }} className="md:col-span-1 md:row-span-1">
              <BentoGridItem className="p-0 h-full bg-[#F4F1EB] border-none shadow-sm">
                <DataBoundary state={{ ...matchState, retry: fetchMatchDetails }}>
                  {(match) => <LineupWidget homeTeam={match.homeTeam} awayTeam={match.awayTeam} />}
                </DataBoundary>
              </BentoGridItem>
            </motion.div>

            {/* Bottom Right: Personalized Content placeholder */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } }} className="md:col-span-1 md:row-span-1">
              <BentoGridItem className="p-8 flex flex-col items-center justify-center text-center h-full bg-[#FCE4EC] border-none shadow-sm rounded-[40px]">
                 <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mb-6 shadow-inner-soft">
                   <span className="text-2xl drop-shadow-sm">📸</span>
                 </div>
                 <h4 className="font-bold text-text-main mb-2 text-xl tracking-tight">Fan Cam Ready</h4>
                 <p className="text-sm text-text-muted mb-8 font-medium max-w-[200px]">Capture your moments and share them on the big screen.</p>
                 <button className="px-8 py-3.5 bg-[#2E9E61] text-white rounded-full font-bold text-sm hover:shadow-premium-hover hover:-translate-y-0.5 transition-all duration-700 ease-apple w-full max-w-[200px] shadow-lg shadow-[#2E9E61]/30">
                   Open Camera
                 </button>
              </BentoGridItem>
            </motion.div>

          </BentoGrid>
        </motion.div>
      </div>
    </PageTransition>
  );
}
