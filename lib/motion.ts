"use client";

import { useReducedMotion } from "framer-motion";

/**
 * Common easings for VYNTEX motion language.
 */
export const ease = {
  // Canonical VYNTEX ease-out. Single source of truth shared by page
  // transitions (app/template.tsx) and section reveals so the whole live site
  // moves on one rhythm. Mirrors the homepage token in components/home/motion.ts.
  smooth: [0.22, 1, 0.36, 1],
  // Snappy but not bouncy (for UI elements)
  snappy: [0.17, 0.67, 0.83, 0.67],
  // Restrained spring-like feel using cubic-bezier
  springLike: [0.175, 0.885, 0.32, 1.275],
};

/**
 * Standard durations (in seconds).
 */
export const duration = {
  micro: 0.15,
  fast: 0.25,
  normal: 0.4,
  slow: 0.7,
  hero: 1.5,
};

/**
 * Reusable motion variants for standard section entrances.
 */
export const variants = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  },
  itemFadeUp: {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: duration.normal,
        ease: ease.smooth,
      },
    },
  },
  itemFadeIn: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: duration.normal,
        ease: ease.smooth,
      },
    },
  },
};

/**
 * A helper to dynamically strip heavy animations for users who prefer reduced motion.
 * Use this to wrap complex variants.
 */
export function useVyntexMotion() {
  const shouldReduceMotion = useReducedMotion();

  // If user prefers reduced motion, return a static variant that just sets opacity
  const getSafeVariant = (complexVariant: Record<string, unknown>) => {
    if (shouldReduceMotion) {
      return {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.001 } },
      };
    }
    return complexVariant;
  };

  return { shouldReduceMotion, getSafeVariant };
}
