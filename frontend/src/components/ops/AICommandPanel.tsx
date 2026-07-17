"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, Target, Activity, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export interface RecommendationProps {
  id: string;
  title: string;
  context: string;
  prediction: string;
  action: string;
  impact: string;
  priority: "critical" | "high" | "medium";
}

export const AICommandPanel = ({ recommendations, onDismiss }: { recommendations: RecommendationProps[], onDismiss: (id: string) => void }) => {
  return (
    <div className="w-96 bg-surface/90 backdrop-blur-xl border-l border-border-subtle h-full flex flex-col z-10 shadow-elevation-high">
      <div className="p-5 border-b border-border-subtle bg-neutral-50/50">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-ai/10 flex items-center justify-center text-ai shadow-glow-ai">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="font-display font-bold text-lg text-text-main">Ops Intelligence</h2>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">
          AI continuously observing telemetry. Displaying active recommendations.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar relative">
        <AnimatePresence mode="popLayout">
          {recommendations.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center h-full text-center p-6 mt-12"
            >
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4 border border-success/20 shadow-glow-primary">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-text-main font-semibold mb-2">Systems Nominal</h3>
              <p className="text-sm text-text-secondary">AI is actively monitoring all sectors. No immediate actions required.</p>
            </motion.div>
          ) : (
            recommendations.map((rec) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                layout
                className="group relative"
              >
                <div className={`absolute -inset-0.5 rounded-xl bg-gradient-to-br opacity-[0.03] blur-sm transition-opacity group-hover:opacity-[0.08] ${rec.priority === "critical" ? "from-danger to-warning" : rec.priority === "high" ? "from-warning to-ai" : "from-ai to-success"}`} />
                
                <Card variant="elevated" className="relative p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {rec.priority === "critical" ? (
                        <Activity className="w-4 h-4 text-danger animate-pulse" />
                      ) : (
                        <Target className="w-4 h-4 text-warning" />
                      )}
                      <h3 className="font-semibold text-text-main text-sm uppercase tracking-wider">{rec.title}</h3>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${rec.priority === "critical" ? "bg-danger/20 text-danger" : rec.priority === "high" ? "bg-warning/20 text-warning" : "bg-accent/20 text-accent"}`}>
                      {rec.priority}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] uppercase text-text-muted font-bold tracking-wider block mb-1">What Happened</span>
                      <p className="text-sm text-text-secondary">{rec.context}</p>
                    </div>
                    
                    <div>
                      <span className="text-[10px] uppercase text-text-muted font-bold tracking-wider block mb-1">Prediction</span>
                      <p className="text-sm text-warning font-medium">{rec.prediction}</p>
                    </div>

                    <div className="bg-background p-3 rounded-lg border border-border-subtle">
                      <span className="text-[10px] uppercase text-ai font-bold tracking-wider flex items-center mb-1">
                        <Zap className="w-3 h-3 mr-1" />
                        Recommended Action
                      </span>
                      <p className="text-sm text-text-main font-medium mb-2">{rec.action}</p>
                      
                      <span className="text-[10px] uppercase text-text-muted font-bold tracking-wider block mb-1">Expected Impact</span>
                      <p className="text-xs text-success font-medium">{rec.impact}</p>
                    </div>
                  </div>

                  <div className="pt-2 flex space-x-2">
                    <Button onClick={() => onDismiss(rec.id)} variant="primary" size="sm" className="flex-1 shadow-glow-primary" aria-label={`Execute action for ${rec.title}`}>
                      Execute
                    </Button>
                    <Button onClick={() => onDismiss(rec.id)} variant="ghost" size="sm" className="px-3 text-text-secondary hover:text-text-main" aria-label={`Dismiss recommendation for ${rec.title}`}>
                      Dismiss
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
