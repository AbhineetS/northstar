"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/utils/cn";
import { pulseStatus } from "@/utils/motion";

interface BadgeProps extends Omit<HTMLMotionProps<"div">, "children"> {
  variant?: "success" | "warning" | "danger" | "info" | "neutral" | "ai" | "outline";
  isLive?: boolean;
  children?: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "neutral", isLive = false, children, ...props }, ref) => {
    
    const variants = {
      success: "bg-success/5 text-success border-success/10",
      warning: "bg-warning/5 text-warning border-warning/10",
      danger: "bg-fifa-red/5 text-fifa-red border-fifa-red/10",
      info: "bg-info/5 text-info border-info/10",
      neutral: "bg-text-main/5 text-text-secondary border-border-subtle",
      ai: "bg-fifa-blue/5 text-fifa-blue border-fifa-blue/10",
      outline: "bg-transparent text-text-muted border-border-strong",
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-pill border-[0.5px] px-3 py-1 text-xs font-bold tracking-wide transition-colors",
          variants[variant],
          className
        )}
        {...props}
      >
        {isLive && (
          <motion.span 
            variants={pulseStatus}
            initial="active"
            animate="active"
            className={cn("mr-2 h-1.5 w-1.5 rounded-full shadow-glow-primary", {
              "bg-success": variant === "success",
              "bg-warning": variant === "warning",
              "bg-fifa-red": variant === "danger",
              "bg-info": variant === "info",
              "bg-text-secondary": variant === "neutral",
              "bg-fifa-blue": variant === "ai",
            })} 
          />
        )}
        {children}
      </motion.div>
    );
  }
);
Badge.displayName = "Badge";
