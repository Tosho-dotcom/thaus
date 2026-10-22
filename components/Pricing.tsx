"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Section } from "@/components/Section";
import { Reveal, StaggerGroup } from "@/components/Reveal";
import { CtaButton, CtaLink } from "@/components/CtaButton";
import { Input } from "@/components/ui/input";
import { fadeUp, EASE } from "@/lib/motion";
import { selectPlan, type ProjectType } from "@/lib/plan-select";
import { requestBlueprint } from "@/lib/webhooks";
import { cn } from "@/lib/utils";

const templateCheckoutUrl = process.env.NEXT_PUBLIC_TEMPLATE_CHECKOUT_URL;

interface Plan {
  id: string;
  name: string;
  price: string;
  pricePeriod?: string;
  strikePrice?: string;
  priceNote: string;
  badge?: string;
  description: string;
  featuresIntro?: string;
  features: string[];
  cta?: {
    label: string;
    variant: "filled" | "outline";
    preselect: ProjectType;
  };
  finePrint?: string;
  highlight?: boolean;
  /** Grid placement: mobile stacks Full Haus → Foundation → Blueprint,
      tablet puts Full Haus full-width on top, desktop reads left to right. */
  placement: string;
}

const plans: Plan[] = [
  {
    id: "blueprint",
    name: "Blueprint",
    price: "Free",
    priceNote: "for your email",
    description:
      "The exact blueprint behind a Thaus system — plus a ready-made n8n newsletter signup workflow.",
    features: [
      "Build document: stack, architecture, process",
      "n8n workflow: newsletter signup → database",
      "What to automate next (and how)",
    ],
    placement: "order-3 lg:order-1",
  },
  {
    id: "foundation",
    name: "Foundation",
    price: "$990",
    strikePrice: "$1,490",
    priceNote: "one-time + $29/mo hosting",
    badge: "Launch price · first 5 clients",
    description:
      "A professional website that works from day one — with the contact form and newsletter signup already automated.",
    features: [
      "Custom website (one-page or up to 5 pages)",
      "Contact form automation: notification + auto-reply",
      "Newsletter signup → subscriber database",
      "Domain connection, SSL, basic SEO, analytics",
      "Hosted and monitored on Thaus infrastructure",
      "10 days of support after launch",
      "Live in 1–2 weeks",
    ],
    cta: {
      label: "Start with Foundation",
      variant: "outline",
      preselect: "Foundation",
    },
    placement: "order-2",
  },
  {
    id: "fullhaus",
    name: "Full Haus",
    price: "$249",
    pricePeriod: "/mo",
    priceNote: "+ $1,490 one-time setup · or $2,490/year (2 months free)",
    badge: "Most complete",
    description:
      "The complete system — website, automation and AI — built, run and improved for you every month.",
    featuresIntro: "Everything in Foundation, plus:",
    features: [
      "Welcome email for new subscribers",
      "Weekly AI-written newsletter, sent from your domain",
      "Booking or business-specific automation",
      "AI chat assistant trained on your business",
      "Monthly report: leads, bookings, subscribers, chats",
      "Ongoing maintenance — up to 2 hours of changes/month",
    ],
    cta: {
      label: "Get the Full Haus",
      variant: "filled",
      preselect: "Full Haus",
    },
    finePrint: "3-month minimum, then month-to-month.",
    highlight: true,
    placement: "order-1 md:col-span-2 lg:col-span-1 lg:order-3",
  },
];

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function BlueprintForm() {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "waitlist"
  >("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim() || !validEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError(null);
    setStatus("loading");
    try {
      const { fallback } = await requestBlueprint({ email, honeypot });
      setStatus(fallback ? "waitlist" : "success");
    } catch {
      setStatus("idle");
      setError("Something went wrong. Please try again.");
    }
  }

  if (status === "success" || status === "waitlist") {
    return (
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        role="status"
        className="mt-6 text-sm leading-relaxed text-ink"
      >
        {status === "success"
          ? "Check your inbox — the Blueprint is on its way."
          : "You're on the list — the Blueprint lands in your inbox as soon as it's published."}
      </motion.p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-2">
      <label htmlFor="blueprint-email" className="sr-only">
        Email
      </label>
      <Input
        id="blueprint-email"
        type="email"
        required
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "blueprint-error" : undefined}
        className="h-9 rounded-control border-line bg-transparent px-3 text-ink placeholder:text-dim focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/40"
      />
      <p className="text-xs text-dim">
        You&apos;ll also get the weekly Build Log. Unsubscribe anytime. See our{" "}
        <Link href="/privacy" className="text-accent hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
      <input
        type="text"
        name="honeypot"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
      />
      <CtaButton
        type="submit"
        variant="outline"
        size="sm"
        icon={ArrowRight}
        disabled={status === "loading"}
        className="w-full"
      >
        {status === "loading" ? "Sending…" : "Send me the Blueprint"}
      </CtaButton>
      {error && (
        <p id="blueprint-error" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </form>
  );
}

function TemplateLine() {
  return (
    <div className="mt-5 border-t border-line pt-4">
      <a
        href="#template"
        className="group/tpl inline-flex items-start gap-1 text-sm text-ink transition-colors hover:text-accent"
      >
        Prefer a ready-made site? Get the template — $39
        <ArrowDown
          size={16}
          strokeWidth={1.5}
          className="mt-0.5 shrink-0 transition-transform duration-200 group-hover/tpl:translate-y-0.5"
          aria-hidden
        />
      </a>
    </div>
  );
}

const templateFeatures = [
  "Full React + Vite source code",
  "Forms ready to connect (any webhook)",
  "README with setup and deploy steps",
  "One website license",
];

function TemplateBar() {
  return (
    <div
      id="template"
      className="group/tpl-bar grid scroll-mt-24 grid-cols-1 gap-6 rounded-card border border-line border-t-2 border-t-accent bg-surface p-6 transition-colors duration-250 hover:border-accent md:grid-cols-2 md:gap-10"
    >
      <div>
        <a
          href="https://zynnth.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group/img relative block aspect-[16/10] overflow-hidden rounded-card border border-line bg-bg"
        >
          <Image
            src="/templates/zynnth-preview.jpg"
            alt="Zynnth site preview — the website template"
            fill
            sizes="(min-width: 1200px) 540px, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 ease-out group-hover/img:scale-[1.03]"
          />
        </a>
        <a
          href="https://zynnth.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block font-mono text-xs uppercase tracking-[0.12em] text-accent hover:underline"
        >
          Live demo ↗
        </a>
        <p className="mt-1.5 font-mono text-[0.7rem] leading-relaxed text-dim">
          Demo shows the original site. The template ships with neutral
          placeholder content (no videos).
        </p>
      </div>

      <div className="flex flex-col">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-accent">
          Template · DIY
        </p>
        <h3 className="mt-2 font-display text-xl font-medium">
          Get a ready-made site. Set it up yourself.
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-dim">
          The full source code of a real Thaus build — the Zynnth site. React
          + Vite + Tailwind, clean and documented.
        </p>

        <ul className="mt-5 flex flex-col gap-2.5">
          {templateFeatures.map((feature) => (
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

        <p className="mt-6 flex flex-wrap items-baseline gap-x-2">
          <span className="font-display text-3xl font-bold tracking-[-0.02em]">
            $39
          </span>
          <span className="font-mono text-xs text-dim">
            one-time · code only, no setup or support
          </span>
        </p>

        {templateCheckoutUrl ? (
          <CtaLink
            href={templateCheckoutUrl}
            external
            variant="filled"
            size="sm"
            icon={ArrowUpRight}
            className="mt-5 w-full sm:w-auto sm:self-start"
          >
            Buy the template
          </CtaLink>
        ) : (
          <CtaButton
            type="button"
            variant="filled"
            size="sm"
            disabled
            className="mt-5 w-full sm:w-auto sm:self-start"
          >
            Coming soon
          </CtaButton>
        )}
        <p className="mt-3 font-mono text-[0.7rem] leading-relaxed text-dim">
          $39 credited toward Foundation within 30 days.{" "}
          <Link href="/template-license" className="text-accent hover:underline">
            Template License
          </Link>{" "}
          applies.
        </p>
        <p className="mt-1.5 font-mono text-[0.7rem] leading-relaxed text-dim">
          Requires basic developer skills (Node.js, npm, deploying a site).
          Prefer it done for you? See{" "}
          <a href="#plan-foundation" className="text-accent hover:underline">
            Foundation
          </a>
          .
        </p>
      </div>
    </div>
  );
}

function PlanCard({ plan, children }: { plan: Plan; children?: ReactNode }) {
  return (
    <motion.div
      id={`plan-${plan.id}`}
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: EASE }}
      className={cn(
        "flex scroll-mt-24 flex-col rounded-card border bg-surface p-6 transition-colors duration-250 hover:border-accent",
        plan.highlight ? "border-accent" : "border-line",
        plan.placement
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-display text-xl font-medium">{plan.name}</h3>
        {plan.badge && (
          <span className="rounded-tag border border-accent/30 bg-accent/10 px-2 py-1 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-accent">
            {plan.badge}
          </span>
        )}
      </div>

      {/* floor the price block so a wrapped note (Full Haus) doesn't push
          one card's body out of line with its neighbours */}
      <div className="mt-4 lg:min-h-[5.25rem]">
        <p className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-display text-3xl font-bold tracking-[-0.02em]">
            {plan.price}
          </span>
          {plan.pricePeriod && (
            <span className="-ml-1.5 font-mono text-xs text-dim">
              {plan.pricePeriod}
            </span>
          )}
          {plan.strikePrice && (
            <span className="font-display text-lg text-dim line-through">
              <span className="sr-only">Regular price </span>
              {plan.strikePrice}
            </span>
          )}
        </p>
        <p className="mt-1.5 font-mono text-xs leading-relaxed text-dim">
          {plan.priceNote}
        </p>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-dim">
        {plan.description}
      </p>

      <div className="mt-5 flex-1">
        {plan.featuresIntro && (
          <p className="mb-3 font-mono text-xs text-ink">
            {plan.featuresIntro}
          </p>
        )}
        <ul
          className={cn(
            "flex flex-col gap-2.5",
            plan.highlight && "md:grid md:grid-cols-2 md:gap-x-6 lg:flex"
          )}
        >
          {plan.features.map((feature) => (
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
      </div>

      {plan.cta && (
        <CtaLink
          href="#contact"
          onClick={() => selectPlan(plan.cta!.preselect)}
          variant={plan.cta.variant}
          size="sm"
          icon={ArrowRight}
          className="mt-6 w-full"
        >
          {plan.cta.label}
        </CtaLink>
      )}
      {plan.finePrint && (
        <p className="mt-3 text-center font-mono text-[0.7rem] text-dim">
          {plan.finePrint}
        </p>
      )}

      {children}
    </motion.div>
  );
}

export function Pricing() {
  return (
    <Section id="pricing">
      <Reveal variants={fadeUp} className="max-w-2xl">
        <p className="label">Pricing</p>
        <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold tracking-[-0.02em]">
          From blueprint to a system that runs itself.
        </h2>
        <p className="mt-3 text-lg text-dim">
          Start free, launch a solid foundation, or get the full house —
          website, automation and AI, maintained for you.
        </p>
      </Reveal>

      <StaggerGroup className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan}>
            {plan.id === "blueprint" && (
              <>
                <BlueprintForm />
                <TemplateLine />
              </>
            )}
          </PlanCard>
        ))}
      </StaggerGroup>

      <Reveal variants={fadeUp} className="mt-6">
        <TemplateBar />
      </Reveal>

      <Reveal variants={fadeUp} className="mt-6">
        <div className="flex flex-col gap-6 rounded-card border border-line bg-surface p-6 transition-colors duration-250 hover:border-accent md:flex-row md:items-center md:justify-between md:gap-10">
          <div className="max-w-2xl">
            <p className="label">Custom</p>
            <h3 className="mt-2 font-display text-xl font-medium">
              Bigger plans? Your servers, your rules.
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-dim">
              Hosting on your own infrastructure, weekly reporting, SLA,
              integrations (CRM, payments, calendars), multiple AI agents.
              Projects from $3,000.
            </p>
          </div>
          <CtaLink
            href="#contact"
            onClick={() => selectPlan("Custom")}
            variant="outline"
            size="sm"
            icon={ArrowRight}
            className="shrink-0 self-start md:self-auto"
          >
            Book a call
          </CtaLink>
        </div>

        <p className="mt-6 font-mono text-xs text-dim">
          Prices in USD. Your domain always stays yours. Final scope confirmed
          after a short call.
        </p>
      </Reveal>
    </Section>
  );
}
