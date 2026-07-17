'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TiltCard } from '@/components/ui/TiltCard';

interface PremiumCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  variant?: 'solid' | 'glass' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hoverEffect?: 'none' | 'lift' | 'glow';
  enableTilt?: boolean;
}

export const PremiumCard = React.forwardRef<HTMLDivElement, PremiumCardProps>(
  ({ children, variant = 'solid', padding = 'lg', hoverEffect = 'none', enableTilt = false, className, ...props }, ref) => {
    
    const variants = {
      solid: 'bg-surface border border-border-subtle shadow-premium',
      glass: 'bg-surface-glass backdrop-blur-3xl border border-white/60 shadow-glass',
      flat: 'bg-surface-elevated border border-transparent transition-colors hover:border-border-subtle',
    };

    const paddings = {
      none: '',
      sm: 'p-6',
      md: 'p-8',
      lg: 'p-10',
      xl: 'p-14',
    };

    const hoverEffects = {
      none: '',
      lift: 'transition-all duration-700 ease-apple hover:-translate-y-1.5 hover:shadow-premium-hover',
      glow: 'transition-all duration-700 ease-apple hover:shadow-[0_0_60px_rgba(17,17,17,0.06)]',
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          'rounded-[24px] overflow-hidden',
          variants[variant],
          paddings[padding],
          hoverEffects[hoverEffect],
          className
        )}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        {...props}
      >
        {enableTilt ? (
          <TiltCard className="w-full h-full" intensity={10}>
            {children}
          </TiltCard>
        ) : (
          children
        )}
      </motion.div>
    );
  }
);

PremiumCard.displayName = 'PremiumCard';
