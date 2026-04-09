"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import type { ReactNode } from "react";
import { useRef } from "react";
import TiltCard from "./TiltCard";

/* ── Parallax hero background ─────────────────────────────────────── */
export function ParallaxBackground({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  return (
    <div ref={ref} className="absolute inset-0 z-0 overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}

/* ── Staggered hero text ──────────────────────────────────────────── */
const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export function HeroStagger({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-8 max-w-[520px]"
    >
      {children}
    </motion.div>
  );
}

export function HeroStaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
}

/* ── Notification card with 3D tilt ───────────────────────────────── */
export function HeroNotificationCard({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="hidden lg:flex items-center justify-center"
    >
      <TiltCard className="relative" tiltDegree={10} glare>
        {children}
      </TiltCard>
    </motion.div>
  );
}

/* ── Animated gradient mesh background ────────────────────────────── */
export function GradientMesh() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute w-[600px] h-[600px] -top-48 -left-48 rounded-full animate-mesh-drift-1"
        style={{
          background:
            "radial-gradient(circle, rgba(255,96,100,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] -bottom-32 -right-32 rounded-full animate-mesh-drift-2"
        style={{
          background:
            "radial-gradient(circle, rgba(254,201,76,0.08) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
