'use client';

import { motion } from "framer-motion";
import { Zap, Droplets, Trash2, Leaf, CloudRain, Sun, ChevronRight } from "lucide-react";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { BentoGrid, BentoGridItem } from "@/components/ui/BentoGrid";
import { PageTransition } from "@/components/ui/PageTransition";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useTelemetryStore } from "@/store/useTelemetryStore";
import { useDemoStore } from "@/store/useDemoStore";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

export default function SustainabilityPage() {
  const { weather, sustainability } = useTelemetryStore();
  useDemoStore();
  
  const powerConsumption = sustainability.powerConsumptionMw;
  const waterUsage = sustainability.waterUsageLpm;
  const wasteDiversion = sustainability.wasteDiversionPercent;

  return (
    <PageTransition>
      <div className="p-10 h-full flex flex-col max-w-[1600px] mx-auto overflow-y-auto no-scrollbar w-full">
        
        <div className="mb-12 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          >
            <h1 className="text-display-sm font-display font-bold text-text-main tracking-tighter leading-none mb-4 flex items-center gap-4">
              <Leaf className="w-12 h-12 text-success/80" strokeWidth={1} />
              Sustainability
            </h1>
            <p className="text-text-secondary text-lg font-light tracking-wide max-w-xl leading-relaxed">
              Live resource optimization, footprint tracking, and AI-driven environmental containment.
            </p>
          </motion.div>
        </div>

        <BentoGrid className="grid-cols-1 md:grid-cols-3 gap-8 mb-8 auto-rows-[320px]">
          {/* Power Consumption */}
          <BentoGridItem className="p-10 flex flex-col justify-between group overflow-hidden relative">
            <div className="absolute -right-8 -top-8 opacity-[0.03] transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 ease-out">
              <Zap className="w-64 h-64 text-warning" />
            </div>
            <div className="relative z-10 flex items-center gap-3 mb-auto">
              <div className="p-3 bg-warning/10 rounded-2xl text-warning">
                <Zap className="w-6 h-6" />
              </div>
              <span className="text-sm uppercase tracking-widest font-bold text-text-muted">Grid Power</span>
            </div>
            <div className="relative z-10">
              <div className="flex items-baseline gap-2 mb-2">
                <div className="text-7xl font-display font-bold text-text-main tracking-tighter">
                  {powerConsumption}
                </div>
                <span className="text-2xl text-text-muted font-medium">MW</span>
              </div>
              <div className="text-sm font-medium text-success bg-success/10 px-3 py-1.5 rounded-full w-fit">
                {sustainability.baselineDiffPower > 0 ? `+${sustainability.baselineDiffPower}% above baseline` : `${sustainability.baselineDiffPower}% vs expected baseline`}
              </div>
            </div>
          </BentoGridItem>

          {/* Water Usage */}
          <BentoGridItem className="p-10 flex flex-col justify-between group overflow-hidden relative">
            <div className="absolute -right-8 -bottom-8 opacity-[0.03] transform group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700 ease-out">
              <Droplets className="w-64 h-64 text-primary" />
            </div>
            <div className="relative z-10 flex items-center gap-3 mb-auto">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <Droplets className="w-6 h-6" />
              </div>
              <span className="text-sm uppercase tracking-widest font-bold text-text-muted">Water Output</span>
            </div>
            <div className="relative z-10">
              <div className="flex items-baseline gap-2 mb-2">
                <div className="text-7xl font-display font-bold text-text-main tracking-tighter">
                  <AnimatedNumber value={waterUsage} />
                </div>
                <span className="text-2xl text-text-muted font-medium">L/m</span>
              </div>
              <div className="text-sm font-medium text-warning bg-warning/10 px-3 py-1.5 rounded-full w-fit">
                {sustainability.baselineDiffWater > 0 ? `+${sustainability.baselineDiffWater}% above baseline` : `${sustainability.baselineDiffWater}% vs expected baseline`}
              </div>
            </div>
          </BentoGridItem>

          {/* Waste Diversion */}
          <BentoGridItem className="p-10 flex flex-col justify-between group overflow-hidden relative bg-success/[0.02] border-success/10">
            <div className="absolute -right-8 -top-8 opacity-[0.03] transform group-hover:scale-110 transition-all duration-700 ease-out">
              <Trash2 className="w-64 h-64 text-success" />
            </div>
            <div className="relative z-10 flex items-center gap-3 mb-auto">
              <div className="p-3 bg-success/10 rounded-2xl text-success">
                <Trash2 className="w-6 h-6" />
              </div>
              <span className="text-sm uppercase tracking-widest font-bold text-text-muted">Waste Diversion</span>
            </div>
            <div className="relative z-10">
              <div className="flex items-baseline gap-2 mb-2">
                <div className="text-7xl font-display font-bold text-success tracking-tighter">
                  <AnimatedNumber value={wasteDiversion} />
                </div>
                <span className="text-2xl text-success/60 font-medium">%</span>
              </div>
              <div className="text-sm font-medium text-success bg-success/10 px-3 py-1.5 rounded-full w-fit border border-success/20">
                Target: 80% (Met)
              </div>
            </div>
          </BentoGridItem>
        </BentoGrid>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
          className="mt-4"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px bg-border-strong flex-1"></div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-text-muted px-4">AI Optimizations Available</h2>
            <div className="h-px bg-border-strong flex-1"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PremiumCard variant="flat" padding="lg" hoverEffect="lift" className="flex flex-col justify-between min-h-[220px]">
              <div>
                <h3 className="text-xl font-display font-semibold text-text-main mb-3 flex items-center">
                  {weather.condition === "clear" ? (
                    <span className="p-2 bg-warning/10 rounded-xl mr-3"><Sun className="w-5 h-5 text-warning" /></span>
                  ) : (
                    <span className="p-2 bg-primary/10 rounded-xl mr-3"><CloudRain className="w-5 h-5 text-primary" /></span>
                  )}
                  {weather.condition === "clear" ? "Lighting Optimization" : "Rainwater Capture Mode"}
                </h3>
                <p className="text-text-secondary leading-relaxed mb-6 ml-12">
                  {weather.condition === "clear" 
                    ? "Concourse C natural light levels are high. Dimming artificial lighting by 40% will save 2.4 MW/h without impacting visibility." 
                    : "Heavy rainfall detected. Activating secondary catchment systems can divert an additional 12,000L to non-potable storage."}
                </p>
              </div>
              <div className="ml-12 flex items-center justify-between pt-4 border-t border-border-subtle">
                <span className="text-sm font-bold text-success uppercase tracking-wider">
                  Impact: {weather.condition === "clear" ? "-2.4 MW/h" : "+12,000L Capture"}
                </span>
                <MagneticButton variant="secondary" size="sm" className="group/btn">
                  <span>{weather.condition === "clear" ? "Apply Dimming" : "Activate"}</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                </MagneticButton>
              </div>
            </PremiumCard>

            <PremiumCard variant="flat" padding="lg" hoverEffect="lift" className="flex flex-col justify-between min-h-[220px]">
              <div>
                <h3 className="text-xl font-display font-semibold text-text-main mb-3 flex items-center">
                  <span className="p-2 bg-primary/10 rounded-xl mr-3"><Droplets className="w-5 h-5 text-primary" /></span>
                  HVAC Loop Rebalance
                </h3>
                <p className="text-text-secondary leading-relaxed mb-6 ml-12">
                  Cooling tower 4 is drawing excess water due to localized thermal spikes. Rebalancing thermal load to tower 2 will reduce total water consumption.
                </p>
              </div>
              <div className="ml-12 flex items-center justify-between pt-4 border-t border-border-subtle">
                <span className="text-sm font-bold text-success uppercase tracking-wider">Impact: -45 L/m</span>
                <MagneticButton variant="secondary" size="sm" className="group/btn">
                  <span>Rebalance</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                </MagneticButton>
              </div>
            </PremiumCard>
          </div>
        </motion.div>
        
      </div>
    </PageTransition>
  );
}
