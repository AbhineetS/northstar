"use client";

import { useEffect } from "react";
import { AlertOctagon, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Pulse System Error:", error);
  }, [error]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-background p-6">
      <div className="max-w-md w-full bg-surface glass-panel p-10 rounded-[2.5rem] border border-border-subtle text-center shadow-premium relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-fifa-red/10 blur-[40px] rounded-full pointer-events-none" />
        
        <div className="relative w-20 h-20 bg-surface-elevated text-fifa-red rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner-soft border border-border-subtle">
          <AlertOctagon className="w-10 h-10" />
        </div>
        
        <h2 className="text-2xl font-display font-bold text-text-main tracking-tight mb-3">System Interruption</h2>
        <p className="text-text-secondary mb-10 leading-relaxed font-medium">
          The Northstar operating system encountered an unexpected disruption. Telemetry has been paused.
        </p>

        <Button 
          onClick={() => reset()}
          variant="primary" 
          className="w-full h-14 text-lg"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Reboot Interface
        </Button>
      </div>
    </div>
  );
}
