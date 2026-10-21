import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { CtaLink } from "@/components/CtaButton";
import { BlueprintMarkdown } from "@/components/blueprint/BlueprintMarkdown";
import { getLegalDoc, type LegalSlug } from "@/lib/legal";

// Shared reading layout for the legal pages (/privacy, /terms, /cookies,
// /template-license). Same header, Markdown renderer and footer as /blueprint,
// narrowed to a single ~760px column.

export function legalMetadata(slug: LegalSlug): Metadata {
  const doc = getLegalDoc(slug);
  const title = `${doc.title} | Thaus`;
  return {
    title,
    description: doc.summary,
    alternates: { canonical: `/${slug}` },
    openGraph: { title, description: doc.summary, url: `/${slug}` },
    twitter: { title, description: doc.summary },
  };
}

export function LegalPage({ slug }: { slug: LegalSlug }) {
  const doc = getLegalDoc(slug);

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
        {/* id="hero" is the target of the footer's "Back to top" link */}
        <article
          id="hero"
          className="mx-auto w-full max-w-[calc(760px+3rem)] px-6 pt-16 pb-24 text-base md:max-w-[calc(760px+5rem)] md:px-10 md:pt-24 md:pb-32 md:text-[1.0625rem]">
          <p className="label">
            <span className="text-accent">●</span> THAUS · LEGAL
          </p>
          <h1 className="mt-6 text-[clamp(2.25rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.03em]">
            {doc.title}
          </h1>
          <p className="mt-4 font-mono text-xs text-dim">
            Last updated {doc.updated}
          </p>

          <div className="mt-10 border-t border-line pt-6">
            <BlueprintMarkdown
              overrides={{
                h1: () => null,
                h2: ({ children }) => (
                  <h2 className="mt-12 mb-4 text-[clamp(1.35rem,2.4vw,1.75rem)] font-bold leading-[1.2] tracking-[-0.02em] text-ink">
                    {children}
                  </h2>
                ),
              }}
            >
              {doc.body}
            </BlueprintMarkdown>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}
