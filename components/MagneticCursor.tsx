"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE_SELECTOR =
  "a,button,input,textarea,select,[role='button'],[role='tab'],[data-magnetic]";

export default function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!finePointer.matches || reducedMotion.matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    let frame = 0;
    let x = -100;
    let y = -100;

    const paint = () => {
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      frame = 0;
    };

    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      cursor.dataset.visible = "true";

      if (!frame) frame = requestAnimationFrame(paint);
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      cursor.dataset.active = target?.closest(INTERACTIVE_SELECTOR) ? "true" : "false";
    };

    const onDown = () => {
      cursor.dataset.pressed = "true";
    };

    const onUp = () => {
      cursor.dataset.pressed = "false";
    };

    const onLeave = () => {
      cursor.dataset.visible = "false";
      cursor.dataset.active = "false";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <div ref={cursorRef} className="vx-cursor" aria-hidden="true"><span /></div>;
}
