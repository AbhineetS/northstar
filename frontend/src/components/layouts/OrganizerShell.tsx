"use client";

import * as React from "react";
import { ShieldAlert, Activity, Users, Video, Bell } from "lucide-react";
import { cn } from "@/utils/cn";
import { Badge } from "@/components/ui/Badge";

interface OrganizerShellProps {
  children: React.ReactNode;
  activeRoute?: "overview" | "crowd" | "security" | "comms";
}

export const OrganizerShell = ({ children, activeRoute = "overview" }: OrganizerShellProps) => {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-text-main">
      {/* Sidebar - Desktop First */}
      <aside className="hidden w-64 flex-col border-r border-border-subtle bg-surface-elevated/50 md:flex">
        <div className="flex h-16 items-center px-6 border-b border-border-subtle">
          <span className="font-display text-lg font-bold tracking-tight text-text-main">
            PULSE <span className="text-primary ml-1">OS</span>
          </span>
          <Badge variant="ai" className="ml-auto">CMD</Badge>
        </div>
        
        <nav aria-label="Main Navigation" className="flex-1 space-y-2 p-4">
          <SidebarItem icon={<Activity />} label="Global Overview" isActive={activeRoute === "overview"} />
          <SidebarItem icon={<Users />} label="Crowd Intel" isActive={activeRoute === "crowd"} />
          <SidebarItem icon={<ShieldAlert />} label="Security" isActive={activeRoute === "security"} alertCount={2} />
          <SidebarItem icon={<Video />} label="Surveillance" />
        </nav>

        <div className="p-4 border-t border-border-subtle">
          <div className="flex items-center space-x-3 rounded-lg bg-surface p-3">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-caption text-text-secondary">System Nominal</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-border-subtle bg-surface px-6">
          <h1 className="font-display text-heading-sm font-semibold capitalize">
            {activeRoute.replace("-", " ")}
          </h1>
          
          <div className="flex items-center space-x-4">
            <button aria-label="Notifications" className="relative rounded-full p-2 text-text-muted hover:bg-surface hover:text-text-main transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-danger ring-2 ring-surface" />
            </button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-ai" />
          </div>
        </header>

        <main id="main-content" className="flex-1 overflow-y-auto p-6 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-surface-elevated/20 via-background to-background">
          {children}
        </main>
      </div>
    </div>
  );
};

const SidebarItem = ({ 
  icon, 
  label, 
  isActive,
  alertCount 
}: { 
  icon: React.ReactNode; 
  label: string; 
  isActive?: boolean;
  alertCount?: number;
}) => {
  return (
    <button
      className={cn(
        "relative flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-body-sm font-medium transition-colors focus:outline-none",
        isActive 
          ? "bg-white text-text-main border border-border-subtle shadow-sm" 
          : "text-text-secondary hover:bg-white/50 hover:text-text-main"
      )}
    >
      <div className="flex items-center space-x-3">
        <span className={cn(isActive ? "text-primary" : "text-text-muted")}>{icon}</span>
        <span>{label}</span>
      </div>
      
      {alertCount && (
        <span className="flex h-5 items-center justify-center rounded-full bg-danger px-2 text-caption font-bold text-white">
          {alertCount}
        </span>
      )}
    </button>
  );
};
