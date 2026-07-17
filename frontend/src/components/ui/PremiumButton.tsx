'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface PremiumButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  showArrow?: boolean;
}

export const PremiumButton = React.forwardRef<HTMLButtonElement, PremiumButtonProps>(
  ({ children, className, variant = 'primary', showArrow = true, ...props }, ref) => {
    
    const isPrimary = variant === 'primary';

    return (
      <motion.button
        ref={ref}
        whileHover="hover"
        initial="rest"
        variants={{
          rest: { 
            y: 0, 
            backgroundColor: isPrimary ? '#000000' : 'rgba(255,255,255,0.5)',
            boxShadow: isPrimary ? '0 4px 12px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.05)',
            color: isPrimary ? '#ffffff' : '#000000'
          },
          hover: { 
            y: -2, 
            backgroundColor: isPrimary ? '#1a1a1a' : 'rgba(255,255,255,0.8)', 
            boxShadow: isPrimary ? '0 12px 24px rgba(0,0,0,0.15)' : '0 8px 16px rgba(0,0,0,0.08)'
          }
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }} // Strict easeOut, absolutely no bounce
        className={cn(
          "relative flex items-center justify-center gap-3 px-8 h-14 rounded-full font-medium text-[15px] overflow-hidden backdrop-blur-sm border",
          isPrimary ? "border-black" : "border-black/10",
          className
        )}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        {showArrow && (
          <motion.span
            variants={{
              rest: { x: 0 },
              hover: { x: 8 }
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative z-10 flex items-center justify-center"
          >
            <ArrowRight className="w-4 h-4 stroke-[2px]" />
          </motion.span>
        )}
      </motion.button>
    );
  }
);

PremiumButton.displayName = 'PremiumButton';
