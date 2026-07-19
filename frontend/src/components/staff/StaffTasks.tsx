"use client";

import * as React from "react";
import { Wrench, MapPin, CheckCircle2, Navigation, Droplets, Shield, Stethoscope } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { motion, AnimatePresence } from "framer-motion";

interface WorkOrder {
  id: string;
  type: "Maintenance" | "Cleaning" | "Security" | "Medical";
  title: string;
  location: string;
  priority: "Critical" | "High" | "Routine";
  status: "Pending" | "In Progress" | "Completed";
  timeReported: string;
}

// Mocks removed

const getTypeIcon = (type: string) => {
  switch(type) {
    case 'Maintenance': return <Wrench className="w-4 h-4 text-warning" />;
    case 'Cleaning': return <Droplets className="w-4 h-4 text-info" />;
    case 'Security': return <Shield className="w-4 h-4 text-fifa-blue" />;
    case 'Medical': return <Stethoscope className="w-4 h-4 text-danger" />;
    default: return <Wrench className="w-4 h-4" />;
  }
};

import { useTelemetryStore } from "@/store/useTelemetryStore";

export const StaffTasks = () => {
  const allTasks = useTelemetryStore(state => state.staffTasks);
  const orders = allTasks.filter(t => t.assigneeRole === "Staff") as unknown as WorkOrder[]; // Map StaffTask to WorkOrder structure
  const [filter, setFilter] = React.useState<"All" | "Pending" | "In Progress">("All");
  
  const completeTaskStore = useTelemetryStore(state => state.completeStaffTask);
  const acceptTaskStore = useTelemetryStore(state => state.acceptStaffTask);

  const activeOrders = orders.filter(o => o.status !== 'Completed');
  const completedOrders = orders.filter(o => o.status === 'Completed');

  const filteredOrders = activeOrders.filter(o => filter === "All" ? true : o.status === filter);

  const completeOrder = (id: string) => {
    if (completeTaskStore) completeTaskStore(id);
  };

  const startOrder = (id: string) => {
    if (acceptTaskStore) acceptTaskStore(id);
  };

  return (
    <div className="space-y-4 pb-32 overflow-y-auto h-full px-4 pt-6 no-scrollbar relative">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-text-main/5 rounded-xl border border-border-subtle shadow-inner-soft">
            <Wrench className="w-5 h-5 text-text-main" />
          </div>
          <div>
            <h2 className="text-xl font-display font-black text-text-main tracking-tight leading-none mb-1">Work Orders</h2>
            <p className="text-[10px] uppercase tracking-widest text-text-muted font-bold">Facility Ops Queue</p>
          </div>
        </div>
        <div className="text-right">
           <span className="text-xl font-display font-black text-text-main leading-none block">{activeOrders.length}</span>
           <span className="text-[10px] uppercase font-bold text-text-muted tracking-widest">Active</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-4 bg-surface p-1 rounded-xl border border-border-subtle">
        {["All", "Pending", "In Progress"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as "All" | "Pending" | "In Progress")}
            className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${
              filter === f ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:bg-neutral-100'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredOrders.map((order) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              key={order.id} 
              className={`bg-surface p-4 rounded-2xl border shadow-sm flex flex-col relative overflow-hidden ${
                order.priority === 'Critical' ? 'border-danger/30 shadow-[0_4px_12px_rgba(238,50,78,0.1)]' : 
                order.status === 'In Progress' ? 'border-warning/30 bg-warning/5' : 'border-border-subtle'
              }`}
            >
              {order.status === 'In Progress' && (
                 <div className="absolute top-0 left-0 w-1 h-full bg-warning" />
              )}
              {order.priority === 'Critical' && (
                 <div className="absolute top-0 left-0 w-1 h-full bg-danger" />
              )}

              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-surface-elevated rounded border border-border-subtle">
                     {getTypeIcon(order.type)}
                  </div>
                  <h4 className="font-bold text-sm text-text-main">{order.title}</h4>
                </div>
                <Badge variant={order.priority === 'Critical' ? 'danger' : order.priority === 'High' ? 'warning' : 'outline'}>
                  {order.priority}
                </Badge>
              </div>

              <div className="flex items-center justify-between mb-4 mt-2">
                 <div className="flex items-center text-xs text-text-secondary font-medium bg-background px-2 py-1 rounded-lg border border-border-subtle">
                   <MapPin className="w-3 h-3 mr-1 text-text-muted" />
                   {order.location}
                 </div>
                 <span className="text-[10px] font-bold text-text-muted">{order.timeReported}</span>
              </div>

              <div className="flex gap-2 mt-auto">
                {order.status === 'Pending' ? (
                  <button onClick={() => startOrder(order.id)} className="flex-1 py-2.5 bg-primary text-white font-bold text-xs rounded-xl hover:shadow-md transition-shadow flex items-center justify-center">
                    Accept Order
                  </button>
                ) : (
                  <button onClick={() => completeOrder(order.id)} className="flex-1 py-2.5 bg-success text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 hover:shadow-md transition-shadow">
                    <CheckCircle2 className="w-4 h-4" /> Mark Complete
                  </button>
                )}
                <button className="px-4 py-2.5 bg-surface-elevated text-text-main font-bold text-xs rounded-xl border border-border-subtle flex items-center justify-center">
                  <Navigation className="w-4 h-4 mr-1" /> Route
                </button>
              </div>
            </motion.div>
          ))}
          {filteredOrders.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-10 text-center flex flex-col items-center">
              <CheckCircle2 className="w-10 h-10 text-success opacity-50 mb-2" />
              <p className="text-sm font-bold text-text-main">No Orders</p>
              <p className="text-xs text-text-secondary">Queue is clear.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {completedOrders.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-bold text-sm text-text-main opacity-50">Completed History</h3>
            <span className="text-xs font-bold text-success">{completedOrders.length} Completed</span>
          </div>
          <div className="space-y-2 opacity-70">
            {completedOrders.map(order => (
              <div key={order.id} className="bg-surface p-3 rounded-xl border border-border-subtle flex flex-col relative overflow-hidden group">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                     <CheckCircle2 className="w-3 h-3 text-success" />
                     <h4 className="font-bold text-xs text-text-main line-through decoration-text-muted/50">{order.title}</h4>
                  </div>
                  <span className="text-[10px] text-text-muted font-bold">{order.type}</span>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-[10px] text-text-secondary ml-5">{order.location}</span>
                   <span className="text-[9px] text-text-muted uppercase tracking-wider">Resolved</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
