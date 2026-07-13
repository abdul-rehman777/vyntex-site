"use client";

import { useId, useState } from "react";
import { Plus, Minus } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export interface AccordionItem {
  q: string;
  a: string;
}

/**
 * Accessible accordion. Each header is a button that toggles a region:
 * aria-expanded reflects state, aria-controls links to the panel, and the
 * open/close icon does not rely on color alone. Multiple items may be open.
 */
export default function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const baseId = useId();
  const reduce = useReducedMotion();

  const toggle = (i: number) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div className="divide-y divide-[rgba(14,165,233,0.12)] overflow-hidden rounded-2xl border border-[rgba(14,165,233,0.14)] bg-vx-bg2">
      {items.map((item, i) => {
        const isOpen = open.has(i);
        const headingId = `${baseId}-h-${i}`;
        const panelId = `${baseId}-p-${i}`;
        return (
          <div key={i}>
            <h3>
              <button
                type="button"
                id={headingId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-vx-ink transition-colors hover:bg-vx-bg3"
              >
                <span className="font-medium">{item.q}</span>
                <span
                  aria-hidden
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[rgba(14,165,233,0.25)] text-vx-blue"
                >
                  {isOpen ? <Minus size={15} /> : <Plus size={15} />}
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={headingId}
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduce ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm leading-relaxed text-vx-muted">
                    {item.a}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
