"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/Section";
import { Reveal, StaggerGroup } from "@/components/Reveal";
import { fadeUp } from "@/lib/motion";

const principles = [
  "Build real systems",
  "Document everything",
  "Measure results",
  "Improve continuously",
];

export function About() {
  return (
    <Section id="about">
      <Reveal variants={fadeUp} className="max-w-[640px]">
        <p className="label">About</p>
        <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold tracking-[-0.02em]">
          The studio
        </h2>

        <div className="mt-6 flex flex-col gap-5 text-lg leading-relaxed text-dim">
          <p>
            Thaus is a faceless studio. No agency theatrics, no personal brand
            — just complete business systems, built and documented in the open.
            Every project ships as a real, working system: a website wired to
            real automation, not a template with a contact form bolted on.
          </p>
          <p>
            The process is public by design. Every build — the wins, the
            mistakes, the actual hours — gets documented as it happens, because
            a studio that shows its work is easier to trust than one that only
            shows the highlight reel.
          </p>
        </div>
      </Reveal>

      <StaggerGroup
        className="mt-8 flex max-w-[640px] flex-wrap gap-2"
        staggerChildren={0.08}
      >
        {principles.map((principle) => (
          <motion.span
            key={principle}
            variants={fadeUp}
            className="rounded-tag border border-line px-2 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-dim"
          >
            {principle}
          </motion.span>
        ))}
      </StaggerGroup>
    </Section>
  );
}
