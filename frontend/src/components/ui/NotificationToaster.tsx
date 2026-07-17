"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Info, AlertTriangle, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useNotificationStore } from "@/store/useNotificationStore";
import { notificationService } from "@/services";

interface NotificationToasterProps {
  profile: "Fan" | "Organizer" | "Volunteer" | "Staff" | "All";
}

export const NotificationToaster = ({ profile }: NotificationToasterProps) => {
  const { notifications, removeNotification } = useNotificationStore();

  useEffect(() => {
    // Subscribe to incoming notifications for this specific profile
    const unsubscribe = notificationService.subscribe(profile, (notif) => {
      // Auto-dismiss after 10 seconds
      setTimeout(() => {
        removeNotification(notif.id);
      }, 10000);
    });

    return () => unsubscribe();
  }, [profile, removeNotification]);

  // Filter notifications relevant to this profile (in case state is shared across multiple mounted toasters)
  const activeNotifications = notifications.filter(n => n.targetProfile === profile || n.targetProfile === "All");

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center space-y-3 pointer-events-none w-full max-w-md px-4">
      <AnimatePresence>
        {activeNotifications.map((notif) => {
          
          let Icon = Info;
          let bgColor = "bg-white";
          let iconColor = "text-fifa-blue";
          let borderColor = "border-neutral-100";

          switch (notif.type) {
            case "emergency":
              Icon = ShieldAlert;
              bgColor = "bg-fifa-red/5";
              iconColor = "text-fifa-red";
              borderColor = "border-fifa-red/20";
              break;
            case "warning":
              Icon = AlertTriangle;
              bgColor = "bg-fifa-burgundy/5";
              iconColor = "text-fifa-burgundy";
              borderColor = "border-fifa-burgundy/20";
              break;
            case "success":
              Icon = CheckCircle2;
              iconColor = "text-fifa-green";
              break;
            default:
              break;
          }

          return (
            <motion.div
              key={notif.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } }}
              className={`w-full ${bgColor} border ${borderColor} shadow-lg rounded-2xl p-4 pointer-events-auto backdrop-blur-md flex items-start space-x-3`}
            >
              <div className={`mt-0.5 ${iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-neutral-900 text-sm mb-1">{notif.title}</h4>
                <p className="text-sm text-neutral-600 leading-snug">{notif.message}</p>
                
                {notif.actionLabel && (
                  <button className={`mt-3 text-sm font-bold ${iconColor} hover:opacity-80 transition-opacity`}>
                    {notif.actionLabel}
                  </button>
                )}
              </div>
              <button 
                aria-label="Dismiss Notification"
                onClick={() => removeNotification(notif.id)}
                className="ml-4 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
