"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Stagger offset in seconds for items inside a list. */
  delay?: number;
  className?: string;
  /** Wrapper element — use "li" inside lists to keep markup semantic. */
  as?: "div" | "li" | "article" | "section";
}

/**
 * Fade-and-lift a block into view the first time it scrolls into the viewport.
 * Deliberately the only entrance animation on the site: one gesture, used
 * consistently, costs nothing and never blocks paint.
 *
 * Uses the slim `m` component: it renders with no animation code of its own and
 * relies on <MotionProvider>'s LazyMotion to supply the features after hydration.
 *
 * The component always renders the same element tree on server and client —
 * branching on `useReducedMotion()` here would produce a hydration mismatch,
 * because the hook can only know the user's preference in the browser. Reduced
 * motion is handled instead by <MotionProvider>, which sets Framer Motion's
 * `reducedMotion="user"` so the lift is dropped and only the fade remains.
 *
 * `data-reveal` is targeted by a <noscript> rule in layout.tsx so visitors and
 * crawlers without JavaScript never see a page of invisible sections.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: RevealProps) {
  const MotionTag = m[as];

  return (
    <MotionTag
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}
