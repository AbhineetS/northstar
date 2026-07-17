import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto auto-rows-[250px]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface BentoGridItemProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  colSpan?: 1 | 2 | 3;
  rowSpan?: 1 | 2;
}

export const BentoGridItem = ({
  children,
  colSpan = 1,
  rowSpan = 1,
  className,
  ...props
}: BentoGridItemProps) => {
  const colSpans = {
    1: 'md:col-span-1',
    2: 'md:col-span-2',
    3: 'md:col-span-3',
  };

  const rowSpans = {
    1: 'row-span-1',
    2: 'row-span-2',
  };

  return (
    <motion.div
      className={cn(
        'relative rounded-[40px] overflow-hidden group bg-surface border border-border-subtle shadow-premium',
        colSpans[colSpan],
        rowSpans[rowSpan],
        className
      )}
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
};
