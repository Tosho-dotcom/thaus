"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CtaLink } from "@/components/CtaButton";
import { EASE } from "@/lib/motion";

const links = [
  { label: "Work", href: "#portfolio" },
  { label: "Contact", href: "#contact" },
  { label: "Build Log", href: "#newsletter" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        scrolled
          ? "border-line bg-bg/80 backdrop-blur-md"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-6 md:px-10">
        <Link
          href="#hero"
          className="flex items-center gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          aria-label="Thaus — back to top"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo/wordmark_cursor.svg"
            alt="Thaus"
            className="h-6 w-auto"
          />
        </Link>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Primary"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group/link relative text-sm text-ink"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-200 ease-out group-hover/link:scale-x-100" />
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <CtaLink href="#contact" size="sm">
            Get in touch
          </CtaLink>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-control p-2 text-ink md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col gap-1 bg-bg px-6 py-8 md:hidden"
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="border-b border-line py-4 font-display text-lg text-ink transition-colors hover:text-accent"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-6">
              <CtaLink
                href="#contact"
                className="w-full"
                onClick={() => setMobileOpen(false)}
              >
                Get in touch
              </CtaLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
