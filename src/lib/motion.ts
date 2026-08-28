/**
 * Centralized GSAP animation configs.
 *
 * Single source of truth for easing curves, durations, and stagger values
 * so every section speaks the same visual language. Importing these (rather
 * than hand-coding eases everywhere) keeps the site cohesive.
 */

/** Premium ease — fast start, long settle. ChatGPT's "purposeful motion." */
export const easeOutExpo = (t: number): number => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

/** Standard durations. Use these rather than raw numbers. */
export const D = {
  fast: 0.3,
  base: 0.6,
  slow: 1.0,
  scroll: 1.2,
} as const;

/** Standard stagger between sibling elements. */
export const stagger = {
  tight: 0.05,
  base: 0.08,
  loose: 0.15,
} as const;

/**
 * Reveal animation: element fades in and slides up.
 * Use for cards, list items, anything below the fold.
 */
export const reveal = {
  from: { y: 32, opacity: 0 },
  to: { y: 0, opacity: 1, duration: D.base, ease: "power3.out" },
};

/**
 * Mask reveal: text appears from behind a clip-path mask.
 * Use for headlines and section titles.
 */
export const maskReveal = {
  from: { yPercent: 100 },
  to: { yPercent: 0, duration: D.slow, ease: "power4.out" },
};

/** Parallax speed multiplier. Lower = slower drift. */
export const parallax = {
  subtle: 0.2,
  base: 0.4,
  strong: 0.7,
} as const;

/**
 * Pinned section defaults. Use with ScrollTrigger.create({ pin: true, scrub: true }).
 */
export const pinnedSection = {
  scrub: 1,
  start: "top top",
  end: "+=100%",
} as const;
