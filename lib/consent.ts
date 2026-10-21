// Analytics consent, stored in the first-party `thaus_consent` cookie for 12
// months. Google Analytics is only loaded once this reads "accepted".

export type Consent = "accepted" | "rejected";

const COOKIE = "thaus_consent";
const MAX_AGE = 60 * 60 * 24 * 365;

/** Fired by the footer "Cookie settings" link to re-open the banner. */
export const OPEN_CONSENT_EVENT = "thaus:open-cookie-settings";
const CHANGE_EVENT = "thaus:consent-change";

export function readConsent(): Consent | null {
  const match = document.cookie.match(/(?:^|;\s*)thaus_consent=(accepted|rejected)/);
  return match ? (match[1] as Consent) : null;
}

export function writeConsent(value: Consent) {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE}=${value}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** useSyncExternalStore subscription: re-reads the cookie after writeConsent. */
export function subscribeConsent(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_EVENT, onChange);
}

export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
}

/** Removes the _ga / _ga_* cookies GA set on this host or its parent domain. */
export function clearAnalyticsCookies() {
  const names = document.cookie
    .split(";")
    .map((c) => c.split("=")[0].trim())
    .filter((name) => name === "_ga" || name.startsWith("_ga_"));
  const host = location.hostname;
  const domains = ["", host, `.${host}`, `.${host.replace(/^www\./, "")}`];
  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; Path=/${domain ? `; Domain=${domain}` : ""}`;
    }
  }
}
