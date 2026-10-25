import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Footer } from "@/components/Footer";
import { CtaLink } from "@/components/CtaButton";

export const metadata: Metadata = {
  title: "Page not found | Thaus",
  robots: { index: false, follow: true },
};

const shortcuts = [
  { href: "/#portfolio", label: "Selected work" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#newsletter", label: "Build Log" },
];

// Same header and footer as the legal pages, so a 404 still feels like Thaus.
export default function NotFound() {
  return (
    <>
      <header className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-6 md:px-10">
        <Link
          href="/"
          className="flex items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          aria-label="Thaus home"
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
        <section
          id="hero"
          className="mx-auto w-full max-w-[1200px] px-6 pt-20 pb-24 md:px-10 md:pt-32 md:pb-32"
        >
          <p className="label">
            <span className="text-accent">●</span> ERROR 404 · PAGE NOT FOUND
          </p>
          <h1 className="mt-6 max-w-3xl text-[clamp(2.25rem,4.5vw,3.75rem)] text-balance font-bold leading-[1.02] tracking-[-0.03em]">
            This page doesn&apos;t exist.
            <span className="block text-dim">
              The rest of the site is one click away.
              <span
                aria-hidden
                className="cursor-blink ml-2 inline-block h-[0.8em] w-[0.5em] translate-y-[0.08em] bg-accent align-middle"
              />
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-dim">
            The link may be old, or the address has a typo. Head back to the
            homepage, or tell me what you were looking for and I&apos;ll point
            you to it.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <CtaLink href="/" icon={ArrowLeft}>
              Back to homepage
            </CtaLink>
            <CtaLink href="/#contact" variant="outline" icon={ArrowRight}>
              Ask me directly
            </CtaLink>
          </div>

          <nav aria-label="Popular pages" className="mt-16 border-t border-line pt-6">
            <p className="label">Or jump to</p>
            <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
              {shortcuts.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-mono text-sm text-ink transition-colors duration-200 hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </section>
      </main>

      <Footer />
    </>
  );
}
