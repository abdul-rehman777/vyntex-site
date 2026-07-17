"use client";

import { useEffect } from "react";
import { MotionConfig } from "framer-motion";
import { motionTokens } from "@/components/home/motion";

const REVEAL_SELECTOR = [
  "main section",
  ".services-price-card",
  ".service-explorer-card",
  ".system-card",
  ".process-card",
  ".industry-panel",
  ".final-system-cta",
].join(",");

export default function SiteMotion({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("vx-motion-ready");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));

    if (reduced || !("IntersectionObserver" in window)) {
      targets.forEach((target) => target.dataset.motionVisible = "true");
      return () => root.classList.remove("vx-motion-ready");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).dataset.motionVisible = "true";
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    targets.forEach((target, index) => {
      target.style.setProperty("--vx-reveal-delay", `${Math.min(index % 4, 3) * 55}ms`);
      observer.observe(target);
    });

    const onPointerMove = (event: PointerEvent) => {
      root.style.setProperty("--vx-pointer-x", `${(event.clientX / window.innerWidth) * 100}%`);
      root.style.setProperty("--vx-pointer-y", `${(event.clientY / window.innerHeight) * 100}%`);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      root.classList.remove("vx-motion-ready");
    };
  }, []);

  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: motionTokens.duration.control, ease: motionTokens.ease }}
    >
      {children}
    </MotionConfig>
  );
}
