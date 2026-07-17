'use client';

import { motion, AnimatePresence } from "framer-motion";
import { Clock, MapPin, Activity, CheckCircle, ShieldCheck, Plus } from "lucide-react";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { Badge } from "@/components/ui/Badge";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { PageTransition } from "@/components/ui/PageTransition";
import { EmptyState } from "@/components/ui/EmptyState";
import { useTelemetryStore } from "@/store/useTelemetryStore";

export default function IncidentsPage() {
  const { incidents, resolveIncident } = useTelemetryStore();

  return (
    <PageTransition>
      <div className="p-10 h-full flex flex-col max-w-[1600px] mx-auto overflow-y-auto no-scrollbar w-full">
        
        <div className="flex justify-between items-end mb-12 max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          >
            <h1 className="text-display-sm font-display font-bold text-text-main tracking-tighter leading-none mb-4">
              Incident <span className="text-text-muted">Response</span>
            </h1>
            <p className="text-text-secondary text-lg font-light tracking-wide max-w-xl leading-relaxed">
              Real-time threat detection and AI-assisted response tracking across all stadium sectors.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
          >
            <MagneticButton variant="primary" className="pl-5 pr-6 rounded-full">
              <Plus className="w-5 h-5" />
              <span>Create Incident</span>
            </MagneticButton>
          </motion.div>
        </div>

        <motion.div 
          className="space-y-6 max-w-7xl mx-auto w-full relative"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <AnimatePresence mode="popLayout">
            {incidents.length === 0 ? (
              <EmptyState 
                key="empty"
                icon={ShieldCheck} 
                title="All Sectors Secure" 
                description="No active incidents reported. AI perimeter monitoring is active and operating nominally." 
              />
            ) : (
              incidents.map((inc) => (
                <motion.div 
                  key={inc.id} 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] } }
                  }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
                  layout
                >
                  <PremiumCard 
                    variant="flat" 
                    padding="lg"
                    hoverEffect="lift"
                    className={`relative overflow-hidden group border-l-4 ${
                      inc.priority === 'critical' ? 'border-l-danger bg-danger/[0.02]' : 
                      inc.priority === 'high' ? 'border-l-warning bg-warning/[0.02]' : 
                      'border-l-success'
                    }`}
                  >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/[0.03] to-transparent rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none transition-opacity group-hover:opacity-100 opacity-50" />
                    
                    <div className="flex flex-col md:flex-row items-start justify-between relative z-10 gap-6">
                      
                      <div className="flex-1 space-y-6">
                        <div className="flex items-center space-x-3">
                          <span className="font-mono text-xs font-medium text-text-muted px-2 py-1 bg-surface-elevated rounded-md border border-border-subtle tracking-wider">
                            {inc.id}
                          </span>
                          <Badge variant={inc.priority === 'critical' ? 'danger' : inc.priority === 'high' ? 'warning' : 'neutral'} className="px-3 py-1 text-xs">
                            {inc.priority.toUpperCase()}
                          </Badge>
                          <Badge variant={inc.status === 'Active' ? 'warning' : 'success'} className="px-3 py-1 text-xs">
                            {inc.status}
                          </Badge>
                        </div>

                        <div>
                          <h3 className="text-2xl font-display font-semibold text-text-main mb-3 tracking-tight group-hover:text-primary transition-colors">{inc.description}</h3>
                          <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-text-secondary">
                            <span className="flex items-center bg-surface px-3 py-1.5 rounded-lg border border-border-subtle"><MapPin className="w-4 h-4 mr-2 text-text-muted" /> {inc.location}</span>
                            <span className="flex items-center bg-surface px-3 py-1.5 rounded-lg border border-border-subtle"><Clock className="w-4 h-4 mr-2 text-text-muted" /> {inc.timeActiveMinutes}m active</span>
                          </div>
                        </div>

                        <div className="bg-surface-elevated p-4 rounded-2xl border border-border-subtle inline-block max-w-xl shadow-sm">
                          <span className="text-xs uppercase text-primary font-bold tracking-wider flex items-center mb-2">
                            <Activity className="w-4 h-4 mr-2 text-warning" />
                            AI Assessment
                          </span>
                          <p className="text-sm text-text-secondary leading-relaxed">Automated response protocols initiated. Cross-referencing telemetry data suggests localized containment is effective.</p>
                        </div>
                      </div>

                      <div className="flex md:flex-col space-x-4 md:space-x-0 md:space-y-4 shrink-0">
                        {inc.status === 'Active' && (
                          <>
                            <MagneticButton variant="ghost" size="md" className="w-full justify-start text-text-secondary">Update Details</MagneticButton>
                            <MagneticButton 
                              onClick={() => resolveIncident(inc.id)} 
                              variant="secondary" 
                              size="md" 
                              className="w-full bg-success/10 text-success border-success/20 hover:bg-success hover:text-white group/btn"
                            >
                              <CheckCircle className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                              <span>Resolve</span>
                            </MagneticButton>
                          </>
                        )}
                      </div>
                    </div>
                  </PremiumCard>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </PageTransition>
  );
}
