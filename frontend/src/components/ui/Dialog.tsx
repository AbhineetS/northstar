"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";
import { fadeIn, slideUp } from "@/utils/motion";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Dialog = ({ isOpen, onClose, title, children, className }: DialogProps) => {
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Basic focus management: focus the dialog container so screen readers announce it
      // and keyboard navigation starts from inside.
      setTimeout(() => dialogRef.current?.focus(), 50);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              variants={slideUp}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? titleId : undefined}
              tabIndex={-1}
              ref={dialogRef}
              className={cn(
                "relative w-full max-w-lg overflow-hidden rounded-xl border border-border-strong bg-surface-elevated p-6 shadow-elevation pointer-events-auto focus:outline-none",
                className
              )}
            >
              <div className="flex items-center justify-between mb-4">
                {title && (
                  <h2 id={titleId} className="text-heading-sm font-display font-semibold tracking-tight">
                    {title}
                  </h2>
                )}
                <button
                  aria-label="Close Dialog"
                  onClick={onClose}
                  className="rounded-full p-2 text-text-muted hover:bg-surface hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="text-body-sm text-text-secondary">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
