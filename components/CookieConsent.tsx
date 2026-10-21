"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Script from "next/script";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CtaButton } from "@/components/CtaButton";
import {
  OPEN_CONSENT_EVENT,
  clearAnalyticsCookies,
  readConsent,
  subscribeConsent,
  writeConsent,
  type Consent,
} from "@/lib/consent";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

/**
 * Cookie banner + Google Analytics. GA's scripts are only rendered after the
 * visitor accepts, so nothing is requested from googletagmanager.com before
 * that. Consent Mode v2 defaults are still set (analytics granted, all ad
 * signals denied) so GA itself knows what it may do.
 */
export default function CookieConsent({ gaMeasurementId }: { gaMeasurementId: string }) {
  // undefined on the server and during hydration, so nothing renders until
  // the cookie has been read on the client
  const consent = useSyncExternalStore(subscribeConsent, readConsent, () => undefined);
  const [reopened, setReopened] = useState(false);
  const open = consent === null || reopened;
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const reopen = () => {
      setReopened(true);
      requestAnimationFrame(() =>
        document.getElementById("cookie-accept")?.focus()
      );
    };
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  const choose = (value: Consent) => {
    writeConsent(value);
    setReopened(false);

    // GA may already be running on this page from an earlier "accept"
    window[`ga-disable-${gaMeasurementId}`] = value === "rejected";
    window.gtag?.("consent", "update", {
      analytics_storage: value === "accepted" ? "granted" : "denied",
    });
    if (value === "rejected") clearAnalyticsCookies();
  };

  return (
    <>
      {consent === "accepted" && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  analytics_storage: 'granted',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied'
});
gtag('js', new Date());
gtag('config', '${gaMeasurementId}');`}
          </Script>
        </>
      )}

      <AnimatePresence>
        {open && (
          <motion.section
            aria-label="Cookie consent"
            className="fixed inset-x-0 bottom-0 z-[55] border-t border-line bg-surface p-5 shadow-[0_-8px_30px_rgba(0,0,0,0.35)] sm:inset-x-auto sm:bottom-5 sm:left-5 sm:w-[380px] sm:rounded-card sm:border sm:shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: 16 }}
            transition={{ duration: reduceMotion ? 0 : 0.3, ease: "easeOut" }}
          >
            <p className="text-sm leading-relaxed text-dim">
              We use cookies for analytics to improve the site — only if you
              agree. See our{" "}
              <Link
                href="/cookies"
                className="text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
              >
                Cookie Policy
              </Link>
              .
            </p>
            <div className="mt-4 flex gap-3">
              <CtaButton
                id="cookie-accept"
                type="button"
                size="sm"
                onClick={() => choose("accepted")}
                className="flex-1"
              >
                Accept
              </CtaButton>
              <CtaButton
                type="button"
                size="sm"
                variant="outline"
                onClick={() => choose("rejected")}
                className="flex-1"
              >
                Reject
              </CtaButton>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
