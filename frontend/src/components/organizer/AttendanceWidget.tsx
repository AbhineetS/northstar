import React from 'react';
import { Users, TrendingUp } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { PremiumCard } from "@/components/ui/PremiumCard";

const MOCK_ATTENDANCE_DATA = [
  { time: '12:00', value: 12000 },
  { time: '13:00', value: 25000 },
  { time: '14:00', value: 45000 },
  { time: '15:00', value: 68000 },
  { time: '16:00', value: 81000 },
  { time: '17:00', value: 84500 },
];

export const AttendanceWidget: React.FC<{ totalAttendance: number }> = ({ totalAttendance }) => {
  return (
    <PremiumCard variant="glass" enableTilt className="h-full bg-surface-elevated/80 p-8 flex flex-col justify-between group overflow-hidden border-border-subtle shadow-elevation-high">
      <div className="flex justify-between items-start relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-surface rounded-2xl text-text-main group-hover:bg-primary group-hover:text-white transition-colors duration-500 border border-border-subtle group-hover:border-transparent">
            <Users className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold uppercase tracking-widest text-text-muted">Total Attendance</span>
        </div>
        <div className="flex items-center gap-1 text-success bg-success/10 px-3 py-1.5 rounded-full font-bold text-xs border border-success/20">
          <TrendingUp className="w-3 h-3" />
          <span>+12% vs expected</span>
        </div>
      </div>
      <div className="relative z-10 flex items-end justify-between">
        <div>
          <span className="text-[120px] font-display font-black leading-none tracking-tighter text-text-main">
            <AnimatedNumber value={totalAttendance} />
          </span>
        </div>
        <div className="w-[300px] h-[100px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_ATTENDANCE_DATA}>
              <defs>
                <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--text-main)" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="var(--text-main)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke="var(--text-main)" strokeWidth={3} fillOpacity={1} fill="url(#attGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </PremiumCard>
  );
};
