"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const cardLeft = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const cardRight = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const, delay: 0.15 },
  },
};

export function SlideInCard({
  children,
  className,
  from,
}: {
  children: ReactNode;
  className?: string;
  from: "left" | "right";
}) {
  return (
    <motion.div
      variants={from === "left" ? cardLeft : cardRight}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-48px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const listContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.3,
    },
  },
};

const listItem = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function StaggeredList({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.ul
      variants={listContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-48px" }}
      className={className}
    >
      {children}
    </motion.ul>
  );
}

export function StaggeredListItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.li variants={listItem} className={className}>
      {children}
    </motion.li>
  );
}

/* Shine sweep overlay for highlighted cards */
export function ShineSweep() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden z-10"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <motion.div
        className="absolute inset-0 w-1/3"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
        }}
        initial={{ x: "-100%" }}
        whileInView={{ x: "400%" }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.8, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
