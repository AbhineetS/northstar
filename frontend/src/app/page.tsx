'use client';

import * as React from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Users, Briefcase, ClipboardList, ShieldCheck, Map, Clock, Navigation } from "lucide-react";
import { ProfileLoader, PersonaDetails } from "@/components/ui/ProfileLoader";
import { PageTransition } from "@/components/ui/PageTransition";
import dynamic from "next/dynamic";
import { HeroView } from "@/components/landing/HeroView";
import { RolesView } from "@/components/landing/RolesView";

const RealisticPitch = dynamic(() => import("@/components/ui/RealisticPitch").then(m => m.RealisticPitch), { ssr: false });

const PERSONAS: PersonaDetails[] = [
  { id: "fan", title: "Fan Experience", description: "Your personal Matchday Companion.", icon: Users, href: "/fan", color: "bg-fifa-blue/10 text-fifa-blue", loadingSteps: ["Curating matchday experience...", "Analyzing optimal routes...", "Syncing digital twin..."], metric: 1200000, metricLabel: "Fans Connected" },
  { id: "organizer", title: "Control Room", description: "Operational intelligence and crowd heatmaps.", icon: Briefcase, href: "/organizer", color: "bg-fifa-red/10 text-fifa-red", loadingSteps: ["Initializing executive summary...", "Aggregating telemetry...", "Loading spatial models..."], metric: 12, metricLabel: "Active Incidents" },
  { id: "ops", title: "Field Operations", description: "Command center for ground ops and crowd control.", icon: ShieldCheck, href: "/ops", color: "bg-fifa-green/10 text-fifa-green", loadingSteps: ["Establishing secure connection...", "Mapping sector zones...", "Syncing incident logs..."], metric: 248, metricLabel: "Active Tasks" },
  { id: "staff", title: "Venue Staff", description: "Live work orders and maintenance routing.", icon: ClipboardList, href: "/staff", color: "bg-fifa-gold/10 text-fifa-gold", loadingSteps: ["Loading task matrix...", "Syncing communication nodes...", "Activating copilot..."], metric: 82, metricLabel: "Staff Online" }
];

const METRICS = [
  { label: "64 Matches", icon: ClipboardList },
  { label: "16 Host Cities", icon: Map },
  { label: "Real-Time AI", icon: Clock },
  { label: "Live Navigation", icon: Navigation }
];

export default function LandingPage() {
  const router = useRouter();
  const [view, setView] = React.useState<"hero" | "roles" | "loader">("hero");
  const [selectedPersona, setSelectedPersona] = React.useState<PersonaDetails | null>(null);

  const handlePersonaSelect = async (persona: PersonaDetails) => {
    setSelectedPersona(persona);
    // Bypass authentication entirely for seamless access
    setView("loader");
  };

  return (
    <PageTransition>
      <div className="relative min-h-screen w-full overflow-x-hidden flex flex-col font-sans bg-[#FCFCFA] text-primary">
        
        {/* Full Viewport 3D Cinematic Background - Muted for Clean Aesthetic */}
        <div className="absolute inset-0 opacity-[0.03] blur-sm pointer-events-none mix-blend-multiply z-0">
          <RealisticPitch />
        </div>

        <AnimatePresence mode="wait">
          {view === "hero" ? (
            <HeroView onStart={() => setView("roles")} metrics={METRICS} />
          ) : view === "roles" ? (
            <RolesView personas={PERSONAS} onBack={() => setView("hero")} onSelectPersona={handlePersonaSelect} />
          ) : (
            <ProfileLoader 
              key="profile-loader"
              persona={selectedPersona!} 
              onComplete={() => router.push(selectedPersona!.href)} 
            />
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  );
}
