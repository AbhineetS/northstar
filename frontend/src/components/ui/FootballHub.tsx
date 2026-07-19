"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useService } from "@/hooks/useService";
import { matchService } from "@/services";
import { MatchCenterTab } from "./football-hub/MatchCenterTab";
import { TeamsTab } from "./football-hub/TeamsTab";
import { ScheduleTab } from "./football-hub/ScheduleTab";

interface FootballHubProps {
  isOpen: boolean;
  onClose: () => void;
  activeMatchId: string;
}

export const FootballHub = ({ isOpen, onClose, activeMatchId }: FootballHubProps) => {
  const [activeTab, setActiveTab] = React.useState<"center" | "teams" | "schedule">("center");

  const schedule = useService(() => matchService.getTournamentSchedule(), []);
  const liveMatch = useService(() => matchService.getLiveMatch(activeMatchId), [activeMatchId]);
  const teams = useService(() => matchService.getTournamentTeams(), []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-900 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <h2 className="text-xl font-bold text-neutral-900 font-display">FIFA World Cup 2026™</h2>
              <button aria-label="Close" onClick={onClose} className="p-2 bg-neutral-50 rounded-full hover:bg-neutral-100 transition-colors">
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            {/* Navigation */}
            <div className="flex px-6 space-x-6 border-b border-neutral-100 overflow-x-auto no-scrollbar">
              <button 
                onClick={() => setActiveTab("center")}
                className={`py-4 font-medium text-sm transition-colors relative whitespace-nowrap ${activeTab === "center" ? "text-fifa-blue" : "text-neutral-500 hover:text-neutral-900"}`}
              >
                Match Center
                {activeTab === "center" && <motion.div layoutId="hub-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-fifa-blue" />}
              </button>
              <button 
                onClick={() => setActiveTab("teams")}
                className={`py-4 font-medium text-sm transition-colors relative whitespace-nowrap ${activeTab === "teams" ? "text-fifa-blue" : "text-neutral-500 hover:text-neutral-900"}`}
              >
                Teams & Squads
                {activeTab === "teams" && <motion.div layoutId="hub-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-fifa-blue" />}
              </button>
              <button 
                onClick={() => setActiveTab("schedule")}
                className={`py-4 font-medium text-sm transition-colors relative whitespace-nowrap ${activeTab === "schedule" ? "text-fifa-blue" : "text-neutral-500 hover:text-neutral-900"}`}
              >
                Tournament Schedule
                {activeTab === "schedule" && <motion.div layoutId="hub-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-fifa-blue" />}
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-neutral-50/50">
              {activeTab === "center" && <MatchCenterTab liveMatch={liveMatch} />}
              {activeTab === "teams" && <TeamsTab teams={teams} />}
              {activeTab === "schedule" && <ScheduleTab schedule={schedule} />}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
