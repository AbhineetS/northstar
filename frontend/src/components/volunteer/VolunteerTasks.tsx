'use client';

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, MapPin, Sparkles, Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface VolunteerTask {
  id: string;
  title: string;
  location: string;
  priority: 'Critical' | 'High' | 'Routine';
  status: 'Pending' | 'In Progress' | 'Completed';
  timeAssigned: string;
  aiSuggested?: boolean;
}

const MOCK_TASKS: VolunteerTask[] = [
  { id: 't1', title: 'Assist Fan Wheelchair Navigation', location: 'Gate A - Section 102', priority: 'High', status: 'Pending', timeAssigned: '2m ago', aiSuggested: true },
  { id: 't2', title: 'Spill Cleanup Assistance', location: 'Concourse East - Food Court', priority: 'Routine', status: 'Pending', timeAssigned: '15m ago' },
  { id: 't3', title: 'Crowd Control Support', location: 'Gate C Security Checkpoint', priority: 'Critical', status: 'In Progress', timeAssigned: '5m ago' },
  { id: 't4', title: 'Lost Child Protocol', location: 'Section 204', priority: 'Critical', status: 'Completed', timeAssigned: '45m ago' },
];

export const VolunteerTasks = () => {
  const [tasks, setTasks] = React.useState<VolunteerTask[]>(MOCK_TASKS);
  
  // Reorder tasks: Critical -> High -> Routine, and then by AI suggestion
  const sortedTasks = React.useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (a.status === 'Completed' && b.status !== 'Completed') return 1;
      if (b.status === 'Completed' && a.status !== 'Completed') return -1;
      
      const priorityWeight = { 'Critical': 3, 'High': 2, 'Routine': 1 };
      const weightA = priorityWeight[a.priority] + (a.aiSuggested ? 0.5 : 0);
      const weightB = priorityWeight[b.priority] + (b.aiSuggested ? 0.5 : 0);
      
      return weightB - weightA;
    });
  }, [tasks]);

  const activeTasks = sortedTasks.filter(t => t.status !== 'Completed');
  const completedTasks = sortedTasks.filter(t => t.status === 'Completed');

  const completeTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'Completed' } : t));
  };

  return (
    <div className="space-y-4 pb-32 overflow-y-auto h-full px-4 pt-6 no-scrollbar relative">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-info/10 rounded-xl border border-info/20 shadow-inner-soft">
            <ClipboardList className="w-5 h-5 text-info" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-main tracking-tight">Assigned Tasks</h2>
            <p className="text-xs text-text-muted font-medium">Live Mission Queue</p>
          </div>
        </div>
        <div className="text-center">
           <span className="text-xl font-display font-black text-text-main leading-none block">{activeTasks.length}</span>
           <span className="text-[10px] uppercase font-bold text-text-muted tracking-widest">Active</span>
        </div>
      </div>

      {/* AI Recommendation Banner */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
        <div className="bg-gradient-to-r from-ai/10 to-transparent p-4 rounded-2xl border border-ai/20 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-2 opacity-10">
             <Sparkles className="w-12 h-12 text-ai" />
           </div>
           <div className="flex items-center gap-2 mb-2">
             <Sparkles className="w-4 h-4 text-ai animate-pulse" />
             <span className="text-xs font-bold text-ai uppercase tracking-widest">AI Prioritization Active</span>
           </div>
           <p className="text-xs text-text-secondary font-medium">Your task list is being dynamically reordered based on stadium density and your current location.</p>
        </div>
      </motion.div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {activeTasks.map((task) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              key={task.id} 
              className={`bg-surface p-4 rounded-2xl border shadow-sm flex flex-col relative overflow-hidden group ${
                task.priority === 'Critical' ? 'border-danger/30 shadow-[0_4px_12px_rgba(238,50,78,0.1)]' : 
                task.priority === 'High' ? 'border-warning/30' : 'border-border-subtle'
              }`}
            >
              {task.aiSuggested && (
                <div className="absolute top-0 left-0 w-1 h-full bg-ai" />
              )}
              
              <div className="flex justify-between items-start mb-3">
                <div className="pr-4">
                  <h4 className="font-bold text-sm text-text-main mb-1">{task.title}</h4>
                  <div className="flex flex-wrap gap-2 items-center">
                    <Badge variant={
                      task.priority === 'Critical' ? 'danger' : 
                      task.priority === 'High' ? 'warning' : 'outline'
                    }>
                      {task.priority}
                    </Badge>
                    {task.aiSuggested && (
                      <span className="flex items-center text-[10px] text-ai font-bold bg-ai/10 px-1.5 py-0.5 rounded">
                        <Sparkles className="w-3 h-3 mr-1" /> AI Suggested
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[10px] font-bold text-text-muted flex items-center shrink-0">
                  <Clock className="w-3 h-3 mr-1" /> {task.timeAssigned}
                </span>
              </div>

              <div className="flex items-center text-xs text-text-secondary font-medium mb-4 bg-surface-elevated p-2 rounded-lg border border-border-subtle">
                <MapPin className="w-3 h-3 mr-1.5 text-text-main" />
                {task.location}
              </div>

              <div className="flex gap-2 mt-auto">
                {task.status === 'Pending' ? (
                  <button onClick={() => setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'In Progress' } : t))} className="flex-1 py-2 bg-primary text-white font-bold text-xs rounded-xl hover:shadow-md transition-shadow">
                    Accept Task
                  </button>
                ) : (
                  <button onClick={() => completeTask(task.id)} className="flex-1 py-2 bg-success text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 hover:shadow-md transition-shadow">
                    <CheckCircle2 className="w-4 h-4" /> Mark Complete
                  </button>
                )}
                <button className="px-4 py-2 bg-surface-elevated text-text-main font-bold text-xs rounded-xl border border-border-subtle">
                  Navigate
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {completedTasks.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-bold text-sm text-text-main text-opacity-50">Completed Today</h3>
            <span className="text-xs font-bold text-success">{completedTasks.length} Tasks</span>
          </div>
          <div className="space-y-2 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {completedTasks.map(task => (
              <div key={task.id} className="bg-surface p-3 rounded-xl border border-border-subtle flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-text-main line-through decoration-text-muted/50">{task.title}</h4>
                  <span className="text-[10px] text-text-muted">{task.location}</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-success" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
