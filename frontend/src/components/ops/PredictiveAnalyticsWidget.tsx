'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { PremiumCard } from '@/components/ui/PremiumCard';

const FLOW_PREDICTION_DATA = [
  { time: 'T-120', actual: 500, predicted: 500 },
  { time: 'T-90', actual: 1200, predicted: 1100 },
  { time: 'T-60', actual: 3500, predicted: 3600 },
  { time: 'T-30', actual: null, predicted: 7800 },
  { time: 'Kickoff', actual: null, predicted: 8500 },
  { time: 'T+15', actual: null, predicted: 1200 },
];

const TRANSPORT_PREDICTION_DATA = [
  { time: 'T-120', train: 20, bus: 30, car: 50 },
  { time: 'T-90', train: 40, bus: 45, car: 60 },
  { time: 'T-60', train: 80, bus: 65, car: 85 },
  { time: 'T-30', train: 95, bus: 80, car: 90 },
  { time: 'Kickoff', train: 40, bus: 30, car: 45 },
];

export function PredictiveAnalyticsWidget() {
  return (
    <PremiumCard variant="glass" className="h-full flex flex-col p-6 bg-surface-elevated/80 backdrop-blur-3xl border-border-subtle shadow-elevation-high">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-surface rounded-lg border border-border-subtle shadow-sm">
            <BarChart3 className="w-5 h-5 text-fifa-green" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-main uppercase tracking-widest">Predictive Models</h3>
            <p className="text-xs text-text-muted font-medium">Powered by Gemini AI</p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-surface rounded-lg border border-border-subtle text-[10px] font-bold text-text-muted">98% CONFIDENCE</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-6 overflow-y-auto no-scrollbar">
        
        {/* Chart 1: Crowd Flow */}
        <div className="flex-1 min-h-[150px] bg-surface/50 rounded-xl border border-border-subtle p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-text-main">Expected Ingress Volume</span>
            <div className="flex items-center gap-3 text-[10px] font-bold text-text-muted">
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" /> Actual</div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-border-strong border border-dashed border-text-muted" /> Predicted</div>
            </div>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={FLOW_PREDICTION_DATA} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}
                  itemStyle={{ color: 'var(--text-main)' }}
                />
                <Line type="monotone" dataKey="predicted" stroke="var(--text-muted)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                <Line type="monotone" dataKey="actual" stroke="var(--primary)" strokeWidth={3} dot={{ fill: 'var(--primary)', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Transport Impact */}
        <div className="flex-1 min-h-[150px] bg-surface/50 rounded-xl border border-border-subtle p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-text-main">Transport Load Prediction</span>
            <div className="flex items-center gap-3 text-[10px] font-bold text-text-muted">
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-fifa-blue" /> Train</div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-fifa-red" /> Bus</div>
            </div>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TRANSPORT_PREDICTION_DATA} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="train" stackId="1" stroke="var(--fifa-blue)" fill="var(--fifa-blue)" fillOpacity={0.2} />
                <Area type="monotone" dataKey="bus" stackId="1" stroke="var(--fifa-red)" fill="var(--fifa-red)" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </PremiumCard>
  );
}
