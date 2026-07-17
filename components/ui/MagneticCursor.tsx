"use client";

import { useEffect, useRef } from "react";

/**
 * VYNTEX cursor accent + magnetic pull.
 *
 * Accessibility / brand rules honored:
 *  - Never hides the native cursor (this is an additive follower only).
 *  - Runs ONLY on fine pointers (desktop) and when reduced motion is NOT set.
 *  - Decorative: `aria-hidden`, no keyboard/AT impact, paused while tab hidden.
 *
 * Magnetic pull applies to any element carrying `data-magnetic` (e.g. primary
 * CTAs): the element eases toward the pointer when it is nearby, then springs
 * back via its CSS transition.
 */
export default function MagneticCursor() {
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;

    const ring = ringRef.current;
    if (!ring) return;

    const interactive =
      'a, button, [role="button"], input, textarea, select, summary, [data-cursor]';

    let px = window.innerWidth / 2;
    let py = window.innerHeight / 2;
    let rx = px;
    let ry = py;
    let hovering = false;
    let visible = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!visible) {
        visible = true;
        ring.style.opacity = "1";
      }
      const target = e.target instanceof Element ? e.target : null;
      hovering = target?.closest(interactive) != null;

      const magnets = document.querySelectorAll<HTMLElement>("[data-magnetic]");
      magnets.forEach((el) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = px - cx;
        const dy = py - cy;
        const radius = Math.max(r.width, r.height) * 0.9 + 40;
        if (Math.hypot(dx, dy) < radius) {
          el.style.transform = `translate(${dx * 0.22}px, ${dy * 0.28}px)`;
        } else if (el.style.transform) {
          el.style.transform = "";
        }
      });
    };

    const onLeave = () => {
      visible = false;
      ring.style.opacity = "0";
    };

    const tick = () => {
      rx += (px - rx) * 0.18;
      ry += (py - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%) scale(${hovering ? 1.8 : 1})`;
      ring.dataset.hover = hovering ? "true" : "false";
      raf = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerout", onLeave, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      document
        .querySelectorAll<HTMLElement>("[data-magnetic]")
        .forEach((el) => (el.style.transform = ""));
    };
  }, []);

  return <div ref={ringRef} className="vx-cursor" aria-hidden="true" />;
}
