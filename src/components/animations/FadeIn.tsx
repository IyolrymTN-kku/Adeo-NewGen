"use client";

import { motion, type Variants } from "framer-motion";

type FadeInProps = {
  children: React.ReactNode;
  /** Vertical translation in px before the element enters. Default 24. */
  y?: number;
  /** Animation duration in seconds. Default 0.6. */
  duration?: number;
  /** Delay in seconds before the animation starts. Default 0. */
  delay?: number;
  className?: string;
  /** Tag to render. Default "div". */
  as?: "div" | "section" | "article" | "span";
};

/**
 * Scroll-triggered fade-and-rise. Animates once when the element enters the
 * viewport. Uses `viewport={{ once: true, margin: "-100px" }}` so the reveal
 * fires slightly before the element is fully on-screen — feels natural at
 * desktop scroll speeds.
 */
export function FadeIn({
  children,
  y = 24,
  duration = 0.6,
  delay = 0,
  className,
  as = "div",
}: FadeInProps) {
  const variants: Variants = {
    hidden: { opacity: 0, y },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // cubic-bezier "ease-out-expo" — premium feel
      },
    },
  };

  const Tag = motion[as];

  return (
    <Tag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {children}
    </Tag>
  );
}
