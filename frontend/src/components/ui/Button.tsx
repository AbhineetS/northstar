"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/utils/cn";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "ai" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const Button = ({
  className,
  variant = "primary",
  size = "md",
  isLoading,
  children,
  ...props
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center font-bold rounded-full transition-all duration-700 ease-apple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none tracking-tight";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-neutral-800 focus-visible:ring-primary shadow-premium hover:shadow-premium-hover hover:-translate-y-0.5",
    secondary: "bg-[#F4F4F6] text-text-main hover:bg-[#E5E5EA] focus-visible:ring-neutral-200",
    ghost: "bg-transparent text-text-secondary hover:text-text-main hover:bg-neutral-100",
    danger: "bg-fifa-red text-white hover:bg-fifa-red/90 focus-visible:ring-fifa-red shadow-premium hover:shadow-premium-hover",
    ai: "bg-gradient-to-r from-fifa-blue to-fifa-green text-white hover:opacity-90 focus-visible:ring-fifa-blue shadow-premium hover:shadow-premium-hover",
    outline: "bg-transparent border border-border-strong text-text-main hover:bg-[#F4F4F6] hover:border-transparent",
  };

  const sizes = {
    sm: "h-10 px-5 text-sm",
    md: "h-12 px-7 text-base",
    lg: "h-16 px-10 text-xl",
  };

  return (
    <motion.button
      whileHover={isLoading || props.disabled ? undefined : { scale: 1.02 }}
      whileTap={isLoading || props.disabled ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={isLoading || props.disabled}
      aria-disabled={isLoading || props.disabled}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </motion.button>
  );
};
