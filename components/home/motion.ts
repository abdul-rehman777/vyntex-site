import type { Transition, Variants } from "framer-motion";

export const motionTokens = {
  duration: {
    micro: 0.16,
    control: 0.24,
    reveal: 0.55,
    sequence: 2.4,
  },
  // Canonical VYNTEX ease-out (mirrors `ease.smooth` in lib/motion.ts).
  ease: [0.22, 1, 0.36, 1] as const,
  spring: { type: "spring", stiffness: 180, damping: 24, mass: 0.8 } as Transition,
  stagger: 0.09,
};

export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: motionTokens.duration.reveal, ease: motionTokens.ease },
  },
};

export const staggerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: motionTokens.stagger } },
};
