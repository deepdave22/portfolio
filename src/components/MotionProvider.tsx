"use client";

import { LazyMotion, MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Loads Framer Motion's animation features lazily and applies the visitor's
 * motion preference to every animation on the page.
 *
 * Why lazy: the full `motion` component bundles drag, layout and gesture code
 * the site never uses, and evaluating it was the single heaviest script on the
 * page (about 2s of main-thread time under mobile CPU throttling). `LazyMotion`
 * with `m` components renders first, then loads just `domAnimation` after
 * hydration, so scroll-reveals cost nothing during the first paint.
 *
 * `reducedMotion="user"` drops transform-based animation (the upward lift) for
 * anyone with "reduce motion" enabled, keeping only the opacity fade. Handling
 * it here rather than inside Reveal keeps the server and client trees identical.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={() => import("./motionFeatures").then((m) => m.default)} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
