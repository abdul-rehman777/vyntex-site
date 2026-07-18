"use client";

import { useEffect, useRef } from "react";

/**
 * Site-wide spatial atmosphere using only VYNTEX brand colors.
 * Decorative only: content remains semantic HTML and fully usable without it.
 */
export default function SiteAtmosphere() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");
    const desktop = window.matchMedia("(min-width: 1024px)");
    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    if (
      media.matches ||
      !finePointer.matches ||
      !desktop.matches ||
      nav.connection?.saveData === true ||
      (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4)
    ) return;

    let frame = 0;
    const onPointerMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;
        root.style.setProperty("--scene-x", x.toFixed(3));
        root.style.setProperty("--scene-y", y.toFixed(3));
      });
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <div ref={rootRef} className="site-atmosphere" aria-hidden="true">
      <div className="site-atmosphere__depth">
        <div className="site-atmosphere__grid site-atmosphere__grid--far" />
        <div className="site-atmosphere__grid site-atmosphere__grid--near" />
        <div className="site-atmosphere__halo site-atmosphere__halo--one" />
        <div className="site-atmosphere__halo site-atmosphere__halo--two" />
        <div className="site-atmosphere__beam site-atmosphere__beam--one" />
        <div className="site-atmosphere__beam site-atmosphere__beam--two" />
        <svg className="site-atmosphere__network" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="vx-network-line" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#0ea5e9" stopOpacity="0" />
              <stop offset="0.48" stopColor="#22d3ee" stopOpacity="0.34" />
              <stop offset="1" stopColor="#38bdf8" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="vx-network-node">
              <stop offset="0" stopColor="#e8eaff" stopOpacity="0.9" />
              <stop offset="0.3" stopColor="#22d3ee" stopOpacity="0.78" />
              <stop offset="1" stopColor="#0ea5e9" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g fill="none" stroke="url(#vx-network-line)" strokeWidth="1.25">
            <path className="site-atmosphere__path site-atmosphere__path--a" d="M-80 640 C260 440 430 720 760 470 S1260 180 1690 330" />
            <path className="site-atmosphere__path site-atmosphere__path--b" d="M40 220 C390 360 480 120 810 310 S1250 680 1640 500" />
            <path className="site-atmosphere__path site-atmosphere__path--c" d="M250 940 C470 650 700 690 920 480 S1260 300 1510 -40" />
          </g>
          <g>
            <circle className="site-atmosphere__node site-atmosphere__node--a" cx="410" cy="500" r="18" fill="url(#vx-network-node)" />
            <circle className="site-atmosphere__node site-atmosphere__node--b" cx="830" cy="315" r="15" fill="url(#vx-network-node)" />
            <circle className="site-atmosphere__node site-atmosphere__node--c" cx="1210" cy="520" r="20" fill="url(#vx-network-node)" />
          </g>
        </svg>
      </div>
      <div className="site-atmosphere__vignette" />
    </div>
  );
}
