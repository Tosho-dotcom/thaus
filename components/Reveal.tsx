"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useSyncExternalStore,
  type ReactElement,
  type ReactNode,
} from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const noopSubscribe = () => () => {};

/** True when the browser supports native scroll-linked (`animation-timeline: view()`) animation. */
function useScrollTimelineSupport() {
  return useSyncExternalStore(
    noopSubscribe,
    () => typeof CSS !== "undefined" && CSS.supports("animation-timeline: view()"),
    () => false
  );
}

interface RevealProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  amount?: number;
}

/**
 * Scroll-triggered reveal. Where supported, position is driven live by
 * scroll progress via the `.scroll-slide` CSS class (see globals.css) for a
 * continuous "gliding into place" feel. Falls back to a Framer Motion
 * whileInView fade/slide-up for browsers without scroll-timeline support.
 * Renders the final state instantly for prefers-reduced-motion either way.
 */
export function Reveal({ children, className, variants, amount = 0.3 }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const scrollTimelineSupported = useScrollTimelineSupport();

  if (scrollTimelineSupported && !shouldReduceMotion) {
    return <div className={cn("scroll-slide", className)}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

interface StaggerGroupProps {
  children: ReactNode;
  className?: string;
  staggerChildren?: number;
  delayChildren?: number;
  amount?: number;
}

/**
 * Scroll-triggered stagger container; pair children with `motion.div variants={fadeUp}`.
 * Where scroll-timeline is supported, each child gets its own `.scroll-slide`
 * treatment instead (they naturally glide in together as they enter view).
 */
export function StaggerGroup({
  children,
  className,
  staggerChildren = 0.08,
  delayChildren = 0.1,
  amount = 0.2,
}: StaggerGroupProps) {
  const shouldReduceMotion = useReducedMotion();
  const scrollTimelineSupported = useScrollTimelineSupport();

  if (scrollTimelineSupported && !shouldReduceMotion) {
    return (
      <div className={className}>
        {Children.map(children, (child) => {
          if (!isValidElement(child)) return child;
          const element = child as ReactElement<{ className?: string }>;
          return cloneElement(element, {
            className: cn("scroll-slide", element.props.className),
          });
        })}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren, delayChildren },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
