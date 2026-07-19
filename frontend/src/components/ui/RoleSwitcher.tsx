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
          onClick={() => router.push("/")}
          className="fixed top-6 left-6 z-[99999] flex items-center justify-center gap-2 px-6 h-12 bg-primary text-white font-bold rounded-full shadow-premium hover:bg-primary-hover hover:scale-105 transition-all"
          aria-label="Back to Main Menu"
        >
          <Home className="w-5 h-5" />
          <span>Back to Main Menu</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
