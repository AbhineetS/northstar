import React from 'react';
import { useService } from '@/hooks/useService';
import { matchService } from '@/services';
import { DataBoundary } from '../DataBoundary';

export const TeamSquadList: React.FC<{ teamId: string }> = ({ teamId }) => {
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
