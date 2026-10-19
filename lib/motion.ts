import type { Variants } from "framer-motion";

/** easeOutExpo-like easing used across all Thaus motion. */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

/**
 * Movement without an opacity fade, for the hero headline: it is the LCP
 * element, so it must be visible in the server-rendered HTML before hydration.
 */
export const riseUp: Variants = {
  hidden: { y: 20 },
  visible: {
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: EASE },
  },
};

export function staggerContainer(
  staggerChildren = 0.08,
  delayChildren = 0.1
): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren, delayChildren },
    },
  };
}
