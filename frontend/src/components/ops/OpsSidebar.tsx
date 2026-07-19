"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Activity, Settings } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { Badge } from "@/components/ui/Badge";

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  exact?: boolean;
}

interface OpsSidebarProps {
  currentPhase: string;
  pathname: string;
  navItems: NavItem[];
}

export const OpsSidebar = ({ currentPhase, pathname, navItems }: OpsSidebarProps) => {
  return (
    <motion.aside 
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", damping: 30, stiffness: 200, delay: 0.2 }}
      className="w-64 border-r border-border-subtle bg-surface-elevated/80 backdrop-blur-3xl flex flex-col z-20 shadow-premium"
    >
      <div className="p-6 border-b border-border-subtle">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 rounded-md bg-fifa-blue flex items-center justify-center shadow-premium">
            <Activity className="w-5 h-5 text-white animate-pulse" />
          </div>
          <h1 className="font-display font-bold text-lg tracking-tight text-text-main">NORTHSTAR</h1>
        </div>
        <Badge variant={currentPhase?.includes("EMERGENCY") ? "danger" : "success"} isLive className="text-xs">
          Ops Status: {currentPhase?.includes("EMERGENCY") ? "CRITICAL" : "Nominal"}
        </Badge>
      </div>

      <nav aria-label="Main Navigation" className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2.5 rounded-xl transition-all group relative outline-none",
                isActive ? "bg-fifa-blue/5 text-fifa-blue" : "text-text-secondary hover:bg-border-subtle hover:text-text-main"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="ops-sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1/2 w-1 bg-fifa-blue rounded-r-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div className={cn("mr-3", isActive ? "text-fifa-blue" : "text-text-muted group-hover:text-text-secondary")}>
                {React.isValidElement(item.icon) 
                  ? React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, { className: "w-5 h-5" })
                  : item.icon}
              </div>
              <span className="font-semibold text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border-subtle space-y-2">
        <button aria-label="System Configuration" className="flex items-center w-full px-3 py-2 rounded-xl text-text-secondary hover:bg-border-subtle hover:text-text-main transition-colors font-semibold">
          <Settings className="w-5 h-5 mr-3 text-text-muted" />
          <span className="text-sm">System Config</span>
        </button>
      </div>
    </motion.aside>
  );
};
