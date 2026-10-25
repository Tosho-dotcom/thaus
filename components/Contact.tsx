"use client";

import { useId } from "react";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { ContactForm } from "@/components/ContactForm";
import { fadeUp } from "@/lib/motion";

export function Contact() {
  const formHeadingId = useId();

  return (
    <Section id="contact">
      <Reveal variants={fadeUp} className="max-w-2xl">
        <p className="label">Contact</p>
        <h2
          id={formHeadingId}
          className="mt-3 text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold tracking-[-0.02em]"
        >
          Start a project
        </h2>
        <p className="mt-3 text-lg text-dim">
          Tell me where leads slip through today. I reply personally, and if
          Thaus isn&apos;t the right fit, I&apos;ll say so.
        </p>
      </Reveal>

      <Reveal variants={fadeUp} className="mt-10 max-w-2xl">
        <ContactForm labelledBy={formHeadingId} />
      </Reveal>
    </Section>
  );
}
