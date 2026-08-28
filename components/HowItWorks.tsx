"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/Section";
import { Reveal, StaggerGroup } from "@/components/Reveal";
import { fadeUp } from "@/lib/motion";

const steps = [
  {
    number: "01",
    title: "Brief",
    description:
      "You tell me what you're building — a website, automation, or a complete system.",
  },
  {
    number: "02",
    title: "Build",
    description:
      "I design and build the whole thing: real code, real automation — not a template.",
  },
  {
    number: "03",
    title: "Launch",
    description:
      "Deployed, tested, and live — with the infrastructure to back it up.",
  },
  {
    number: "04",
    title: "Document",
    description:
      "You get the full build log and ongoing updates — not silence after launch.",
  },
];

export function HowItWorks() {
  return (
    <Section id="how-it-works">
      <Reveal variants={fadeUp} className="max-w-2xl">
        <p className="label">Process</p>
        <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold tracking-[-0.02em]">
          How it works
        </h2>
        <p className="mt-3 text-lg text-dim">
          From brief to a live, documented system.
        </p>
      </Reveal>

      <StaggerGroup
        className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
        staggerChildren={0.1}
      >
        {steps.map((step) => (
          <motion.div
            key={step.number}
            variants={fadeUp}
            className="flex flex-col gap-3 border-t border-line pt-6"
          >
            <span
              aria-hidden
              className="font-mono text-[2rem] leading-none tracking-[-0.02em] text-accent"
            >
              {step.number}
            </span>
            <h3 className="font-display text-xl font-medium">{step.title}</h3>
            <p className="text-sm leading-relaxed text-dim">
              {step.description}
            </p>
          </motion.div>
        ))}
      </StaggerGroup>
    </Section>
  );
}
