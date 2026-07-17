"use client";

import { Map, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-background p-6 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
        <Map className="w-[120vh] h-[120vh] text-text-main" />
      </div>

      <div className="relative z-10 max-w-lg w-full bg-surface glass-panel p-12 rounded-[3rem] border border-border-subtle text-center shadow-premium">
        <div className="text-8xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-text-main to-text-muted mb-6 tracking-tighter">
          404
        </div>
        
        <h2 className="text-3xl font-display font-bold text-text-main tracking-tight mb-4">Sector Not Found</h2>
        <p className="text-text-secondary mb-10 leading-relaxed text-lg font-medium">
          You&apos;ve navigated beyond the mapped perimeter. The requested coordinate does not exist in the current spatial index.
        </p>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
          <Link href="/" className="flex-1">
            <Button variant="primary" className="w-full h-14">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Return to Grid
            </Button>
          </Link>
          <Link href="/ops" className="flex-1">
            <Button variant="secondary" className="w-full h-14">
              Access Ops
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
