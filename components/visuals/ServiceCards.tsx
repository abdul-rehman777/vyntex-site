"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Users, Workflow, Sparkles, Network } from "lucide-react";
import { ease, useVyntexMotion } from "@/lib/motion";

const serviceIcons = [Users, Workflow, Sparkles] as const;

function TiltCard({
  title,
  body,
  index,
  shouldReduceMotion,
}: {
  title: string;
  body: string;
  index: number;
  shouldReduceMotion: boolean;
}) {
  const Icon = serviceIcons[index] ?? Network;
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);
  const glowBackground = useTransform(
    [mouseXSpring, mouseYSpring],
    ([cx, cy]) => `radial-gradient(400px circle at ${((cx as number) + 0.5) * 100}% ${((cy as number) + 0.5) * 100}%, rgba(14,165,233,0.1), transparent 40%)`
  );
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    if (shouldReduceMotion) return;
    x.set(0);
    y.set(0);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: ease.smooth },
    },
  };

  return (
    <motion.article
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      variants={shouldReduceMotion ? undefined : cardVariants}
      style={{
        rotateX: shouldReduceMotion ? 0 : rotateX,
        rotateY: shouldReduceMotion ? 0 : rotateY,
        transformStyle: "preserve-3d",
      }}
      className="group relative rounded-2xl border border-vx-line bg-vx-bg p-6 transition-colors hover:border-vx-blue/30 sm:p-7"
    >
      <div 
        style={{ transform: shouldReduceMotion ? "none" : "translateZ(30px)" }}
        className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-vx-blue/10 text-vx-cyan transition-colors group-hover:bg-vx-cyan/20 group-hover:text-vx-glow"
      >
        <Icon size={23} />
      </div>
      <h3 
        style={{ transform: shouldReduceMotion ? "none" : "translateZ(20px)" }}
        className="mt-5 text-xl font-bold relative z-10"
      >
        {title}
      </h3>
      <p 
        style={{ transform: shouldReduceMotion ? "none" : "translateZ(10px)" }}
        className="mt-3 text-sm leading-6 text-vx-muted relative z-10"
      >
        {body}
      </p>
      
      {/* Glow effect that follows mouse — useTransform called unconditionally above */}
      <motion.div
        className={`pointer-events-none absolute inset-0 -z-10 rounded-2xl transition-opacity duration-300 group-hover:opacity-100 ${shouldReduceMotion ? "hidden" : "opacity-0"}`}
        style={{
          background: glowBackground,
        }}
      />
    </motion.article>
  );
}

export default function ServiceCards({
  items,
}: {
  items: readonly (readonly [string, string])[];
}) {
  const { shouldReduceMotion } = useVyntexMotion();

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={shouldReduceMotion ? undefined : containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      style={{ perspective: 1000 }}
      className="mt-9 grid gap-4 md:grid-cols-3"
    >
      {items.map(([title, body], index) => (
        <TiltCard 
          key={title} 
          title={title} 
          body={body} 
          index={index} 
          shouldReduceMotion={shouldReduceMotion} 
        />
      ))}
    </motion.div>
  );
}
