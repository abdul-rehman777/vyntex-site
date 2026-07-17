"use client";

import { useState, useEffect } from "react";

export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Only track if not on a touch device (fine pointer)
    const matchMedia = window.matchMedia("(pointer: fine)");
    if (!matchMedia.matches) return;

    let requestId: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (requestId) cancelAnimationFrame(requestId);
      requestId = requestAnimationFrame(() => {
        // Normalize mouse coordinates to range [-1, 1] relative to the viewport center
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = (e.clientY / window.innerHeight) * 2 - 1;
        setMousePosition({ x, y });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (requestId) cancelAnimationFrame(requestId);
    };
  }, []);

  return mousePosition;
}
