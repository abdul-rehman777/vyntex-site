"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Small frosted "terminal" that types through a list of phrases and loops.
 * Purely ambient/illustrative. With reduced motion, it shows the first phrase
 * statically (no typing, no loop).
 */
interface TerminalDemoProps {
  phrases: string[];
  className?: string;
}

export default function TerminalDemo({ phrases, className }: TerminalDemoProps) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(reduce ? (phrases[0] ?? "") : "");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduce || phrases.length === 0) return;
    const current = phrases[index] ?? "";
    const atFull = text === current;
    const atEmpty = text === "";

    let delay = deleting ? 35 : 55;
    if (!deleting && atFull) delay = 1300;
    if (deleting && atEmpty) delay = 250;

    const timer = window.setTimeout(() => {
      if (!deleting && atFull) {
        setDeleting(true);
      } else if (deleting && atEmpty) {
        setDeleting(false);
        setIndex((prev) => (prev + 1) % phrases.length);
      } else {
        const next = deleting
          ? current.slice(0, text.length - 1)
          : current.slice(0, text.length + 1);
        setText(next);
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [text, deleting, index, phrases, reduce]);

  return (
    <div
      className={[
        "inline-flex items-center gap-2 rounded-xl border border-[rgba(14,165,233,0.2)] bg-vx-bg2/70 px-4 py-2.5 backdrop-blur",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="status"
      aria-live="off"
    >
      <span className="font-mono text-sm text-vx-cyan" aria-hidden>
        &gt;
      </span>
      <span className="font-mono text-sm text-vx-silver">{text || "\u00A0"}</span>
      {!reduce ? (
        <span
          aria-hidden
          className="inline-block h-4 w-[2px] animate-pulse bg-vx-cyan"
        />
      ) : null}
    </div>
  );
}
