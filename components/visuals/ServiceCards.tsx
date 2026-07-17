"use client";

import { useRef, type MouseEvent } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Users, Workflow, Sparkles, Network } from "lucide-react";
import { ease, useVyntexMotion } from "@/lib/motion";

const serviceIcons = [Users, Workflow, Sparkles] as const;

type TiltCardProps = {
  title: string;
  body: string;
  index: number;
  shouldReduceMotion: boolean;
};

function TiltCard({
  title,
  body,
  index,
  shouldReduceMotion,
}: TiltCardProps) {
  const Icon = serviceIcons[index] ?? Network;
  const ref = useRef<HTMLElement>(null);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const pointerXSpring = useSpring(pointerX, {
    stiffness: 150,
    damping: 15,
  });

  const pointerYSpring = useSpring(pointerY, {
    stiffness: 150,
    damping: 15,
  });

  const rotateX = useTransform(
    pointerYSpring,
    [-0.5, 0.5],
    ["7deg", "-7deg"],
  );

  const rotateY = useTransform(
    pointerXSpring,
    [-0.5, 0.5],
    ["-7deg", "7deg"],
  );

  const glowBackground = useTransform(
    [pointerXSpring, pointerYSpring],
    ([xValue, yValue]) => {
      const x = Number(xValue);
      const y = Number(yValue);

      return `radial-gradient(
        400px circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%,
        rgba(14, 165, 233, 0.1),
        transparent 40%
      )`;
    },
  );

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    if (shouldReduceMotion || !ref.current) {
      return;
    }

    const rect = ref.current.getBoundingClientRect();

    if (rect.width === 0 || rect.height === 0) {
      return;
    }

    const relativeX = event.clientX - rect.left;
    const relativeY = event.clientY - rect.top;

    pointerX.set(relativeX / rect.width - 0.5);
    pointerY.set(relativeY / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: ease.smooth,
      },
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
        aria-hidden="true"
        style={{
          transform: shouldReduceMotion ? "none" : "translateZ(30px)",
        }}
        className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-vx-blue/10 text-vx-cyan transition-colors group-hover:bg-vx-cyan/20 group-hover:text-vx-glow"
      >
        <Icon size={23} />
      </div>

      <h3
        style={{
          transform: shouldReduceMotion ? "none" : "translateZ(20px)",
        }}
        className="relative z-10 mt-5 text-xl font-bold"
      >
        {title}
      </h3>

      <p
        style={{
          transform: shouldReduceMotion ? "none" : "translateZ(10px)",
        }}
        className="relative z-10 mt-3 text-sm leading-6 text-vx-muted"
      >
        {body}
      </p>

      {!shouldReduceMotion && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: glowBackground,
          }}
        />
      )}
    </motion.article>
  );
}

type ServiceCardsProps = {
  items: readonly (readonly [string, string])[];
};

export default function ServiceCards({ items }: ServiceCardsProps) {
  const motionPreferences = useVyntexMotion();

  const shouldReduceMotion: boolean =
    motionPreferences.shouldReduceMotion === true;

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={shouldReduceMotion ? undefined : containerVariants}
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "show"}
      viewport={{
        once: true,
        margin: "-100px",
      }}
      style={{
        perspective: shouldReduceMotion ? undefined : 1000,
      }}
      className="mt-9 grid gap-4 md:grid-cols-3"
    >
      {items.map(([title, body], index) => (
        <TiltCard
          key={`${title}-${index}`}
          title={title}
          body={body}
          index={index}
          shouldReduceMotion={shouldReduceMotion}
        />
      ))}
    </motion.div>
  );
}