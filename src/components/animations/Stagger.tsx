"use client";

import { motion, type Variants } from "framer-motion";

type StaggerContainerProps = {
  children: React.ReactNode;
  className?: string;
  /** Seconds between each child's reveal. Default 0.08. */
  staggerChildren?: number;
  /** Initial delay before the first child plays. Default 0.05. */
  delayChildren?: number;
  as?: "div" | "section" | "ul" | "ol" | "dl";
  /** Match the viewport-once behavior to FadeIn. Default true. */
  once?: boolean;
};

/**
 * Orchestrates a list of `<StaggerItem>` children — each one fades and rises
 * a fraction of a second after its predecessor. Triggered by scroll
 * (`whileInView`) so cards "deal out" as the section enters view.
 */
export function StaggerContainer({
  children,
  className,
  staggerChildren = 0.08,
  delayChildren = 0.05,
  as = "div",
  once = true,
}: StaggerContainerProps) {
  const variants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren, delayChildren },
    },
  };

  const Tag = motion[as];

  return (
    <Tag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
    >
      {children}
    </Tag>
  );
}

type StaggerItemProps = {
  children: React.ReactNode;
  className?: string;
  /** Vertical offset in px before the item enters. Default 24. */
  y?: number;
  /** Per-item duration. Default 0.5. */
  duration?: number;
  as?: "div" | "li" | "article" | "section";
};

export function StaggerItem({
  children,
  className,
  y = 24,
  duration = 0.5,
  as = "div",
}: StaggerItemProps) {
  const variants: Variants = {
    hidden: { opacity: 0, y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const Tag = motion[as];

  return (
    <Tag className={className} variants={variants}>
      {children}
    </Tag>
  );
}
