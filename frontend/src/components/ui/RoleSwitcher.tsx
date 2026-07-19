"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Home } from "lucide-react";

export function RoleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  // Only show when we are inside a role dashboard, not on the landing page
  const isDashboard = pathname !== "/";

  return (
    <AnimatePresence>
      {isDashboard && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/")}
          className="fixed top-6 left-6 z-[99999] flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full shadow-premium hover:bg-primary-hover transition-colors"
          aria-label="Back to Role Selection"
        >
          <Home className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
