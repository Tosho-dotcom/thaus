"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  LoaderCircle,
} from "lucide-react";
import { Section } from "@/components/Section";
import { Reveal, StaggerGroup } from "@/components/Reveal";
import { CtaButton, CtaLink } from "@/components/CtaButton";
import { Input } from "@/components/ui/input";
import { fadeUp, EASE } from "@/lib/motion";
import { ContactModal, type ModalPlan } from "@/components/ContactModal";
import { requestBlueprint } from "@/lib/webhooks";
import { cn } from "@/lib/utils";

const templateCheckoutUrl = process.env.NEXT_PUBLIC_TEMPLATE_CHECKOUT_URL;

type Billing = "monthly" | "yearly";

interface PlanPrice {
  price: string;
  pricePeriod?: string;
  strikePrice?: string;
  priceNote: string;
  finePrint?: string;
}

interface Plan extends PlanPrice {
  id: string;
  name: string;
  /** Per-billing overrides; plans without one ignore the toggle. */
  billing?: Record<Billing, PlanPrice>;
  badge?: string;
  description: string;
  featuresIntro?: string;
  features: string[];
  cta?: {
    label: string;
    variant: "filled" | "outline";
    preselect: ModalPlan;
  };
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
      "The exact blueprint behind a Thaus system, plus a ready-made n8n newsletter signup workflow. Build it yourself, at your pace.",
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
    priceNote: "one-time + $29/mo hosting · launch price, first 5 clients",
    badge: "Launch price",
    description:
      "For when your site looks dated and enquiries pile up in your inbox. A new site with the contact form and newsletter signup already automated.",
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
    priceNote: "+ $1,490 one-time setup",
    billing: {
      monthly: {
        price: "$249",
        pricePeriod: "/mo",
        priceNote: "+ $1,490 one-time setup",
        finePrint: "3-month minimum, then month-to-month.",
      },
      yearly: {
        price: "$208",
        pricePeriod: "/mo",
        strikePrice: "$249",
        priceNote: "billed $2,490/year · + $1,490 one-time setup",
        finePrint: "2 months free vs. monthly billing.",
      },
    },
    badge: "Recommended",
    description:
      "For when every reply, booking and follow-up still runs through you. The complete system, built, run and improved every month.",
    featuresIntro: "Everything in Foundation, plus:",
    features: [
      "Welcome email for new subscribers",
      "Weekly AI-written newsletter, sent from your domain",
      "Booking or business-specific automation",
      "AI chat assistant trained on your business",
      "Monthly report: leads, bookings, subscribers, chats",
      "Ongoing maintenance: up to 2 hours of changes/month",
    ],
    cta: {
      label: "Get the Full Haus",
      variant: "filled",
      preselect: "Full Haus",
    },
    highlight: true,
    placement: "order-1 md:col-span-2 lg:col-span-1 lg:order-3",
  },
];

type OpenContact = (plan: ModalPlan, trigger: HTMLElement) => void;

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
        transition={{ duration: 0.3, ease: EASE }}
        role="status"
        className="mt-6 flex items-start gap-2 text-sm leading-relaxed text-ink"
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-accent"
          aria-hidden
        >
          <Check size={11} strokeWidth={2.5} />
        </motion.span>
        {status === "success"
          ? "Check your inbox. The Blueprint is on its way."
          : "You're on the list. The Blueprint lands in your inbox as soon as it's published."}
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
        icon={status === "loading" ? undefined : ArrowRight}
        disabled={status === "loading"}
        className="w-full"
      >
        {status === "loading" && (
          <LoaderCircle
            size={16}
            strokeWidth={1.5}
            className="animate-spin"
            aria-hidden
          />
        )}
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
        Prefer a ready-made site? Get the template for $39
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
      className="group/tpl-bar grid scroll-mt-24 grid-cols-1 gap-6 rounded-plan border border-line border-t-2 border-t-accent bg-surface p-6 shadow-plan transition-colors duration-250 hover:border-accent md:grid-cols-2 md:gap-10"
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
            alt="Zynnth site preview, the website template"
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
          The full source code of a real Thaus build: the Zynnth site. React
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
            variant="outline"
            size="sm"
            icon={ArrowUpRight}
            className="mt-5 w-full border-accent sm:w-auto sm:self-start"
          >
            Buy the template
          </CtaLink>
        ) : (
          <CtaButton
            type="button"
            variant="outline"
            size="sm"
            disabled
            className="mt-5 w-full border-accent sm:w-auto sm:self-start"
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

const billingOptions: { value: Billing; label: string; chip?: string }[] = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly", chip: "−17%" },
];

