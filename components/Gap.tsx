"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Section } from "@/components/Section";
import { Reveal, StaggerGroup } from "@/components/Reveal";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

const columns = [
  {
    label: "Today",
    title: "Everything waits for you.",
    tone: "now",
    items: [
      "Every DM, form and missed call sits there until you see it.",
      "Follow-ups happen when you remember them, or not at all.",
      "Booking one appointment takes three messages back and forth.",
      "A day off means a day of leads nobody answered.",
    ],
  },
  {
    label: "With a Thaus system",
    title: "The business answers without you.",
    tone: "next",
    items: [
      "The site answers questions and captures the lead in seconds, at 2am too.",
      "Every lead gets a reply and a follow-up, on your day off as well.",
      "Clients pick a time and book themselves.",
      "You read one monthly report instead of living in the inbox.",
    ],
  },
] as const;

export function Gap() {
  return (
    <Section id="gap">
      <Reveal variants={fadeUp} className="max-w-2xl">
        <p className="label">The gap</p>
        <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold tracking-[-0.02em]">
          Right now, your business stops when you do.
        </h2>
        <p className="mt-3 text-lg text-dim">
          The wider the distance between these two columns, the more a system
          pays for itself.
        </p>
      </Reveal>

      <StaggerGroup className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
        {columns.map((column) => {
          const next = column.tone === "next";
          const Icon = next ? Check : X;
          return (
            <motion.div
              key={column.label}
              variants={fadeUp}
              className={cn(
                "flex flex-col rounded-plan border p-6",
                next
                  ? "border-accent bg-surface-hover shadow-plan-raised"
                  : "border-line bg-surface shadow-plan"
              )}
            >
              <p
                className={cn(
                  "font-mono text-sm uppercase tracking-[0.14em]",
                  next ? "text-accent" : "text-dim"
                )}
              >
                {column.label}
              </p>
              <h3 className="mt-2 font-display text-xl font-medium">
                {column.title}
              </h3>
              <ul className="mt-5 flex flex-col gap-3.5 border-t border-line pt-5">
                {column.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span
                      className={cn(
                        "mt-px flex size-4 shrink-0 items-center justify-center rounded-full",
                        next ? "bg-accent text-ink" : "bg-line text-dim"
                      )}
                      aria-hidden
                    >
                      <Icon size={10} strokeWidth={2.5} />
                    </span>
                    <span
                      className={cn(
                        "text-sm leading-relaxed",
                        next ? "text-ink" : "text-dim"
                      )}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </StaggerGroup>
    </Section>
  );
}
