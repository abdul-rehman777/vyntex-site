"use client";

import { useEffect, useRef } from "react";

export default function MagneticCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("vx-cursor-enabled");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = 0;

    const render = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      raf = requestAnimationFrame(render);
    };

    const onMove = (event: PointerEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      dot.dataset.visible = "true";
      ring.dataset.visible = "true";
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      const interactive = target?.closest("a,button,input,textarea,select,[role='button'],[role='tab'],[data-magnetic]");
      ring.dataset.active = interactive ? "true" : "false";
    };

    const onLeave = () => {
      dot.dataset.visible = "false";
      ring.dataset.visible = "false";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("vx-cursor-enabled");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="vx-cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="vx-cursor-dot" aria-hidden="true" />
    </>
  );
}
