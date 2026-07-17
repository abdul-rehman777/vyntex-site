"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Users,
  MessageSquareText,
  CalendarDays,
  Workflow,
  CreditCard,
  Globe,
  TrendingUp,
  BarChart3,
  Network
} from "lucide-react";
import { useMousePosition } from "@/hooks/useMousePosition";
import { duration, ease, useVyntexMotion } from "@/lib/motion";

const MODULES = [
  { id: "crm", label: "CRM", Icon: Users, initialPos: { x: -250, y: -150, z: -50 } },
  { id: "messages", label: "Messages", Icon: MessageSquareText, initialPos: { x: 250, y: -100, z: -100 } },
  { id: "calendar", label: "Calendar", Icon: CalendarDays, initialPos: { x: -200, y: 150, z: -20 } },
  { id: "automation", label: "Automation", Icon: Workflow, initialPos: { x: 200, y: 120, z: 50 } },
  { id: "payments", label: "Payments", Icon: CreditCard, initialPos: { x: 0, y: -180, z: -80 } },
  { id: "website", label: "Website", Icon: Globe, initialPos: { x: -300, y: 0, z: 20 } },
  { id: "marketing", label: "Marketing", Icon: TrendingUp, initialPos: { x: 300, y: 0, z: 0 } },
  { id: "reports", label: "Reports", Icon: BarChart3, initialPos: { x: 0, y: 180, z: -30 } },
];

export default function HeroAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { x: mouseX, y: mouseY } = useMousePosition();
  const { shouldReduceMotion } = useVyntexMotion();
  
  // States to control the sequence
  const [phase, setPhase] = useState<"scattered" | "connecting" | "connected">("scattered");

  useEffect(() => {
    if (shouldReduceMotion) {
      setPhase("connected");
      return;
    }

    // Sequence timing
    const connectTimer = setTimeout(() => setPhase("connecting"), 600);
    const convergeTimer = setTimeout(() => setPhase("connected"), 2200);

    return () => {
      clearTimeout(connectTimer);
      clearTimeout(convergeTimer);
    };
  }, [shouldReduceMotion]);

  // Gentle scroll parallax
  const { scrollY } = useScroll();
  const globalY = useTransform(scrollY, [0, 500], [0, -50]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0.2]);

  return (
    <motion.div
      ref={containerRef}
      style={{ y: globalY, opacity, perspective: 1000 }}
      className="relative mx-auto mt-16 h-[380px] w-full max-w-4xl sm:h-[480px] lg:h-[540px]"
      aria-hidden="true"
    >
      {/* Central Core (Vyntex System) */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: phase === "connected" ? 1 : 0.8,
          opacity: phase === "connected" ? 1 : 0,
        }}
        transition={{ duration: duration.hero, ease: ease.smooth }}
      >
        <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-vx-blue/30 bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.15),transparent_80%)] bg-vx-bg3 shadow-vx-glow backdrop-blur-xl sm:h-32 sm:w-32">
          <Network className="h-10 w-10 text-vx-cyan sm:h-14 sm:w-14" />
          {/* Pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-2xl border border-vx-cyan/50"
            animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* SVG Connecting Lines */}
      <svg className="absolute inset-0 h-full w-full pointer-events-none" style={{ zIndex: 0 }}>
        {MODULES.map((mod) => {
          // Calculate path from node's initial pos to center (0,0 is center of SVG if we translate)
          return (
            <motion.path
              key={`line-${mod.id}`}
              d={`M ${containerRef.current?.offsetWidth ? containerRef.current.offsetWidth / 2 + mod.initialPos.x : 0} ${containerRef.current?.offsetHeight ? containerRef.current.offsetHeight / 2 + mod.initialPos.y : 0} L 50% 50%`}
              stroke="url(#glow-gradient)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: phase === "connecting" ? 1 : phase === "connected" ? 1 : 0,
                opacity: phase === "connecting" ? 0.4 : phase === "connected" ? 0 : 0,
              }}
              transition={{ duration: 1.5, ease: ease.smooth }}
            />
          );
        })}
        <defs>
          <linearGradient id="glow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>

      {/* Scattered Modules */}
      {MODULES.map((mod, index) => {
        // Calculate destination position when connected (arrange in a circle or neat grid around the core)
        const angle = (index / MODULES.length) * Math.PI * 2;
        const radius = 140; // Desktop radius
        const destX = Math.cos(angle) * radius;
        const destY = Math.sin(angle) * radius;

        // Apply mouse parallax only if scattered
        const parallaxX = phase === "scattered" ? mouseX * (mod.initialPos.z || 10) * -0.5 : 0;
        const parallaxY = phase === "scattered" ? mouseY * (mod.initialPos.z || 10) * -0.5 : 0;

        return (
          <motion.div
            key={mod.id}
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-xl border border-vx-line bg-vx-bg/80 px-3 py-2 text-xs font-medium text-vx-silver shadow-md backdrop-blur-md sm:px-4 sm:py-2.5 sm:text-sm"
            initial={shouldReduceMotion ? false : {
              x: mod.initialPos.x + parallaxX,
              y: mod.initialPos.y + parallaxY,
              opacity: 0,
              scale: 0.9,
            }}
            animate={
              phase === "connected"
                ? { x: destX, y: destY, opacity: 1, scale: 1 }
                : { x: mod.initialPos.x + parallaxX, y: mod.initialPos.y + parallaxY, opacity: 1, scale: 1 }
            }
            transition={{
              duration: phase === "connected" ? duration.hero : 2,
              ease: phase === "connected" ? ease.springLike : "easeOut",
              delay: phase === "connected" ? index * 0.05 : index * 0.1,
            }}
          >
            <mod.Icon size={16} className="text-vx-blue" />
            <span className="hidden sm:inline">{mod.label}</span>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
