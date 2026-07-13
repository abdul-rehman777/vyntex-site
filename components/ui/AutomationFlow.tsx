"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Understandable, code-free automation visual: a sequence of labeled nodes
 * connected by lines. When it scrolls into view, a highlight advances from one
 * node to the next (and loops gently), making the flow easy to read.
 *
 * Not connected to any live system — purely illustrative.
 */
export interface FlowStep {
  id: string;
  label: string;
  icon: ReactNode;
}

interface AutomationFlowProps {
  steps: FlowStep[];
  /** "horizontal" wraps on small screens; "vertical" always stacks. */
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export default function AutomationFlow({
  steps,
  orientation = "horizontal",
  className,
}: AutomationFlowProps) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduce || !inView) {
      setActive(steps.length - 1);
      return;
    }
    setActive(0);
    const timer = window.setInterval(() => {
      setActive((prev) => (prev + 1) % (steps.length + 1));
    }, 900);
    return () => window.clearInterval(timer);
  }, [inView, reduce, steps.length]);

  const isVertical = orientation === "vertical";

  return (
    <ul
      ref={ref}
      className={[
        "flex gap-2",
        isVertical ? "flex-col" : "flex-col sm:flex-row sm:flex-wrap sm:items-stretch",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Automation workflow steps"
    >
      {steps.map((step, i) => {
        const reached = i <= active;
        return (
          <li
            key={step.id}
            className={[
              "flex items-center gap-2",
              isVertical ? "flex-row" : "sm:flex-1",
            ].join(" ")}
          >
            <motion.div
              animate={
                reduce
                  ? undefined
                  : { opacity: reached ? 1 : 0.5, scale: reached ? 1 : 0.98 }
              }
              transition={{ duration: 0.3 }}
              className={[
                "flex w-full items-center gap-3 rounded-xl border p-3 transition-colors duration-300",
                reached
                  ? "border-vx-blue/60 bg-vx-bg3 shadow-vx-glow-sm"
                  : "border-[rgba(14,165,233,0.12)] bg-vx-bg2",
              ].join(" ")}
            >
              <span
                className={[
                  "grid h-9 w-9 shrink-0 place-items-center rounded-lg transition-colors duration-300",
                  reached ? "bg-gradient-to-br from-vx-blue to-vx-cyan text-vx-bg" : "bg-vx-bg3 text-vx-muted",
                ].join(" ")}
                aria-hidden
              >
                {step.icon}
              </span>
              <span className="text-sm font-medium text-vx-ink">{step.label}</span>
            </motion.div>

            {i < steps.length - 1 ? (
              <span
                aria-hidden
                className={[
                  "shrink-0 text-vx-silver-dim",
                  isVertical ? "hidden" : "hidden sm:block",
                ].join(" ")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
