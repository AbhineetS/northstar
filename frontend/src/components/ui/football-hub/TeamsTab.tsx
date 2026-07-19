import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { DataBoundary } from '../DataBoundary';
import { TeamSquadList } from './TeamSquadList';

import { ITeamProfile } from '@/services/interfaces';
import { useService } from '@/hooks/useService';

interface TeamsTabProps {
  teams: ReturnType<typeof useService<ITeamProfile[]>>;
}

export const TeamsTab: React.FC<TeamsTabProps> = ({ teams }) => {
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <DataBoundary state={teams}>
        {(teamList) => (
          <>
            {teamList.map((team: ITeamProfile) => (
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
  );
};
