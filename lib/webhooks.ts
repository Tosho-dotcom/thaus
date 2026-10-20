/**
 * Form transports. Both forms post straight to their n8n webhooks; the URLs
 * come from NEXT_PUBLIC_* env vars (see .env.example).
 */

export interface ContactPayload {
  name: string;
  email: string;
  company: string;
  projectType: string;
  message: string;
  /** Honeypot: always empty for real users, filled in by bots. */
  honeypot: string;
}

export async function submitContact({
  name,
  email,
  company,
  projectType,
  message,
  honeypot,
}: ContactPayload): Promise<void> {
  const url = process.env.NEXT_PUBLIC_CONTACT_WEBHOOK;
  if (!url) throw new Error("NEXT_PUBLIC_CONTACT_WEBHOOK is not set");

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, company, projectType, message, honeypot }),
  });
  if (!res.ok) throw new Error("Failed to submit contact form");
}

export interface NewsletterPayload {
  email: string;
  /** Honeypot: always empty for real users, filled in by bots. */
  honeypot: string;
}

export async function subscribeNewsletter({
  email,
  honeypot,
}: NewsletterPayload): Promise<void> {
  const url = process.env.NEXT_PUBLIC_NEWSLETTER_WEBHOOK;
  if (!url) throw new Error("NEXT_PUBLIC_NEWSLETTER_WEBHOOK is not set");

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, honeypot }),
  });
  if (!res.ok) throw new Error("Failed to subscribe");
}

/**
 * Blueprint request from the pricing section. Posts to the dedicated Blueprint
 * webhook when it is configured; until that workflow exists, falls back to the
 * newsletter webhook. Resolves to true when the fallback was used, so the UI
 * can tell the visitor the Blueprint is not published yet.
 */
export async function requestBlueprint({
  email,
  honeypot,
}: NewsletterPayload): Promise<{ fallback: boolean }> {
  const blueprintUrl = process.env.NEXT_PUBLIC_BLUEPRINT_WEBHOOK;
  if (!blueprintUrl) {
    await subscribeNewsletter({ email, honeypot });
    return { fallback: true };
  }

  const res = await fetch(blueprintUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, honeypot, source: "blueprint" }),
  });
  if (!res.ok) throw new Error("Failed to request the Blueprint");
  return { fallback: false };
}
