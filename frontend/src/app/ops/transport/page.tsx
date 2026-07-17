'use client';

import { motion } from "framer-motion";
import { Train, Car, Bus, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";
import { BentoGrid, BentoGridItem } from "@/components/ui/BentoGrid";
import { PageTransition } from "@/components/ui/PageTransition";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Badge } from "@/components/ui/Badge";
import { useTelemetryStore } from "@/store/useTelemetryStore";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

export default function TransportPage() {
  const { transportHubs } = useTelemetryStore();

  const getIcon = (id: string) => {
    if (id.includes("metro")) return <Train className="w-6 h-6" />;
    if (id.includes("ride")) return <Car className="w-6 h-6" />;
    return <Bus className="w-6 h-6" />;
  };

  const getAiAlert = (id: string, status: string) => {
    if (status !== "Critical" && status !== "Warning") return null;
    if (id.includes("ride")) return "Vehicle bottleneck. Redirecting incoming drivers to West Lot overflow.";
    if (id.includes("bus")) return "Approaching capacity. Requested 3 additional buses from dispatch.";
    return "High demand detected. Dispatching crowd control teams.";
  };

  return (
    <PageTransition>
      <div className="p-10 h-full flex flex-col mx-auto overflow-y-auto no-scrollbar max-w-[1600px] w-full">
        
        <div className="mb-12 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          >
            <h1 className="text-display-sm font-display font-bold text-text-main tracking-tighter leading-none mb-4">
              Transport <span className="text-text-muted">Network</span>
            </h1>
            <p className="text-text-secondary text-lg font-light tracking-wide max-w-xl leading-relaxed">
              Live transit hub monitoring and predictive routing capabilities orchestrated by AI.
            </p>
          </motion.div>
        </div>

        <BentoGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 auto-rows-[auto]">
          {transportHubs.map((hub, idx) => {
            const aiAlert = getAiAlert(hub.id, hub.status);
            const isLarge = hub.status === 'Critical' || idx === 0;
            
            return (
              <BentoGridItem 
                key={hub.id} 
                colSpan={isLarge ? 2 : 1}
                rowSpan={isLarge ? 2 : 1}
                className={`flex flex-col group ${isLarge ? 'p-10' : 'p-8'} ${hub.status === 'Critical' ? 'bg-danger/5 border-danger/20' : ''}`}
              >
                <div className="flex justify-between items-start mb-auto">
                  <div className={`p-4 rounded-3xl ${hub.status === 'Critical' ? 'bg-danger/10 text-danger' : 'bg-surface-elevated text-primary shadow-sm'}`}>
                    {getIcon(hub.id)}
                  </div>
                  <Badge variant={hub.status === 'Critical' ? 'danger' : hub.status === 'Warning' ? 'warning' : 'success'} className="px-3 py-1 text-xs">
                    {hub.status}
                  </Badge>
                </div>
                
                <div className={`${isLarge ? 'mt-16' : 'mt-12'} mb-8`}>
                  <h3 className={`${isLarge ? 'text-3xl' : 'text-2xl'} font-display font-semibold tracking-tight text-text-main mb-2 group-hover:text-primary transition-colors`}>
                    {hub.name}
                  </h3>
                  
                  <div className="flex items-end gap-3 mt-4">
                    <div className={`${isLarge ? 'text-6xl' : 'text-5xl'} font-display font-bold tracking-tighter ${hub.status === 'Critical' ? 'text-danger' : 'text-text-main'}`}>
                      <AnimatedNumber value={hub.capacity} />%
                    </div>
                    <div className="mb-2 text-text-muted font-medium flex items-center">
                      Capacity <TrendingUp className="w-4 h-4 ml-2 mr-1" /> {hub.trend}
                    </div>
                  </div>
                </div>

                {aiAlert && isLarge && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 p-5 rounded-3xl bg-surface-elevated border border-border-subtle shadow-sm flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs uppercase text-warning font-bold tracking-wider flex items-center mb-1">
                        <AlertTriangle className="w-3 h-3 mr-1" /> AI Action
                      </span>
                      <p className="text-sm text-text-secondary leading-relaxed max-w-sm">{aiAlert}</p>
                    </div>
                    <MagneticButton variant="primary" size="icon" className="shrink-0 h-12 w-12 rounded-full">
                      <ArrowRight className="w-5 h-5" />
                    </MagneticButton>
                  </motion.div>
                )}
              </BentoGridItem>
            );
          })}
        </BentoGrid>
      </div>
    </PageTransition>
  );
}
