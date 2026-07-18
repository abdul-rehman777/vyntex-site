"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

type NavigatorWithHints = Navigator & {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
};

export function useAdaptiveMotion() {
  const prefersReducedMotion = useReducedMotion() === true;
  const [lowPowerDevice, setLowPowerDevice] = useState(false);

  useEffect(() => {
    const nav = navigator as NavigatorWithHints;
    const compactViewport = window.matchMedia("(max-width: 1023px)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");

    const update = () => {
      const limitedHardware =
        (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 4) ||
        (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4);

      setLowPowerDevice(
        compactViewport.matches ||
          coarsePointer.matches ||
          nav.connection?.saveData === true ||
          limitedHardware,
      );
    };

    update();
    compactViewport.addEventListener("change", update);
    coarsePointer.addEventListener("change", update);

    return () => {
      compactViewport.removeEventListener("change", update);
      coarsePointer.removeEventListener("change", update);
    };
  }, []);

  return {
    prefersReducedMotion,
    lowPowerDevice,
    disableAmbientMotion: prefersReducedMotion || lowPowerDevice,
  };
}
