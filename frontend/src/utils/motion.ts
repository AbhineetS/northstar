import { Variants, Transition } from "framer-motion";

// Core Apple-like spring for fluid physics
export const spring: Transition = {
  type: "spring",
  damping: 20,
  stiffness: 100,
};

export const springFast: Transition = {
  type: "spring",
  damping: 25,
  stiffness: 200,
};

export const easing: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { duration: 0.3, ease: easing } 
  },
  exit: { 
    opacity: 0, 
    transition: { duration: 0.2, ease: easing } 
  }
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.4, ease: easing } 
  },
  exit: { 
    opacity: 0, 
    y: 10, 
    transition: { duration: 0.3, ease: easing } 
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

export const pulseStatus: Variants = {
  active: {
    opacity: [1, 0.6, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};
