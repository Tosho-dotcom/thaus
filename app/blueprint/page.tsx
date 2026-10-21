import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Download, FileJson } from "lucide-react";
import { Footer } from "@/components/Footer";
import { CtaLink } from "@/components/CtaButton";
import { Reveal } from "@/components/Reveal";
import { BlueprintMarkdown } from "@/components/blueprint/BlueprintMarkdown";
import { BlueprintToc, BlueprintTocMobile } from "@/components/blueprint/BlueprintToc";
import { getBlueprint, type BlueprintSection } from "@/lib/blueprint";
import { fadeUp } from "@/lib/motion";

// Unlisted: reachable by link only. Not in the nav or the sitemap, and
// marked noindex so it stays out of search results.

const blueprint = getBlueprint();

const WORKFLOW_FILE = "thaus-newsletter-signup-workflow.json";

export const metadata: Metadata = {
  title: `${blueprint.title} | Thaus`,
  description: blueprint.description,
  alternates: { canonical: "/blueprint" },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    title: blueprint.title,
    description: blueprint.description,
    url: "/blueprint",
  },
  twitter: {
    title: blueprint.title,
    description: blueprint.description,
  },
};

function DownloadCard() {
  return (
    <Reveal variants={fadeUp} className="my-8">
      <div className="flex flex-col gap-5 rounded-card border border-line bg-surface p-6 transition-colors duration-250 hover:border-accent sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control border border-line text-accent">
            <FileJson size={22} strokeWidth={1.5} aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="break-all font-mono text-sm text-ink">{WORKFLOW_FILE}</p>
            <p className="mt-1 text-sm text-dim">n8n workflow · import-ready</p>
          </div>
        </div>
        <a
          href={`/downloads/${WORKFLOW_FILE}`}
          download
          className="group/cta inline-flex shrink-0 items-center justify-center gap-2 rounded-control bg-accent px-4 py-2 font-display text-sm font-medium text-ink transition-colors duration-200 hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          Download workflow
          <Download size={18} strokeWidth={1.5} aria-hidden />
        </a>
      </div>
    </Reveal>
  );
}

/** "Want it built instead?": the offer list becomes cards, the trailing
    "→ thaus.co/#pricing" line becomes the two buttons. */
function OfferBody({ body }: { body: string }) {
  const [list, after = ""] = body.split(/^→.*$/m);
  const items = list
    .split("\n")
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2));

  return (
    <>
      <ul className="my-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item} className="flex">
            <Reveal variants={fadeUp} className="flex w-full">
              <div className="w-full rounded-card border border-line bg-surface p-5 transition-colors duration-250 hover:border-accent">
                <BlueprintMarkdown
                  overrides={{
                    p: ({ children }) => (
                      <p className="text-sm leading-relaxed text-dim">{children}</p>
                    ),
                    strong: ({ children }) => (
                      <strong className="mb-2 block font-display text-base font-medium text-ink">
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => (
                      <em className="mt-3 block font-mono text-[0.72rem] not-italic leading-relaxed text-dim">
                        {children}
                      </em>
                    ),
                  }}
                >
                  {item}
                </BlueprintMarkdown>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
      {/* buttons and the closing line move together, so the animating
          buttons never slide over static text */}
      <Reveal variants={fadeUp}>
        <div className="flex flex-wrap gap-4">
          <CtaLink href="/#pricing" icon={ArrowRight}>
            See pricing
          </CtaLink>
          <CtaLink href="/#contact" variant="outline">
            Get in touch
          </CtaLink>
        </div>
        {after.trim() && (
          <div className="mt-10">
            <BlueprintMarkdown>{after}</BlueprintMarkdown>
          </div>
        )}
      </Reveal>
    </>
  );
}

function BlueprintSectionBlock({ section }: { section: BlueprintSection }) {
  const isWorkflow = section.title.startsWith("The free workflow");
  const isOffer = section.title.startsWith("Want it built instead");

  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-heading`}
      className="mt-14 scroll-mt-10 border-t border-line pt-12 md:mt-16 md:pt-14"
    >
      <Reveal variants={fadeUp}>
        {section.number && (
          <p className="mb-3 font-mono text-xs tracking-[0.14em] text-accent">
            {section.number}
          </p>
        )}
        <h2
          id={`${section.id}-heading`}
          className="text-[clamp(1.6rem,3vw,2.25rem)] font-bold leading-[1.15] tracking-[-0.02em] text-ink"
        >
          {section.title}
        </h2>
      </Reveal>

      {isWorkflow && <DownloadCard />}

      {isOffer ? (
        <OfferBody body={section.body} />
      ) : (
        <BlueprintMarkdown>{section.body}</BlueprintMarkdown>
      )}
    </section>
  );
}

export default function BlueprintPage() {
  const toc = blueprint.sections.map(({ id, number, title }) => ({
    id,
    number,
    title,
  }));

  return (
    <>
      <header className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-6 md:px-10">
        <Link
          href="/"
          className="flex items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          aria-label="Thaus — home"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo/wordmark_cursor.svg" alt="Thaus" className="h-6 w-auto" />
        </Link>
        <CtaLink href="/#contact" size="sm" variant="outline">
          Get in touch
        </CtaLink>
      </header>

      <main className="flex flex-1 flex-col">
        <section
          id="hero"
          className="relative overflow-hidden pt-16 pb-16 md:pt-24 md:pb-20"
        >
          {/* same faint grid as the home hero */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #F4F4F2 1px, transparent 1px), linear-gradient(to bottom, #F4F4F2 1px, transparent 1px)",
              backgroundSize: "64px 64px",
              maskImage:
                "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
            }}
          />
          <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
            <div className="flex max-w-3xl flex-col gap-6">
              <p className="label">
                <span className="text-accent">●</span> THAUS · BLUEPRINT · V
                {blueprint.version}
              </p>
              <div>
                <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.03em]">
                  {blueprint.title}
                  <span
                    aria-hidden
                    className="cursor-blink ml-2 inline-block h-[0.8em] w-[0.5em] translate-y-[0.08em] bg-accent align-middle"
                  />
                </h1>
                <p className="mt-4 font-mono text-xs text-dim">
                  Version {blueprint.version} · Updated {blueprint.updated}
                </p>
              </div>
              <p className="max-w-xl text-lg leading-relaxed text-dim md:text-xl">
                {blueprint.description}
              </p>
              <p className="font-mono text-xs uppercase tracking-[0.1em] text-dim">
                By Thaus · Updated {blueprint.updated} · thaus.co
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto w-full max-w-[1200px] px-6 pb-24 md:px-10 md:pb-32">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[220px_minmax(0,760px)] lg:justify-between xl:grid-cols-[240px_minmax(0,760px)]">
            <aside className="hidden lg:block">
              <BlueprintToc items={toc} />
            </aside>

            <article className="min-w-0 max-w-[760px] text-base md:text-[1.0625rem]">
              <BlueprintTocMobile items={toc} />

              <div className="mt-8 lg:mt-0">
                <BlueprintMarkdown
                  overrides={{
                    p: ({ children }) => (
                      <p className="my-4 text-lg leading-[1.7] text-ink/90">
                        {children}
                      </p>
                    ),
                  }}
                >
                  {blueprint.intro}
                </BlueprintMarkdown>
              </div>

              {blueprint.sections.map((section) => (
                <BlueprintSectionBlock key={section.id} section={section} />
              ))}
            </article>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
