"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, type LucideIcon } from "lucide-react";
import { Section } from "@/components/Section";
import { Reveal, StaggerGroup } from "@/components/Reveal";
import { CtaLink } from "@/components/CtaButton";
import { fadeUp, EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface Tier {
  id: string;
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: {
    label: string;
    icon: LucideIcon;
    variant: "filled" | "outline";
    href: string;
    external?: boolean;
  };
  badge?: string;
  highlight?: boolean;
}

const buildTiers: Tier[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    description:
      "Checklists, workflow templates, and documentation examples from real builds.",
    features: [
      "Public GitHub examples",
      "n8n workflow templates",
      "Build documentation",
    ],
    cta: {
      label: "Browse on GitHub",
      icon: ArrowUpRight,
      variant: "outline",
      href: "https://github.com/thaus-co",
      external: true,
    },
  },
  {
    id: "template",
    name: "Template",
    price: "$49",
    period: "one-time",
    description:
      "A ready-made website template plus the automation workflow and setup guide behind it.",
    features: [
      "Website template (source code)",
      "n8n workflow included",
      "Setup documentation",
      "Self-install",
    ],
    cta: {
      label: "Get started",
      icon: ArrowRight,
      variant: "outline",
      href: "#contact",
    },
  },
  {
    id: "starter",
    name: "Starter Kit",
    price: "$299–499",
    period: "one-time",
    description:
      "A complete, ready-to-deploy system — website and automation, configured and handed off.",
    features: [
      "Full website build",
      "Core automation wired (contact + notifications)",
      "Deployment included",
      "Basic documentation & handoff",
    ],
    cta: {
      label: "Get started",
      icon: ArrowRight,
      variant: "outline",
      href: "#contact",
    },
  },
  {
    id: "custom",
    name: "Custom",
    price: "$1,500–2,500",
    period: "one-time",
    description:
      "A fully custom business system — website, complete automation, CRM, and everything documented along the way.",
    features: [
      "Fully custom design & build",
      "Full automation suite (forms, reminders, CRM, newsletter)",
      "Deployment + domain setup",
      "Documented build process",
      "Priority support during build",
    ],
    cta: {
      label: "Start a project",
      icon: ArrowRight,
      variant: "filled",
      href: "#contact",
    },
    badge: "Most requested",
    highlight: true,
  },
];

// Kept for when the monthly retainer group is switched back on (see the
// commented-out block at the bottom of this file).
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const retainerTiers: Tier[] = [
  {
    id: "care",
    name: "Care",
    price: "From $149",
    period: "/mo",
    description:
      "Keep the website running smoothly — updates, backups, and monitoring.",
    features: [
      "Uptime & performance monitoring",
      "Updates & small fixes",
      "Monthly check-in report",
    ],
    cta: {
      label: "Ask about Care",
      icon: ArrowRight,
      variant: "outline",
      href: "#contact",
    },
  },
  {
    id: "automate",
    name: "Automate",
    price: "From $399",
    period: "/mo",
    description:
      "Everything in Care, plus ongoing automation monitoring and small improvements.",
    features: [
      "Everything in Care",
      "Automation monitoring & fixes",
      "Small workflow improvements monthly",
      "Priority response",
    ],
    cta: {
      label: "Ask about Automate",
      icon: ArrowRight,
      variant: "outline",
      href: "#contact",
    },
    badge: "Most popular",
    highlight: true,
  },
  {
    id: "grow",
    name: "Grow",
    price: "From $899",
    period: "/mo",
    description:
      "A hands-on partner for the system — new automations, added capacity, and a monthly strategy call.",
    features: [
      "Everything in Automate",
      "New automation built monthly",
      "Monthly strategy call",
      "Fastest priority support",
    ],
    cta: {
      label: "Ask about Grow",
      icon: ArrowRight,
      variant: "outline",
      href: "#contact",
    },
  },
];

function TierCard({
  tier,
  compact = false,
  className,
}: {
  tier: Tier;
  compact?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: EASE }}
      className={cn(
        "flex flex-col rounded-card border bg-surface transition-colors duration-250 hover:border-accent",
        tier.highlight ? "border-accent" : "border-line",
        compact ? "p-5" : "p-6",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h4
          className={cn(
            "font-display font-medium",
            compact ? "text-lg" : "text-xl"
          )}
        >
          {tier.name}
        </h4>
        {tier.badge && (
          <span className="shrink-0 rounded-tag border border-accent/30 bg-accent/10 px-2 py-1 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-accent">
            {tier.badge}
          </span>
        )}
      </div>

      {/* floor the price block so a wrapped period (e.g. "$1,500–2,500")
          doesn't push one card's body out of line with its neighbours */}
      <p
        className={cn(
          "mt-4 flex flex-wrap items-baseline gap-x-2",
          !compact && "min-h-[3.25rem]"
        )}
      >
        <span
          className={cn(
            "font-display font-bold tracking-[-0.02em]",
            compact ? "text-2xl" : "text-3xl"
          )}
        >
          {tier.price}
        </span>
        {tier.period && (
          <span className="font-mono text-xs text-dim">{tier.period}</span>
        )}
      </p>

      <p className="mt-3 text-sm leading-relaxed text-dim">
        {tier.description}
      </p>

      <ul className="mt-5 flex flex-1 flex-col gap-2.5">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <Check
              size={14}
              strokeWidth={1.5}
              className="mt-0.5 shrink-0 text-accent"
              aria-hidden
            />
            <span className="font-mono text-xs leading-relaxed text-dim">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <CtaLink
        href={tier.cta.href}
        external={tier.cta.external}
        variant={tier.cta.variant}
        size="sm"
        icon={tier.cta.icon}
        className="mt-6 w-full"
      >
        {tier.cta.label}
      </CtaLink>
    </motion.div>
  );
}

export function Pricing() {
  return (
    <Section id="pricing">
      <Reveal variants={fadeUp} className="max-w-2xl">
        <p className="label">Pricing</p>
        <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold tracking-[-0.02em]">
          Pricing
        </h2>
        <p className="mt-3 text-lg text-dim">
          Two ways to work together: a complete system, built once — or ongoing
          support to keep it running and growing.
        </p>
      </Reveal>

      {/* one-time build tiers — the primary offer */}
      <Reveal variants={fadeUp} className="mt-12">
        <p className="label">Build — one-time</p>
      </Reveal>

      <StaggerGroup className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-[0.8fr_1fr_1fr_1fr]">
        {buildTiers.map((tier) => (
          <TierCard key={tier.id} tier={tier} />
        ))}
      </StaggerGroup>

      {/* Monthly retainer group temporarily hidden. Tier data is kept in
          `retainerTiers` above — to restore, render it back here:

          <Reveal variants={fadeUp} className="mt-16 border-t border-line pt-10">
            <p className="label">Keep it running — monthly</p>
            <p className="mt-3 text-sm text-dim">
              Optional, for systems already live. Not required to work together.
            </p>
          </Reveal>

          <StaggerGroup className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {retainerTiers.map((tier) => (
              <TierCard key={tier.id} tier={tier} compact />
            ))}
          </StaggerGroup>
      */}
    </Section>
  );
}
