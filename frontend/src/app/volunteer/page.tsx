'use client';

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, ClipboardList, Languages, Map as MapIcon, ChevronLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { NotificationToaster } from "@/components/ui/NotificationToaster";
import { MagneticButton } from "@/components/ui/MagneticButton";

import { VolunteerHome } from "@/components/volunteer/VolunteerHome";
import { VolunteerTasks } from "@/components/volunteer/VolunteerTasks";
import { VolunteerCopilot } from "@/components/volunteer/VolunteerCopilot";
import { VolunteerMap } from "@/components/volunteer/VolunteerMap";
import { VolunteerEmergency } from "@/components/volunteer/VolunteerEmergency";

export default function VolunteerDashboard() {
  const [activeTab, setActiveTab] = React.useState<"home" | "tasks" | "copilot" | "map">("home");

  return (
    <div className="h-screen w-full bg-[#f0f0f0] text-primary relative overflow-hidden font-sans flex justify-center items-center">
      <NotificationToaster profile="Volunteer" />
      
      {/* Abstract background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[30%] right-[10%] w-[400px] h-[400px] bg-fifa-green/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] left-[20%] w-[500px] h-[500px] bg-warning/5 rounded-full blur-[120px]" />
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
            <span className="text-xs font-bold text-primary tracking-tight">Volunteer Hub</span>
          </div>
          <div className="w-10 flex justify-end">
            <MagneticButton variant="ghost" size="icon" className="w-10 h-10 rounded-2xl text-danger hover:bg-danger/10 hover:text-danger">
              <ShieldAlert className="w-5 h-5" strokeWidth={2} />
            </MagneticButton>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 relative overflow-hidden bg-background">
          <AnimatePresence mode="popLayout" initial={false}>
            {activeTab === "home" && (
              <motion.div key="home" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }} className="absolute inset-0 overflow-y-auto no-scrollbar">
                <VolunteerHome />
              </motion.div>
            )}
            {activeTab === "tasks" && (
              <motion.div key="tasks" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }} className="absolute inset-0 overflow-y-auto no-scrollbar">
                <VolunteerTasks />
              </motion.div>
            )}
            {activeTab === "copilot" && (
              <motion.div key="copilot" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }} className="absolute inset-0 overflow-y-auto no-scrollbar">
                <VolunteerCopilot />
              </motion.div>
            )}
            {activeTab === "map" && (
              <motion.div key="map" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }} className="absolute inset-0 overflow-y-auto no-scrollbar">
                <VolunteerMap />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Floating Emergency Mode Component */}
        <VolunteerEmergency />

        {/* Bottom Navigation - Floating island style */}
        <div className="absolute bottom-6 left-6 right-6 z-40 pb-safe">
          <nav className="bg-surface/80 backdrop-blur-3xl border border-white/40 shadow-premium rounded-[2rem] p-2 flex items-center justify-between">
            <NavButton icon={<Home />} label="Home" isActive={activeTab === "home"} onClick={() => setActiveTab("home")} />
            <NavButton icon={<ClipboardList />} label="Tasks" isActive={activeTab === "tasks"} onClick={() => setActiveTab("tasks")} />
            <div className="relative">
              <NavButton icon={<Languages />} label="Translate" isActive={activeTab === "copilot"} onClick={() => setActiveTab("copilot")} isCenter />
            </div>
            <NavButton icon={<MapIcon />} label="Map" isActive={activeTab === "map"} onClick={() => setActiveTab("map")} />
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
      className={`relative flex flex-col items-center justify-center w-16 transition-all duration-300 ease-apple outline-none
        ${isCenter ? 'h-14 bg-fifa-blue text-white rounded-[1.5rem] shadow-premium hover:scale-105' : 'h-14 rounded-2xl'}
        ${!isCenter && isActive ? 'text-primary' : !isCenter ? 'text-text-muted hover:text-text-secondary hover:bg-black/5' : ''}
      `}
    >
      <motion.div 
        animate={isActive && !isCenter ? { y: -2 } : { y: 0 }}
        className={`transition-colors [&>svg]:w-6 [&>svg]:h-6 ${isCenter ? '[&>svg]:w-7 [&>svg]:h-7' : ''}`}
      >
        {icon}
      </motion.div>
      {!isCenter && (
        <span className={`absolute bottom-1.5 text-[10px] font-bold tracking-wide transition-all duration-300
          ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
        `}>
          {label}
        </span>
      )}
      {!isCenter && isActive && (
        <motion.div layoutId="nav-indicator-vol" className="absolute -top-2 w-1 h-1 bg-primary rounded-full" />
      )}
    </button>
  );
};
