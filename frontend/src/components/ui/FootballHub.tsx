"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Activity, Sparkles, ChevronRight, Trophy } from "lucide-react";
import Image from "next/image";
import { useService } from "@/hooks/useService";
import { matchService } from "@/services";
import { DataBoundary } from "./DataBoundary";
import { Card } from "./Card";
import { Badge } from "./Badge";

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
  const [expandedTeam, setExpandedTeam] = React.useState<string | null>(null);

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
              {activeTab === "center" && (
                <div className="space-y-6">
                  <DataBoundary state={liveMatch}>
                    {(match) => (
                      <div className="space-y-6">
                        {/* Live Score Card */}
                        <Card variant="glass" className="p-6 border-fifa-blue/20">
                          <div className="flex items-center justify-between mb-4">
                            <Badge variant={match.status === "Live" ? "danger" : "outline"} className={match.status === "Live" ? "animate-pulse" : ""}>
                              {match.status} {match.minute > 0 ? `• ${match.minute}'` : ""}
                            </Badge>
                            <span className="text-xs font-bold text-text-muted uppercase flex items-center"><Activity className="w-3 h-3 mr-1" /> Live Telemetry</span>
                          </div>
                          
                          <div className="flex items-center justify-between mb-8 px-4">
                            <div className="text-center w-1/3">
                              <span className="text-5xl font-display font-black text-text-main block mb-2">{match.homeScore}</span>
                              <span className="text-sm font-bold text-text-secondary uppercase">HOME</span>
                            </div>
                            <div className="text-center w-1/3">
                              <span className="text-sm font-bold text-text-muted px-3 py-1 bg-surface rounded-full border border-border-subtle">VS</span>
                            </div>
                            <div className="text-center w-1/3">
                              <span className="text-5xl font-display font-black text-text-main block mb-2">{match.awayScore}</span>
                              <span className="text-sm font-bold text-text-secondary uppercase">AWAY</span>
                            </div>
                          </div>

                          {/* Possession Bar */}
                          <div className="mb-4">
                            <div className="flex justify-between text-xs font-bold text-text-secondary mb-2">
                              <span>{match.homePossession}%</span>
                              <span className="uppercase tracking-widest text-[10px]">Possession</span>
                              <span>{match.awayPossession}%</span>
                            </div>
                            <div className="h-2 w-full bg-neutral-200 rounded-full overflow-hidden flex">
                              <div className="h-full bg-fifa-blue" style={{ width: `${match.homePossession}%` }} />
                              <div className="h-full bg-fifa-red" style={{ width: `${match.awayPossession}%` }} />
                            </div>
                          </div>
                        </Card>

                        {/* AI Match Summary */}
                        <Card className="p-5 border border-ai/30 bg-gradient-to-br from-ai/5 to-transparent relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Sparkles className="w-16 h-16" />
                          </div>
                          <div className="flex items-center space-x-2 mb-3">
                            <Sparkles className="w-4 h-4 text-ai" />
                            <h4 className="font-bold text-text-main text-sm">AI Match Insight</h4>
                          </div>
                          <p className="text-sm text-text-secondary leading-relaxed">
                            The home team is dominating the midfield with 58% possession. However, the away side is executing dangerous counter-attacks on the left flank. Expect a tactical substitution soon.
                          </p>
                        </Card>

                        {/* Timeline */}
                        <Card variant="glass" className="p-5">
                          <h4 className="text-sm font-bold text-text-main mb-4 flex items-center"><Trophy className="w-4 h-4 mr-2 text-text-muted" /> Match Events</h4>
                          {match.events.length === 0 ? (
                            <p className="text-sm text-neutral-500">No major events yet.</p>
                          ) : (
                            <div className="space-y-4">
                              {match.events.slice().reverse().map((evt, idx) => (
                                <div key={idx} className="flex items-start space-x-3 text-sm">
                                  <span className="font-bold text-fifa-blue w-8 pt-1">{evt.minute}&apos;</span>
                                  <div className="flex-1 bg-surface rounded-xl p-3 border border-border-subtle hover:bg-neutral-50 transition-colors">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="font-bold text-text-main">{evt.player}</span>
                                      <span className="text-[10px] uppercase font-bold text-text-secondary px-2 py-0.5 bg-neutral-100 rounded-md">{evt.type}</span>
                                    </div>
                                    <div className="text-text-muted text-xs">{evt.detail}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </Card>
                      </div>
                    )}
                  </DataBoundary>
                </div>
              )}

              {activeTab === "teams" && (
                <div className="space-y-6">
                  <DataBoundary state={teams}>
                    {(teamList) => (
                      <>
                        {teamList.map((team) => (
                          <div key={team.id} className="space-y-2">
                            <div 
                              className="flex items-center space-x-3 pb-2 border-b border-border-subtle cursor-pointer hover:bg-neutral-50 p-2 rounded-lg transition-colors"
                              onClick={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)}
                            >
                              {team.logo?.startsWith('http') ? (
                                <Image src={team.logo} alt={team.name} width={40} height={40} className="object-contain" />
                              ) : (
                                <span className="text-3xl">{team.logo}</span>
                              )}
                              <div className="flex-1">
                                <h3 className="font-bold text-text-main text-lg">{team.name}</h3>
                                <span className="text-xs text-text-secondary font-medium">{team.formation} • Coach: {team.coach}</span>
                              </div>
                              <ChevronRight className={`w-5 h-5 text-neutral-400 transition-transform ${expandedTeam === team.id ? 'rotate-90' : ''}`} />
                            </div>
                            
                            {expandedTeam === team.id && (
                              <TeamSquadList teamId={team.id} />
                            )}
                          </div>
                        ))}
                      </>
                    )}
                  </DataBoundary>
                </div>
              )}

              {activeTab === "schedule" && (
                <div className="space-y-4">
                  <DataBoundary state={schedule}>
                    {(matches) => (
                      matches.map((m) => (
                        <Card key={m.id} className="p-4 flex items-center justify-between hover:border-fifa-blue transition-colors cursor-pointer">
                          <div className="flex-1">
                            <div className="text-xs text-neutral-500 mb-1 flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(m.date).toLocaleDateString()} • {m.venue}
                            </div>
                            <div className="font-bold text-neutral-900">
                              {m.homeTeam} vs {m.awayTeam}
                            </div>
                          </div>
                          <Badge variant={m.status === "Live" ? "danger" : m.status === "Completed" ? "outline" : "neutral"}>
                            {m.status}
                          </Badge>
                        </Card>
                      ))
                    )}
                  </DataBoundary>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const TeamSquadList = ({ teamId }: { teamId: string }) => {
  const squad = useService(() => matchService.getTeamSquad(teamId), [teamId]);
  return (
    <DataBoundary state={squad}>
      {(players) => (
        <div className="grid grid-cols-1 gap-3 mt-4 px-2">
          {players.map((player) => (
            <div key={player.id} className="bg-surface rounded-2xl p-3 flex items-center justify-between border border-border-subtle shadow-sm hover:border-fifa-blue transition-colors cursor-pointer group">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center font-display font-bold text-lg text-text-muted group-hover:text-fifa-blue transition-colors">
                  {player.number}
                </div>
                <div>
                  <h4 className="font-bold text-text-main text-sm">{player.name}</h4>
                  <span className="text-xs text-text-secondary">{player.position}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-text-main">{player.rating}</span>
                <span className="block text-[10px] uppercase text-text-muted font-bold tracking-wider">Rating</span>
              </div>
            </div>
          ))}
          {players.length === 0 && (
            <p className="text-sm text-neutral-500 py-4 text-center">Squad information not available.</p>
          )}
        </div>
      )}
    </DataBoundary>
  );
};
