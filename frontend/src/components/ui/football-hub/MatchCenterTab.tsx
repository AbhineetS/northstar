import React from 'react';
import { Activity, Sparkles, Trophy } from 'lucide-react';
import { DataBoundary } from '../DataBoundary';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { ILiveMatchStats } from '@/services/interfaces';
import { useService } from '@/hooks/useService';

interface MatchCenterTabProps {
  liveMatch: ReturnType<typeof useService<ILiveMatchStats>>;
}

export const MatchCenterTab: React.FC<MatchCenterTabProps> = ({ liveMatch }) => {
  return (
    <div className="space-y-6">
      <DataBoundary state={liveMatch}>
        {(match) => (
          <div className="space-y-6">
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

            <Card variant="glass" className="p-5">
              <h4 className="text-sm font-bold text-text-main mb-4 flex items-center"><Trophy className="w-4 h-4 mr-2 text-text-muted" /> Match Events</h4>
              {match.events.length === 0 ? (
                <p className="text-sm text-neutral-500">No major events yet.</p>
              ) : (
                <div className="space-y-4">
                  {match.events.slice().reverse().map((evt: { minute: number, player: string, type: string, detail: string }, idx: number) => (
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
  );
};
