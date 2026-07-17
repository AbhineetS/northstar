"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { aiService } from "@/services";
import { useService } from "@/hooks/useService";
import { DataBoundary } from "@/components/ui/DataBoundary";
import { useAppStore } from "@/store/useAppStore";
import { useTelemetryStore } from "@/store/useTelemetryStore";

export const StaffCopilot = () => {
  const fetchCommands = React.useCallback(() => {
    const appState = useAppStore.getState();
    const telemetry = useTelemetryStore.getState();
    return aiService.generateOpsRecommendations({ 
      role: 'Staff',
      weather: appState.weather.data,
      match: appState.match.data,
      location: appState.location,
      incidents: telemetry.incidents,
      transportHubs: telemetry.transportHubs
    });
  }, []);
  const aiState = useService(fetchCommands);
  
  interface AICommand { id: string; priority: string; title: string; context?: string; reason?: string; action: string; }
  const [commands, setCommands] = React.useState<AICommand[]>([]);

  React.useEffect(() => {
    if (aiState.data) {
      const timer = setTimeout(() => setCommands(aiState.data as AICommand[]), 0);
      return () => clearTimeout(timer);
    }
  }, [aiState.data]);

  const handleComplete = (id: string) => {
    setCommands(commands.filter(c => c.id !== id));
  };

  return (
    <div className="flex flex-col h-full pb-20 relative">
      <div className="px-4 py-6 flex items-center space-x-3 bg-surface-elevated/90 backdrop-blur-3xl border-b border-border-subtle z-10 sticky top-0">
        <div className="p-2 bg-ai/10 rounded-xl">
          <Sparkles className="w-5 h-5 text-ai" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-text-main tracking-tight">AI Copilot</h2>
          <p className="text-xs text-text-secondary font-medium">Operations Prioritization</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        <DataBoundary state={aiState}>
          {() => (
            commands.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-text-muted px-4">
                <Sparkles className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm font-medium">Operations are optimal. No urgent AI recommendations.</p>
              </div>
            ) : (
              commands.map((cmd, idx) => (
                <motion.div 
                  key={cmd.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`p-5 rounded-2xl border bg-surface flex flex-col relative overflow-hidden shadow-sm ${
                     cmd.priority === 'critical' ? 'border-danger/30' : 
                     cmd.priority === 'high' ? 'border-warning/30' : 
                     'border-ai/30'
                  }`}
                >
                   <div className={`absolute top-0 left-0 w-1 h-full ${
                     cmd.priority === 'critical' ? 'bg-danger' : 
                     cmd.priority === 'high' ? 'bg-warning' : 
                     'bg-ai'
                   }`} />
                   <div className="flex items-center space-x-2 mb-2">
                      <Sparkles className={`w-4 h-4 ${
                        cmd.priority === 'critical' ? 'text-danger' : 
                        cmd.priority === 'high' ? 'text-warning' : 
                        'text-ai'
                      }`} />
                      <h3 className="font-bold text-base text-text-main">{cmd.title}</h3>
                   </div>
                   
                   <p className="text-sm text-text-secondary mb-4 leading-relaxed font-medium">
                      <span className="font-bold text-text-main">Why:</span> {cmd.context || cmd.reason}
                   </p>
                   
                   <Button onClick={() => handleComplete(cmd.id)} variant="primary" className="w-full">
                      <Check className="w-4 h-4 mr-2" />
                      {cmd.action}
                   </Button>
                </motion.div>
              ))
            )
          )}
        </DataBoundary>
      </div>
    </div>
  );
};
