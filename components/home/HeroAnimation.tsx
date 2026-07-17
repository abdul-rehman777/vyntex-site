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

// Arranged in the order of the signal path
const MODULES = [
  { id: "website", label: "Website", Icon: Globe, initialPos: { x: -300, y: -100, z: 20 } },
  { id: "crm", label: "CRM", Icon: Users, initialPos: { x: -150, y: -180, z: -50 } },
  { id: "automation", label: "Team Notification", Icon: Workflow, initialPos: { x: 50, y: -200, z: 50 } },
  { id: "messages", label: "Automated Message", Icon: MessageSquareText, initialPos: { x: 250, y: -100, z: -100 } },
  { id: "calendar", label: "Appointment", Icon: CalendarDays, initialPos: { x: 300, y: 50, z: -20 } },
  { id: "invoice", label: "Invoice", Icon: TrendingUp, initialPos: { x: 150, y: 180, z: 0 } },
  { id: "payments", label: "Payment", Icon: CreditCard, initialPos: { x: -50, y: 160, z: -80 } },
  { id: "reports", label: "Report", Icon: BarChart3, initialPos: { x: -250, y: 100, z: -30 } },
];

export default function HeroAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { x: mouseX, y: mouseY } = useMousePosition();
  const { shouldReduceMotion } = useVyntexMotion();
  
  // States to control the sequence
  // scattered -> pulsing (signal moving through) -> converging -> connected
  const [phase, setPhase] = useState<"scattered" | "pulsing" | "converging" | "connected">("scattered");
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if (shouldReduceMotion) {
      setPhase("connected");
      setActiveIndex(MODULES.length - 1);
      return;
    }

    const sequence = async () => {
      // Wait in scattered state
      await new Promise(r => setTimeout(r, 600));
      
      setPhase("pulsing");
      
      // Pulse through modules sequentially
      for (let i = 0; i < MODULES.length; i++) {
        setActiveIndex(i);
        await new Promise(r => setTimeout(r, 400));
      }
      
      // Converge to center
      setPhase("converging");
      await new Promise(r => setTimeout(r, 600));
      
      setPhase("connected");
    };

    sequence();
  }, [shouldReduceMotion]);

  // Gentle scroll parallax
  const { scrollY } = useScroll();
  const globalY = useTransform(scrollY, [0, 500], [0, -50]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0.2]);

  return (
    <motion.div
      ref={containerRef}
      style={{ y: globalY, opacity, perspective: 1200 }}
      className="relative mx-auto mt-16 h-[400px] w-full max-w-4xl sm:h-[480px] lg:h-[540px]"
      aria-hidden="true"
    >
      {/* SVG Connecting Paths (The Data Pulse) */}
      <svg className="absolute inset-0 h-full w-full pointer-events-none" style={{ zIndex: 0 }}>
        <defs>
          <linearGradient id="glow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        
        {phase === "pulsing" && MODULES.map((mod, i) => {
          if (i === 0) return null;
          const prev = MODULES[i - 1]!;
          // Calculate center coordinates
          const w = containerRef.current?.offsetWidth || 800;
          const h = containerRef.current?.offsetHeight || 400;
          const x1 = w / 2 + prev.initialPos.x;
          const y1 = h / 2 + prev.initialPos.y;
          const x2 = w / 2 + mod.initialPos.x;
          const y2 = h / 2 + mod.initialPos.y;
          
          // Draw a curved path
          const path = `M ${x1} ${y1} Q ${(x1+x2)/2} ${y1 - 50} ${x2} ${y2}`;
          
          return (
            <motion.path
              key={`pulse-${i}`}
              d={path}
              stroke="url(#glow-gradient)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: activeIndex >= i ? 1 : 0,
                opacity: activeIndex >= i ? 0.6 : 0,
              }}
              transition={{ duration: 0.4, ease: "linear" }}
            />
          );
        })}
      </svg>

      {/* Central Core (Vyntex System) */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: (phase === "connected" || phase === "converging") ? 1 : 0.8,
          opacity: (phase === "connected" || phase === "converging") ? 1 : 0,
        }}
        transition={{ duration: duration.hero, ease: ease.smooth }}
      >
        <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-vx-blue/40 bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.2),transparent_80%)] bg-vx-bg3 shadow-vx-glow backdrop-blur-2xl sm:h-32 sm:w-32">
          <Network className="h-10 w-10 text-vx-cyan sm:h-14 sm:w-14" />
          {/* Ambient idle pulse in connected state */}
          {phase === "connected" && (
            <motion.div
              className="absolute inset-0 rounded-2xl border border-vx-cyan/50"
              animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
            />
          )}
        </div>
      </motion.div>

      {/* Floating Modules */}
      {MODULES.map((mod, index) => {
        // Connected state arranges them in a tight dashboard grid around the core
        const row = index < 4 ? -1 : 1;
        const col = (index % 4) - 1.5; // -1.5, -0.5, 0.5, 1.5
        const destX = col * 120;
        const destY = row * 100;
        
        // Mobile fallback
        const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
        const mobileScale = isMobile ? 0.8 : 1;

        // Apply mouse parallax only if scattered or pulsing
        const isFloating = phase === "scattered" || phase === "pulsing";
        const parallaxX = isFloating ? mouseX * (mod.initialPos.z || 10) * -0.5 : 0;
        const parallaxY = isFloating ? mouseY * (mod.initialPos.z || 10) * -0.5 : 0;
        
        // Active glow during pulsing
        const isActive = phase === "pulsing" && activeIndex >= index;

        return (
          <motion.div
            key={mod.id}
            className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-xl border border-vx-line bg-vx-bg/80 px-3 py-2 text-xs font-medium shadow-md backdrop-blur-md sm:px-4 sm:py-2.5 sm:text-sm transition-colors duration-300 z-10 ${isActive ? 'border-vx-cyan/60 text-white shadow-vx-glow bg-vx-blue/20' : 'text-vx-silver'}`}
            initial={shouldReduceMotion ? false : {
              x: mod.initialPos.x,
              y: mod.initialPos.y,
              opacity: 0,
              scale: 0.9 * mobileScale,
            }}
            animate={
              (phase === "connected" || phase === "converging")
                ? { x: destX, y: destY, opacity: 1, scale: 1 * mobileScale }
                : { x: mod.initialPos.x + parallaxX, y: mod.initialPos.y + parallaxY, opacity: 1, scale: 1 * mobileScale }
            }
            transition={{
              duration: (phase === "connected" || phase === "converging") ? duration.hero : 2,
              ease: (phase === "connected" || phase === "converging") ? ease.springLike : "easeOut",
              delay: (phase === "connected" || phase === "converging") ? index * 0.05 : 0,
            }}
          >
            <mod.Icon size={16} className={isActive ? "text-vx-cyan" : "text-vx-blue"} />
            <span className={isMobile && phase !== "connected" ? "hidden" : "inline"}>{mod.label}</span>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
