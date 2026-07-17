'use client';

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Wrench, Sparkles, Map as MapIcon, Activity, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { NotificationToaster } from "@/components/ui/NotificationToaster";
import { MagneticButton } from "@/components/ui/MagneticButton";

import { StaffHome } from "@/components/staff/StaffHome";
import { StaffTasks } from "@/components/staff/StaffTasks";
import { StaffCopilot } from "@/components/staff/StaffCopilot";
import { StaffMap } from "@/components/staff/StaffMap";
import { StaffPerformance } from "@/components/staff/StaffPerformance";

export default function StaffDashboard() {
  const [activeTab, setActiveTab] = React.useState<"home" | "tasks" | "copilot" | "map" | "performance">("home");

  return (
    <div className="h-screen w-full bg-[#f0f0f0] text-primary relative overflow-hidden font-sans flex justify-center items-center">
      <NotificationToaster profile="Staff" />
      
      {/* Abstract background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-fifa-blue/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] right-[20%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      {/* Premium Device Container */}
      <div className="w-full h-full md:w-[440px] md:h-[900px] md:max-h-[95vh] bg-background md:rounded-[3rem] relative shadow-premium md:border-[8px] md:border-[#111111] overflow-hidden flex flex-col z-10 transition-all duration-500">
        
        {/* Hardware details (desktop only) */}
        <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#111111] rounded-b-3xl z-50"></div>
        <div className="hidden md:block absolute top-1/2 -left-[8px] -translate-y-1/2 w-[4px] h-24 bg-neutral-300 rounded-l-md z-0"></div>
        
        {/* Top Header - Linear Inspired */}
        <header className="px-8 pt-12 pb-4 flex items-center justify-between bg-background/90 backdrop-blur-2xl z-40 border-b border-border-subtle sticky top-0">
          <Link href="/">
            <MagneticButton variant="ghost" size="icon" className="w-10 h-10 -ml-2 rounded-2xl text-text-muted hover:text-primary">
              <ChevronLeft className="w-5 h-5" strokeWidth={2} />
            </MagneticButton>
          </Link>
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-text-muted mb-0.5">Role</span>
            <span className="text-xs font-bold text-primary tracking-tight">Facility Ops</span>
          </div>
          <div className="w-10" />
        </header>

        {/* Main Content Area */}
        <main className="flex-1 relative overflow-hidden bg-background">
          <AnimatePresence mode="popLayout" initial={false}>
            {activeTab === "home" && (
              <motion.div key="home" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }} className="absolute inset-0 overflow-y-auto no-scrollbar">
                <StaffHome />
              </motion.div>
            )}
            {activeTab === "tasks" && (
              <motion.div key="tasks" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }} className="absolute inset-0 overflow-y-auto no-scrollbar">
                <StaffTasks />
              </motion.div>
            )}
            {activeTab === "copilot" && (
              <motion.div key="copilot" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }} className="absolute inset-0 overflow-y-auto no-scrollbar">
                <StaffCopilot />
              </motion.div>
            )}
            {activeTab === "map" && (
              <motion.div key="map" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }} className="absolute inset-0 overflow-y-auto no-scrollbar">
                <StaffMap />
              </motion.div>
            )}
            {activeTab === "performance" && (
              <motion.div key="performance" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }} className="absolute inset-0 overflow-y-auto no-scrollbar">
                <StaffPerformance />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Bottom Navigation - Floating island style */}
        <div className="absolute bottom-6 left-6 right-6 z-40 pb-safe">
          <nav className="bg-surface/80 backdrop-blur-3xl border border-white/40 shadow-premium rounded-[2rem] p-2 flex items-center justify-between">
            <NavButton icon={<Home />} label="Home" isActive={activeTab === "home"} onClick={() => setActiveTab("home")} />
            <NavButton icon={<Wrench />} label="Tasks" isActive={activeTab === "tasks"} onClick={() => setActiveTab("tasks")} />
            <div className="relative">
              <NavButton icon={<Sparkles />} label="Copilot" isActive={activeTab === "copilot"} onClick={() => setActiveTab("copilot")} isCenter />
            </div>
            <NavButton icon={<MapIcon />} label="Map" isActive={activeTab === "map"} onClick={() => setActiveTab("map")} />
            <NavButton icon={<Activity />} label="Perf" isActive={activeTab === "performance"} onClick={() => setActiveTab("performance")} />
          </nav>
        </div>

        {/* Bottom bezel (desktop only) */}
        <div className="hidden md:block absolute bottom-1 left-1/2 -translate-x-1/2 w-40 h-1.5 bg-border-strong rounded-full z-50"></div>
      </div>
    </div>
  );
}

const NavButton = ({ icon, label, isActive, onClick, isCenter }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void, isCenter?: boolean }) => {
  return (
    <button 
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center w-14 transition-all duration-300 ease-apple outline-none
        ${isCenter ? 'h-14 bg-primary text-white rounded-[1.5rem] shadow-premium hover:scale-105' : 'h-14 rounded-2xl'}
        ${!isCenter && isActive ? 'text-primary' : !isCenter ? 'text-text-muted hover:text-text-secondary hover:bg-black/5' : ''}
      `}
    >
      <motion.div 
        animate={isActive && !isCenter ? { y: -2 } : { y: 0 }}
        className={`transition-colors [&>svg]:w-5 [&>svg]:h-5 ${isCenter ? '[&>svg]:w-6 [&>svg]:h-6' : ''}`}
      >
        {icon}
      </motion.div>
      {!isCenter && (
        <span className={`absolute bottom-1.5 text-[9px] font-bold tracking-wide transition-all duration-300
          ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
        `}>
          {label}
        </span>
      )}
      {!isCenter && isActive && (
        <motion.div layoutId="nav-indicator" className="absolute -top-2 w-1 h-1 bg-primary rounded-full" />
      )}
    </button>
  );
};
