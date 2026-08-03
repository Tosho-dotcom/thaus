"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Section } from "@/components/Section";
import { CtaLink } from "@/components/CtaButton";
import { HeroGraphic } from "@/components/hero/HeroGraphic";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <Section
      id="hero"
      className="relative overflow-hidden pt-32 pb-20 md:pt-44 md:pb-28"
    >
      {/* faint background grid — flat, extremely subtle */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #F4F4F2 1px, transparent 1px), linear-gradient(to bottom, #F4F4F2 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
        }}
      />

      {/* Node network, full-bleed across the whole hero. `isolate` makes this
          wrapper the backdrop root, so the veil below blurs the network and
          nothing else on the page. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 overflow-hidden isolate lg:pointer-events-auto"
      >
        <HeroGraphic containerRef={heroRef} className="absolute inset-0" />

        {/* blurred + dimmed on the left (behind the copy), crisp on the right */}
        <div aria-hidden className="hero-veil pointer-events-none absolute inset-0" />
      </div>

      {/* extra vertical readability scrim on mobile, where copy sits over the
          full width of the field — kept off the middle band so the network
          still reads through behind the headline */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-bg/40 via-transparent to-bg/40 lg:hidden"
      />

      <div
        ref={heroRef}
        className="relative grid grid-cols-1 items-center gap-12 lg:min-h-[460px] lg:grid-cols-[11fr_9fr] lg:gap-8"
      >
        <motion.div
          initial={shouldReduceMotion ? false : "hidden"}
          animate="visible"
          variants={staggerContainer(0.1, 0.05)}
          className="relative flex max-w-3xl flex-col gap-6 lg:order-1"
        >
          <motion.p variants={fadeUp} className="label">
            THAUS — DIGITAL PRODUCT STUDIO
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="text-[clamp(2.75rem,6vw,5rem)] font-bold leading-[1.02] tracking-[-0.03em]"
          >
            Complete business systems, built in public.
            <span
              aria-hidden
              className="cursor-blink ml-2 inline-block h-[0.8em] w-[0.5em] translate-y-[0.08em] bg-accent align-middle"
            />
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="max-w-xl text-lg leading-relaxed text-dim md:text-xl"
          >
            We build the whole thing — website, automations, CRM, and the
            growth engine behind it. Then we document every step in the open.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-4 pt-2">
            <CtaLink href="#contact" icon={ArrowRight}>
              Get in touch
            </CtaLink>
            <CtaLink href="#newsletter" variant="outline" icon={ArrowUpRight}>
              Read the Build Log
            </CtaLink>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mt-6 flex items-center gap-2 font-mono text-xs text-dim"
          >
            <span
              aria-hidden
              className="status-pulse inline-block h-1.5 w-1.5 rounded-full bg-accent"
            />
            STATUS: BUILDING · PROJECT #001 — MED SPA SYSTEM
          </motion.p>
        </motion.div>
      </div>
    </Section>
  );
}
