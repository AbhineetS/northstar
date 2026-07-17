'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState = ({ icon: Icon, title, description, action, className }: EmptyStateProps) => {
  return (
    <div className={cn('flex flex-col items-center justify-center p-12 text-center h-full min-h-[300px]', className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        className="relative mb-6"
      >
        <div className="absolute inset-0 bg-primary-glow rounded-full blur-xl scale-150" />
        <div className="relative bg-surface p-5 rounded-[2rem] border border-border-subtle shadow-premium">
          <Icon className="w-10 h-10 text-text-secondary" strokeWidth={1} />
        </div>
      </motion.div>
      
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
        className="text-2xl font-display font-medium text-text-main mb-2 tracking-tight"
      >
        {title}
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
        className="text-text-secondary max-w-sm mb-8"
      >
        {description}
      </motion.p>
      
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.32, 0.72, 0, 1] }}
        >
          {action}
        </motion.div>
      )}
    </div>
  );
};
