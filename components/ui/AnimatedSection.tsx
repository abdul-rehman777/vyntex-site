"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

/**
 * Wraps content in a fade-up-on-scroll reveal that animates once. When the
 * visitor prefers reduced motion, it renders a plain element with no animation.
 * `delay` staggers sibling reveals; `as` sets the rendered element.
 */
interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "section" | "article";
}

// Canonical VYNTEX reveal — same curve/duration as the homepage section
// reveals (components/home/motion.ts) and page transitions (lib/motion.ts)
// so every entrance across the site shares one rhythm.
const variants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

export default function AnimatedSection({
  children,
  className,
  delay = 0,
  as = "div",
}: AnimatedSectionProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      variants={variants}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </MotionTag>
  );
}
