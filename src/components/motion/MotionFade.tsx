"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const fadeScale: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

/* Use smaller x offsets to avoid horizontal overflow on mobile */
const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0 },
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0 },
};

const variantMap = {
  up: fadeUp,
  scale: fadeScale,
  left: fadeLeft,
  right: fadeRight,
};

interface MotionFadeProps {
  children: ReactNode;
  direction?: keyof typeof variantMap;
  delay?: number;
  duration?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li" | "p" | "h2" | "h3" | "span";
}

export default function MotionFade({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  className,
  as = "div",
}: MotionFadeProps) {
  const Component = motion.create(as);

  return (
    <Component
      variants={variantMap[direction]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-48px" }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </Component>
  );
}
