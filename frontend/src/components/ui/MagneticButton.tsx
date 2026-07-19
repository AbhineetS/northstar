'use client';

import React, { useRef } from 'react';
import { motion, useSpring, HTMLMotionProps, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils'; // Assuming this exists for class merging

interface MagneticButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  children: React.ReactNode;
  strength?: number;
  variant?: 'primary' | 'secondary' | 'glass' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const MagneticButton = React.forwardRef<HTMLButtonElement, MagneticButtonProps>(
  ({ children, strength = 40, variant = 'primary', size = 'md', className, ...props }, ref) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const prefersReducedMotion = useReducedMotion();
    const effectiveStrength = prefersReducedMotion ? 0 : strength;

    // Sync refs
    React.useImperativeHandle(ref, () => buttonRef.current as HTMLButtonElement);

    const x = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 });
    const y = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      const node = buttonRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;

      x.set((distanceX / rect.width) * effectiveStrength);
      y.set((distanceY / rect.height) * effectiveStrength);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    const variants = {
      primary: 'bg-primary text-text-inverted shadow-premium hover:shadow-premium-hover',
      secondary: 'bg-surface-elevated text-primary border border-border-subtle shadow-sm hover:shadow-premium',
      glass: 'glass-panel text-primary hover:glass-panel-strong',
      ghost: 'bg-transparent text-primary hover:bg-primary-glow',
    };

    const sizes = {
      sm: 'px-6 py-2.5 text-sm rounded-full',
      md: 'px-8 py-3.5 text-base rounded-full',
      lg: 'px-10 py-4 text-lg rounded-full',
      icon: 'p-4 rounded-full',
    };

    return (
      <motion.button
        ref={buttonRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ x, y }}
        whileTap={{ scale: 0.96 }}
        transition={{
          type: "spring",
          stiffness: 250,
          damping: 25,
          mass: 0.5,
        }}
        className={cn(
          "relative flex items-center justify-center font-bold tracking-tight",
          "rounded-full transition-colors duration-700 ease-apple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
          "disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      </motion.button>
    );
  }
);

MagneticButton.displayName = 'MagneticButton';
