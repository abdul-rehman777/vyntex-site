"use client";

import { motion } from "framer-motion";
import { Users, Workflow, Sparkles, Network } from "lucide-react";
import { ease, useVyntexMotion } from "@/lib/motion";

const serviceIcons = [Users, Workflow, Sparkles] as const;

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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: ease.smooth },
    },
  };

  return (
    <motion.div
      variants={shouldReduceMotion ? undefined : containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="mt-9 grid gap-4 md:grid-cols-3"
    >
      {items.map(([title, body], index) => {
        const Icon = serviceIcons[index] ?? Network;
        return (
          <motion.article
            key={title}
            variants={shouldReduceMotion ? undefined : cardVariants}
            whileHover={
              shouldReduceMotion
                ? undefined
                : {
                    y: -5,
                    scale: 1.02,
                    boxShadow: "0 10px 30px -10px rgba(14,165,233,0.15)",
                    transition: { duration: 0.2, ease: ease.snappy },
                  }
            }
            className="group rounded-2xl border border-vx-line bg-vx-bg p-6 transition-colors hover:border-vx-blue/30 sm:p-7"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-vx-blue/10 text-vx-cyan transition-colors group-hover:bg-vx-cyan/20 group-hover:text-vx-glow">
              <Icon size={23} />
            </div>
            <h3 className="mt-5 text-xl font-bold">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-vx-muted">{body}</p>
          </motion.article>
        );
      })}
    </motion.div>
  );
}
