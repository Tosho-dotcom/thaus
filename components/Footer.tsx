"use client";

import { motion } from "framer-motion";
import { Music2, ArrowUp } from "lucide-react";
import { Section } from "@/components/Section";
import { StaggerGroup } from "@/components/Reveal";
import { GithubIcon, InstagramIcon } from "@/components/icons";
import { fadeUp } from "@/lib/motion";

const socials = [
  { label: "Instagram", href: "https://instagram.com/thaus.co", icon: InstagramIcon },
  { label: "TikTok", href: "https://tiktok.com/@thaus.co", icon: Music2 },
  { label: "GitHub", href: "https://github.com/thaus-co", icon: GithubIcon },
];

export function Footer() {
  return (
    <footer className="border-t border-line">
      <Section className="py-12 md:py-16">
        <StaggerGroup className="flex flex-col gap-10">
          <motion.div
            variants={fadeUp}
            className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center"
          >
            <div className="flex flex-col gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo/wordmark_cursor.svg"
                alt="Thaus"
                className="h-[22px] w-auto"
              />
              <p className="max-w-xs text-sm text-dim">
                Complete business systems, built in public.
              </p>
            </div>

            <div className="flex items-center gap-5">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-dim transition-colors hover:text-accent"
                >
                  <social.icon size={20} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="flex flex-col items-start justify-between gap-4 border-t border-line pt-6 sm:flex-row sm:items-center"
          >
            <p className="font-mono text-xs text-dim">
              © 2026 Thaus. Built in public.
            </p>
            <a
              href="#hero"
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.1em] text-dim transition-colors hover:text-accent"
            >
              Back to top
              <ArrowUp size={14} strokeWidth={1.5} />
            </a>
          </motion.div>
        </StaggerGroup>
      </Section>
    </footer>
  );
}
