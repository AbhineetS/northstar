'use client';

import { motion } from "framer-motion";
import { Users, TrendingUp, AlertCircle, Activity } from "lucide-react";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { BentoGrid, BentoGridItem } from "@/components/ui/BentoGrid";
import { PageTransition } from "@/components/ui/PageTransition";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTelemetryStore } from "@/store/useTelemetryStore";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

const data = [
  { time: '14:00', density: 1200, predicted: 1250 },
  { time: '14:30', density: 2100, predicted: 2200 },
  { time: '15:00', density: 3800, predicted: 3900 },
  { time: '15:30', density: 5100, predicted: 5000 },
  { time: '16:00', density: 7200, predicted: 7500 }, // Current
  { time: '16:30', density: null, predicted: 9100 },
  { time: '17:00', density: null, predicted: 11200 },
];

export default function CrowdIntelPage() {
  const { totalAttendance, ingressRate } = useTelemetryStore();

  return (
    <PageTransition>
      <div className="p-10 h-full flex flex-col max-w-[1600px] mx-auto overflow-y-auto no-scrollbar w-full">
        
        <div className="mb-12 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          >
            <h1 className="text-display-sm font-display font-bold text-text-main tracking-tighter leading-none mb-4">
              Crowd <span className="text-text-muted">Intelligence</span>
            </h1>
            <p className="text-text-secondary text-lg font-light tracking-wide max-w-xl leading-relaxed">
              Predictive congestion modeling, historical flow trends, and real-time density mapping.
            </p>
          </motion.div>
        </div>

        <BentoGrid className="grid-cols-1 md:grid-cols-3 gap-6 mb-8 auto-rows-[280px]">
          {/* Total Attendance */}
          <BentoGridItem className="p-8 flex flex-col justify-between group bg-surface-elevated">
            <div className="p-3 bg-primary/5 rounded-2xl w-fit text-primary">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm uppercase tracking-wider font-bold text-text-muted mb-2">Total in Stadium</div>
              <div className="text-6xl font-display font-bold text-text-main tracking-tighter mb-2 group-hover:scale-105 origin-left transition-transform duration-500">
                <AnimatedNumber value={totalAttendance} />
              </div>
              <div className="text-sm font-medium text-success flex items-center">
                <Activity className="w-4 h-4 mr-1" />
                {(totalAttendance / 85000 * 100).toFixed(1)}% Capacity Reached
              </div>
            </div>
          </BentoGridItem>
          
          {/* Ingress Rate */}
          <BentoGridItem className="p-8 flex flex-col justify-between group bg-surface-elevated">
            <div className="p-3 bg-primary/5 rounded-2xl w-fit text-primary">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm uppercase tracking-wider font-bold text-text-muted mb-2">Ingress Rate</div>
              <div className="flex items-baseline gap-2 mb-2">
                <div className="text-6xl font-display font-bold text-text-main tracking-tighter group-hover:scale-105 origin-left transition-transform duration-500">
                  <AnimatedNumber value={ingressRate} />
                </div>
                <span className="text-xl text-text-muted font-medium">/ hr</span>
              </div>
              <div className="text-sm font-medium text-warning flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12% vs predicted model
              </div>
            </div>
          </BentoGridItem>

          {/* High Risk Zone */}
          <BentoGridItem className="p-8 flex flex-col justify-between group bg-danger/[0.03] border-danger/20">
            <div className="p-3 bg-danger/10 rounded-2xl w-fit text-danger">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm uppercase tracking-wider font-bold text-danger mb-2 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-danger"></span>
                </span>
                High Risk Zone Detected
              </div>
              <div className="text-4xl font-display font-bold text-danger tracking-tighter mb-2 leading-tight">
                Gate B, Sector 4
              </div>
              <div className="text-sm font-medium text-danger/70">
                Predicted crush hazard in 14 mins based on current flow vectors.
              </div>
            </div>
          </BentoGridItem>
        </BentoGrid>

        {/* Main Chart Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
          className="w-full"
        >
          <PremiumCard padding="xl" className="h-[500px] flex flex-col relative overflow-hidden group">
            {/* Subtle mesh background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-fifa-blue/[0.03] via-transparent to-transparent pointer-events-none" />
            
            <div className="flex justify-between items-end mb-8 relative z-10">
              <div>
                <h3 className="text-2xl font-display font-bold text-text-main">Ingress Velocity vs Prediction</h3>
                <p className="text-text-secondary mt-1">AI modeling compares actual flow against expected curves.</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#111111]"></div>
                  <span className="text-sm text-text-secondary font-medium">Actual Ingress</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#999999] border border-dashed border-[#999999] bg-opacity-20"></div>
                  <span className="text-sm text-text-secondary font-medium">AI Prediction</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 w-full relative z-10 -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorDensity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#111111" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#111111" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#999999" stopOpacity={0.05}/>
                      <stop offset="95%" stopColor="#999999" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="time" 
                    stroke="#999999" 
                    tick={{fill: '#6B6B6B', fontSize: 12, fontWeight: 500}} 
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="#999999" 
                    tick={{fill: '#6B6B6B', fontSize: 12, fontWeight: 500}}
                    tickLine={false}
                    axisLine={false}
                    dx={-10}
                  />
                  <CartesianGrid strokeDasharray="4 4" stroke="#111111" strokeOpacity={0.05} vertical={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255,255,255,0.9)', 
                      backdropFilter: 'blur(10px)',
                      borderColor: 'rgba(17,17,17,0.1)', 
                      borderRadius: '16px', 
                      color: '#111111',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
                    }}
                    itemStyle={{ color: '#111111', fontWeight: 600 }}
                    labelStyle={{ color: '#6B6B6B', marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="predicted" stroke="#999999" strokeWidth={2} strokeDasharray="6 6" fillOpacity={1} fill="url(#colorPredicted)" name="AI Prediction" />
                  <Area type="monotone" dataKey="density" stroke="#111111" strokeWidth={3} fillOpacity={1} fill="url(#colorDensity)" name="Actual Ingress" activeDot={{ r: 6, strokeWidth: 0, fill: '#111111' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </PremiumCard>
        </motion.div>
        
      </div>
    </PageTransition>
  );
}
