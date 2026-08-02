"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { CtaButton } from "@/components/CtaButton";
import { Input } from "@/components/ui/input";
import { fadeUp } from "@/lib/motion";
import { subscribeNewsletter } from "@/lib/webhooks";

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success">(
    "idle"
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim() || !validEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError(null);
    setStatus("loading");
    try {
      await subscribeNewsletter({ email });
      setStatus("success");
    } catch {
      setStatus("idle");
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <Section id="newsletter" className="border-y border-line">
      <Reveal variants={fadeUp} className="mx-auto max-w-2xl text-center">
        <p className="label">Build Log</p>
        <h2 className="relative mt-3 inline-block text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold tracking-[-0.02em]">
          Build Log
          <span
            aria-hidden
            className="absolute -bottom-2 left-1/2 h-0.5 w-12 -translate-x-1/2 bg-accent"
          />
        </h2>
        <p className="mt-4 text-lg text-dim">
          A weekly email on what I built, what broke, and what&apos;s next.
          No fluff.
        </p>

        <div className="mt-8">
          {status === "success" ? (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              role="status"
              className="font-display text-lg text-ink"
            >
              You&apos;re in. First Build Log incoming.
            </motion.p>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <div className="flex-1 text-left">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email
                </label>
                <Input
                  id="newsletter-email"
                  type="email"
                  required
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "newsletter-error" : undefined}
                  className="h-11 rounded-control border-line bg-transparent px-4 text-ink placeholder:text-dim focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/40"
                />
              </div>
              <CtaButton
                type="submit"
                icon={ArrowRight}
                disabled={status === "loading"}
                className="h-11 justify-center"
              >
                {status === "loading" ? "Subscribing…" : "Subscribe"}
              </CtaButton>
            </form>
          )}
          {error && (
            <p id="newsletter-error" className="mt-2 text-xs text-destructive">
              {error}
            </p>
          )}
        </div>
      </Reveal>
    </Section>
  );
}