function BillingToggle({
  value,
  onChange,
}: {
  value: Billing;
  onChange: (value: Billing) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Full Haus billing period"
      className="inline-flex rounded-full border border-line bg-surface p-1"
    >
      {billingOptions.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-xs transition-colors duration-100",
              active ? "text-ink" : "text-dim hover:text-ink"
            )}
          >
            {active && (
              <motion.span
                layoutId="billing-pill"
                transition={{ duration: 0.3, ease: EASE }}
                className="absolute inset-0 rounded-full bg-surface-hover shadow-plan"
                aria-hidden
              />
            )}
            <span className="relative">{option.label}</span>
            {option.chip && (
              <span className="relative rounded-full bg-accent/15 px-1.5 py-0.5 text-[0.6rem] text-accent">
                {option.chip}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Rolls the amount vertically on change: up when it rises, down when it drops. */
function RollingPrice({
  value,
  direction,
}: {
  value: string;
  direction: 1 | -1;
}) {
  return (
    <span className="relative inline-flex overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        <motion.span
          key={value}
          custom={direction}
          variants={{
            enter: (d: number) => ({ y: `${d * 100}%`, opacity: 0 }),
            center: { y: 0, opacity: 1 },
            exit: (d: number) => ({ y: `${d * -100}%`, opacity: 0 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: EASE }}
          className="inline-block"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function PlanCard({
  plan,
  billing,
  direction,
  onOpenContact,
  children,
}: {
  plan: Plan;
  billing: Billing;
  direction: 1 | -1;
  onOpenContact: OpenContact;
  children?: ReactNode;
}) {
  const price = plan.billing?.[billing] ?? plan;

  return (
    <motion.div
      id={`plan-${plan.id}`}
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: EASE }}
      className={cn(
        // the lg raise uses the standalone `translate` property, so it stacks
        // with framer's hover `transform` instead of being overwritten by it
        "flex scroll-mt-24 flex-col rounded-plan border p-6 transition-colors duration-250",
        plan.highlight
          ? "border-accent bg-surface-hover shadow-plan-raised lg:-translate-y-4"
          : "border-line bg-surface shadow-plan hover:border-accent",
        plan.placement
      )}
    >
      <div className="flex min-h-6 flex-wrap items-center justify-between gap-2">
        <h3 className="font-mono text-sm uppercase tracking-[0.14em] text-dim">
          {plan.name}
        </h3>
        {plan.badge && (
          <span
            className={cn(
              "rounded-full px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.1em]",
              plan.highlight ? "bg-accent text-ink" : "border border-line text-dim"
            )}
          >
            {plan.badge}
          </span>
        )}
      </div>

      {/* floor the price block so a wrapped note (Full Haus) doesn't push
          one card's body out of line with its neighbours */}
      <div className="mt-4 lg:min-h-[6.75rem]">
        <p className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-display text-[3.25rem] leading-none font-bold tracking-[-0.03em]">
            <RollingPrice value={price.price} direction={direction} />
          </span>
          {price.pricePeriod && (
            <span className="-ml-1 font-mono text-sm text-dim">
              {price.pricePeriod}
            </span>
          )}
          {price.strikePrice && (
            <span className="font-display text-xl text-dim line-through decoration-1">
              <span className="sr-only">Regular price </span>
              {price.strikePrice}
            </span>
          )}
        </p>
        <p className="mt-2 font-mono text-xs leading-relaxed text-dim">
          {price.priceNote}
        </p>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-dim">
        {plan.description}
      </p>

      <div className="mt-6 flex-1 border-t border-line pt-5">
        {plan.featuresIntro && (
          <p className="mb-3.5 font-mono text-xs text-ink">
            {plan.featuresIntro}
          </p>
        )}
        <ul
          className={cn(
            "flex flex-col gap-3.5",
            plan.highlight && "md:grid md:grid-cols-2 md:gap-x-6 lg:flex"
          )}
        >
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5">
              <span
                className={cn(
                  "mt-px flex size-4 shrink-0 items-center justify-center rounded-full",
                  plan.highlight
                    ? "bg-accent text-ink"
                    : "bg-accent/15 text-accent"
                )}
                aria-hidden
              >
                <Check size={10} strokeWidth={2.5} />
              </span>
              <span className="font-mono text-xs leading-relaxed text-dim">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {plan.cta && (
        <CtaButton
          type="button"
          onClick={(e) => onOpenContact(plan.cta!.preselect, e.currentTarget)}
          variant={plan.cta.variant}
          size="sm"
          icon={ArrowRight}
          className="mt-6 w-full"
        >
          {plan.cta.label}
        </CtaButton>
      )}
      {price.finePrint && (
        <p className="mt-3 text-center font-mono text-[0.7rem] text-dim">
          {price.finePrint}
        </p>
      )}

      {children}
    </motion.div>
  );
}

export function Pricing() {
  const [modalPlan, setModalPlan] = useState<ModalPlan | null>(null);
  const [modalTrigger, setModalTrigger] = useState<HTMLElement | null>(null);
  const [billing, setBilling] = useState<Billing>("yearly");
  // monthly is the higher price, so switching to it rolls the digits up
  const direction = billing === "monthly" ? 1 : -1;

  const openContact: OpenContact = (plan, trigger) => {
    setModalTrigger(trigger);
    setModalPlan(plan);
  };

  return (
    <Section id="pricing">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <Reveal variants={fadeUp} className="max-w-2xl">
          <p className="label">Pricing</p>
          <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold tracking-[-0.02em]">
            From blueprint to a system that runs itself.
          </h2>
          <p className="mt-3 text-lg text-dim">
            These plans are for service businesses that already get enquiries
            and lose some to slow replies. Still looking for your first
            clients? Take the free Blueprint, because a paid build won&apos;t
            help you yet.
          </p>
        </Reveal>
        <Reveal variants={fadeUp} className="shrink-0">
          <BillingToggle value={billing} onChange={setBilling} />
        </Reveal>
      </div>

      <StaggerGroup className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            billing={billing}
            direction={direction}
            onOpenContact={openContact}
          >
            {plan.id === "blueprint" && (
              <>
                <BlueprintForm />
                <TemplateLine />
              </>
            )}
          </PlanCard>
        ))}
      </StaggerGroup>

      <Reveal variants={fadeUp} className="mt-5">
        <TemplateBar />
      </Reveal>

      <Reveal variants={fadeUp} className="mt-5">
        <div className="flex flex-col gap-6 rounded-plan border border-line bg-surface p-6 shadow-plan transition-colors duration-250 hover:border-accent md:flex-row md:items-center md:justify-between md:gap-10">
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
          <CtaButton
            type="button"
            onClick={(e) => openContact("Custom", e.currentTarget)}
            variant="outline"
            size="sm"
            icon={ArrowRight}
            className="shrink-0 self-start border-accent md:self-auto"
          >
            Book a call
          </CtaButton>
        </div>

        <p className="mt-6 font-mono text-xs text-dim">
          Prices in USD. Your domain always stays yours. Final scope confirmed
          after a short call.
        </p>
      </Reveal>

      <ContactModal
        plan={modalPlan}
        onClose={() => setModalPlan(null)}
        returnFocusTo={modalTrigger}
      />
    </Section>
  );
}
