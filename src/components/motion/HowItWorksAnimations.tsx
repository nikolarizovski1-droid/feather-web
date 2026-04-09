"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/* ── Animated connecting line across steps ─────────────────────────── */
export function ConnectingLine() {
  return (
    <div className="hidden lg:block absolute top-1/2 left-0 right-0 -translate-y-1/2 z-0 px-16">
      <motion.div
        className="h-[2px] bg-gradient-to-r from-brand/0 via-brand/30 to-brand/0 origin-left"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-48px" }}
        transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

/* ── Step card that slides in ──────────────────────────────────────── */
export function StepCard({
  children,
  className,
  index,
}: {
  children: ReactNode;
  className?: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{
        duration: 0.6,
        delay: 0.15 * index,
        ease: [0.22, 1, 0.36, 1] as const,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Icon with glow pulse on entry ─────────────────────────────────── */
export function AnimatedIcon({
  children,
  className,
  highlight,
}: {
  children: ReactNode;
  className?: string;
  highlight: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ scale: 0.8, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as const,
      }}
      whileHover={{
        scale: 1.1,
        boxShadow: highlight
          ? "0 0 20px rgba(255,96,100,0.3)"
          : "0 0 15px rgba(0,0,0,0.1)",
      }}
    >
      {children}
    </motion.div>
  );
}

/* ── Tags that pop in sequentially ─────────────────────────────────── */
const tagContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.3,
    },
  },
};

const tagItem = {
  hidden: { opacity: 0, scale: 0.8, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function AnimatedTags({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={tagContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-48px" }}
      className="flex flex-wrap gap-2 mt-auto pt-2"
    >
      {children}
    </motion.div>
  );
}

export function AnimatedTag({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.span variants={tagItem} className={className}>
      {children}
    </motion.span>
  );
}
