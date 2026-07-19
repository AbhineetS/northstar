import React from 'react';
import { Calendar } from 'lucide-react';
import { DataBoundary } from '../DataBoundary';
import { Card } from '../Card';
import { Badge } from '../Badge';

import { IScheduleItem } from '@/services/interfaces';
import { useService } from '@/hooks/useService';

interface ScheduleTabProps {
  schedule: ReturnType<typeof useService<IScheduleItem[]>>;
}

export const ScheduleTab: React.FC<ScheduleTabProps> = ({ schedule }) => {
  return (
    <div className="space-y-4">
      <DataBoundary state={schedule}>
        {(matches) => (
          matches.map((m: IScheduleItem) => (
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
  );
};
