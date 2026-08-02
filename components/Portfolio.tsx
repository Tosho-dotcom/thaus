"use client";

import { AnimatePresence } from "framer-motion";
import { Section } from "@/components/Section";
import { Reveal, StaggerGroup } from "@/components/Reveal";
import { PortfolioCard } from "@/components/PortfolioCard";
import { portfolioItems } from "@/lib/portfolio-data";
import { fadeUp } from "@/lib/motion";

export function Portfolio() {
  return (
    <Section id="portfolio">
      <Reveal variants={fadeUp} className="max-w-2xl">
        <p className="label">Selected work</p>
        <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold tracking-[-0.02em]">
          Selected systems
        </h2>
        <p className="mt-3 text-lg text-dim">
          Real projects, documented from zero.
        </p>
      </Reveal>

      <StaggerGroup className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {portfolioItems.map((item) => (
            <PortfolioCard key={item.id} item={item} />
          ))}
        </AnimatePresence>
      </StaggerGroup>
    </Section>
  );
}
