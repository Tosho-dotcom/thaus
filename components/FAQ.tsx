"use client";

import { useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Section } from "@/components/Section";
import { Reveal, StaggerGroup } from "@/components/Reveal";
import { fadeUp, EASE } from "@/lib/motion";
import { faqs } from "@/lib/site";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const baseId = useId();

  const duration = shouldReduceMotion ? 0 : 0.3;

  return (
    <Section id="faq">
      <Reveal variants={fadeUp} className="mx-auto max-w-[720px]">
        <p className="label">FAQ</p>
        <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold tracking-[-0.02em]">
          Questions
        </h2>
        <p className="mt-3 text-lg text-dim">
          If it&apos;s not here, ask directly — see the contact section below.
        </p>
      </Reveal>

      <StaggerGroup className="mx-auto mt-10 flex max-w-[720px] flex-col gap-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          const triggerId = `${baseId}-trigger-${index}`;
          const panelId = `${baseId}-panel-${index}`;

          return (
            <motion.div
              key={faq.q}
              variants={fadeUp}
              className="overflow-hidden rounded-card border border-line bg-surface transition-colors duration-200 hover:border-accent/40"
            >
              <h3>
                <button
                  type="button"
                  id={triggerId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="group/faq flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-display text-base font-medium text-ink transition-colors hover:text-accent md:text-lg"
                >
                  {faq.q}
                  <motion.span
                    aria-hidden
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration, ease: EASE }}
                    className="shrink-0 text-accent"
                  >
                    <ChevronDown size={18} strokeWidth={1.5} />
                  </motion.span>
                </button>
              </h3>

              {/* The answer stays in the DOM when collapsed so search engines
                  and AI crawlers can read every answer without clicking. */}
              <motion.div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                aria-hidden={!isOpen}
                inert={!isOpen}
                initial={false}
                animate={
                  isOpen
                    ? { height: "auto", opacity: 1 }
                    : { height: 0, opacity: 0 }
                }
                transition={{ duration, ease: EASE }}
                className="overflow-hidden"
              >
                <p className="border-t border-line px-6 pb-5 pt-5 text-base leading-relaxed text-dim">
                  {faq.a}
                </p>
              </motion.div>
            </motion.div>
          );
        })}
      </StaggerGroup>
    </Section>
  );
}
