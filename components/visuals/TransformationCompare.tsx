"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { ease, useVyntexMotion } from "@/lib/motion";

export default function TransformationCompare({
  before,
  after,
  beforeItems,
  afterItems,
}: {
  before: string;
  after: string;
  beforeItems: readonly string[];
  afterItems: readonly string[];
}) {
  const { shouldReduceMotion } = useVyntexMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const containerVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: ease.smooth } },
  };

  // Calculate paths connecting left items to right items
  const paths = beforeItems.map((_, i) => {
    if (!dimensions.width || typeof window !== "undefined" && window.innerWidth < 640) return null;
    
    const isDesktop = dimensions.width >= 640;
    if (!isDesktop) return null;

    // Approximate vertical positions of list items
    const headerOffset = 90; 
    const itemHeight = 36;
    
    const startX = dimensions.width / 2 - 24; // Right edge of left card approx
    const startY = headerOffset + (i * itemHeight);
    
    const endX = dimensions.width / 2 + 24; // Left edge of right card approx
    const endY = headerOffset + (i * itemHeight);
    
    // Instead of straight across, let's make them all converge slightly or just curve
    // To make it look "organized", they can start slightly scattered y and end up neat, 
    // but the list items are already neat. A simple bezier curve looks elegant.
    return `M ${startX} ${startY} C ${startX + 30} ${startY}, ${endX - 30} ${endY}, ${endX} ${endY}`;
  });

  return (
    <motion.div
      ref={containerRef}
      variants={shouldReduceMotion ? undefined : containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="grid gap-4 sm:grid-cols-2 relative"
    >
      {/* SVG Connecting Paths */}
      {!shouldReduceMotion && dimensions.width >= 640 && (
        <svg className="absolute inset-0 h-full w-full pointer-events-none z-10" style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F87171" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          {paths.map((path, i) => path && (
            <motion.path
              key={i}
              d={path}
              stroke="url(#path-gradient)"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.5 + (i * 0.1), ease: ease.smooth }}
            />
          ))}
          {/* Animated signal pulses along paths */}
          {paths.map((path, i) => path && (
            <motion.path
              key={`pulse-${i}`}
              d={path}
              stroke="#22D3EE"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0, pathOffset: 0, opacity: 0 }}
              whileInView={{ 
                pathLength: [0, 0.2, 0], 
                pathOffset: [0, 0.8, 1],
                opacity: [0, 1, 0] 
              }}
              viewport={{ once: false }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: i * 0.3,
                ease: "linear"
              }}
            />
          ))}
        </svg>
      )}

      <motion.article 
        variants={shouldReduceMotion ? undefined : itemVariants}
        className="rounded-2xl border border-red-400/15 bg-red-400/[0.03] p-6 relative overflow-hidden group z-20"
      >
        <h3 className="font-bold text-vx-silver">{before}</h3>
        <ul className="mt-5 space-y-4">
          {beforeItems.map((item) => (
            <li key={item} className="flex items-center gap-3 text-sm text-vx-muted transition-colors group-hover:text-vx-silver/80">
              <span className="h-2 w-2 rounded-full bg-red-400/50" />
              {item}
            </li>
          ))}
        </ul>
      </motion.article>

      <motion.article 
        variants={shouldReduceMotion ? undefined : itemVariants}
        className="rounded-2xl border border-vx-cyan/30 bg-vx-blue/[0.06] p-6 relative overflow-hidden z-20 shadow-vx-glow-sm"
      >
        {/* Subtle glow effect on the "After" card */}
        {!shouldReduceMotion && (
          <motion.div 
            className="absolute -inset-10 bg-vx-cyan/5 rounded-full blur-2xl pointer-events-none"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        
        <h3 className="font-bold text-vx-ink relative z-10">{after}</h3>
        <ul className="mt-5 space-y-4 relative z-10">
          {afterItems.map((item) => (
            <li key={item} className="flex items-center gap-3 text-sm text-vx-silver">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-vx-cyan/20">
                <Check size={10} className="text-vx-cyan" strokeWidth={3} />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </motion.article>
    </motion.div>
  );
}
