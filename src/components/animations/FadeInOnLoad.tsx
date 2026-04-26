"use client";

import { motion, type Variants } from "framer-motion";

type FadeInOnLoadProps = {
  children: React.ReactNode;
  y?: number;
  duration?: number;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "span" | "h1" | "p";
};

/**
 * Plays exactly once on mount — for above-the-fold elements that should not
 * wait for scroll (hero copy, hero CTAs, etc.). Pair with small staggered
 * `delay` values to choreograph the headline → subhead → buttons cascade.
 */
export function FadeInOnLoad({
  children,
  y = 16,
  duration = 0.65,
  delay = 0,
  className,
  as = "div",
}: FadeInOnLoadProps) {
  const variants: Variants = {
    hidden: { opacity: 0, y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const Tag = motion[as];

  return (
    <Tag
      className={className}
      variants={variants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </Tag>
  );
}
