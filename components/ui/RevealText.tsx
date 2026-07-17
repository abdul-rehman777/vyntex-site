"use client";

import { Fragment } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

/**
 * Per-word reveal (opacity + short upward rise), staggered left-to-right.
 * Molded to the VYNTEX canonical curve so it shares one rhythm with the section
 * reveals and page transitions.
 *
 * Accessibility:
 *  - The rendered element carries `aria-label={text}` and the animated word
 *    spans are `aria-hidden`, so assistive tech announces the clean string once
 *    (never word-by-word).
 *  - Under `prefers-reduced-motion` it renders plain static text — no spans,
 *    no motion.
 *
 * Content-safe: it only re-presents the exact string it is given; it never adds,
 * removes, or rewrites copy.
 */

type Tag = "h1" | "h2" | "h3" | "p" | "span";

interface RevealTextProps {
  text: string;
  as?: Tag;
  className?: string;
  /** Delay before the first word (seconds). */
  delay?: number;
  /** Per-word stagger (seconds). */
  stagger?: number;
  /** `inView` (default) plays when scrolled into view; `mount` plays immediately. */
  trigger?: "inView" | "mount";
}

const EASE = [0.22, 1, 0.36, 1] as const;

const wordVariants: Variants = {
  hidden: { opacity: 0, y: "0.5em" },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export default function RevealText({
  text,
  as = "span",
  className,
  delay = 0,
  stagger = 0.045,
  trigger = "inView",
}: RevealTextProps) {
  const reduce = useReducedMotion();
  const Tag = as;

  if (reduce) {
    return <Tag className={className}>{text}</Tag>;
  }

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { delayChildren: delay, staggerChildren: stagger } },
  };

  const MotionTag = motion[as];
  const words = text.split(" ");

  const orchestration =
    trigger === "mount"
      ? { initial: "hidden" as const, animate: "visible" as const }
      : {
          initial: "hidden" as const,
          whileInView: "visible" as const,
          viewport: { once: true, amount: 0.5 } as const,
        };

  return (
    <MotionTag
      className={className}
      variants={containerVariants}
      aria-label={text}
      {...orchestration}
    >
      {words.map((w, i) => (
        <Fragment key={`${w}-${i}`}>
          <motion.span
            className="inline-block will-change-transform"
            variants={wordVariants}
            aria-hidden="true"
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </MotionTag>
  );
}
