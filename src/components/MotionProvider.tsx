"use client";

import { MotionConfig } from "framer-motion";

/** Honors each visitor's prefers-reduced-motion for all Framer Motion animations. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
