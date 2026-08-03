"use client";

import { useSyncExternalStore, type RefObject } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Particles, ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine, ISourceOptions } from "@tsparticles/engine";
import { StaticNetwork } from "@/components/hero/StaticNetwork";

const initEngine = async (engine: Engine) => {
  await loadSlim(engine);
};

// matches the `lg` boundary the hero veil, scrim and pointer-events all use
function useIsMobileViewport(breakpoint = 1023) {
  return useSyncExternalStore(
    (callback) => {
      const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    () => window.matchMedia(`(max-width: ${breakpoint}px)`).matches,
    () => false
  );
}

function buildOptions(): ISourceOptions {
  return {
    fullScreen: { enable: false },
    background: { color: "transparent" },
    fpsLimit: 60,
    detectRetina: true,
    pauseOnBlur: true,
    pauseOnOutsideViewport: true,
    particles: {
      number: {
        // desktop only — the field is full-bleed, so let tsParticles scale the
        // count with the container area so a 1280px and a 2560px viewport end
        // up with comparable densities.
        value: 95,
        density: { enable: true, width: 1600, height: 900 },
      },
      color: { value: "#3B5BFF" },
      links: {
        enable: true,
        color: "#3B5BFF",
        distance: 140,
        opacity: 0.22,
        width: 1,
      },
      move: {
        enable: true,
        speed: 0.6,
        direction: "none",
        random: true,
        straight: false,
        outModes: { default: "bounce" },
      },
      size: { value: { min: 1, max: 2.6 } },
      opacity: {
        value: { min: 0.3, max: 0.85 },
        animation: { enable: true, speed: 0.5, sync: false },
      },
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "grab",
          parallax: { enable: true, force: 28, smooth: 12 },
        },
        onClick: { enable: false },
        resize: { enable: true },
      },
      modes: {
        grab: {
          distance: 160,
          links: { opacity: 0.5, color: "#3B5BFF" },
        },
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any as ISourceOptions;
}

interface HeroGraphicProps {
  containerRef: RefObject<HTMLElement | null>;
  className?: string;
}

/** Interactive cobalt node-network graphic, full-bleed behind the hero. */
export function HeroGraphic({ containerRef, className }: HeroGraphicProps) {
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useIsMobileViewport();

  const { scrollYProgress } = useScroll({
    target: containerRef as RefObject<HTMLElement>,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.25]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -40]);

  if (shouldReduceMotion) {
    return <StaticNetwork className={className} />;
  }

  return (
    <motion.div
      style={{ opacity, y }}
      className={className ? `${className} h-full w-full` : "h-full w-full"}
    >
      {/* Touch viewports get the painted-once network: there is no cursor to
          drive the grab/parallax interaction, so the rAF loop would burn
          battery for nothing. Scroll takes over as the sense of motion via the
          opacity/y transform above. */}
      {isMobile ? (
        <StaticNetwork />
      ) : (
        <ParticlesProvider init={initEngine}>
          <Particles
            id="hero-graphic"
            options={buildOptions()}
            className="h-full w-full"
          />
        </ParticlesProvider>
      )}
    </motion.div>
  );
}
