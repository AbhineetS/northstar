'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, filter: 'blur(10px)', y: 20, scale: 0.98 }}
        animate={{ opacity: 1, filter: 'blur(0px)', y: 0, scale: 1 }}
        exit={{ opacity: 0, filter: 'blur(10px)', y: -20, scale: 0.98 }}
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
        className="w-full h-full min-h-screen will-change-transform"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
