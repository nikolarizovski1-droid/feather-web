"use client";

import {
  useInView,
  useMotionValue,
  useSpring,
  motion,
} from "framer-motion";
import { useEffect, useRef } from "react";

interface AnimatedCounterProps {
  value: string; // e.g. "5K+", "40+", "98%", "10M"
  className?: string;
}

function parseValue(raw: string): { num: number; suffix: string; prefix: string } {
  const match = raw.match(/^([^0-9]*)([0-9,.]+)\s*(.*)$/);
  if (!match) return { num: 0, suffix: raw, prefix: "" };
  return {
    prefix: match[1],
    num: parseFloat(match[2].replace(/,/g, "")),
    suffix: match[3],
  };
}

export default function AnimatedCounter({ value, className }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-48px" });

  const { num, suffix, prefix } = parseValue(value);

  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.5,
  });

  useEffect(() => {
    if (inView) {
      motionVal.set(num);
    }
  }, [inView, motionVal, num]);

  useEffect(() => {
    const unsubscribe = springVal.on("change", (v) => {
      if (!ref.current) return;
      const rounded = num >= 100 ? Math.round(v) : Math.round(v * 10) / 10;
      // Format with commas for large numbers
      const formatted =
        rounded >= 1000
          ? rounded.toLocaleString("en-US", { maximumFractionDigits: 0 })
          : String(rounded);
      ref.current.textContent = `${prefix}${formatted}${suffix}`;
    });
    return unsubscribe;
  }, [springVal, suffix, prefix, num]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {prefix}0{suffix}
    </motion.span>
  );
}
