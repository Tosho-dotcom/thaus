/**
 * Form transports. The newsletter posts straight to its n8n webhook; the
 * contact form is still a UI-only stub — point it at a webhook when that
 * workflow is ready, the fetch call is sketched out below.
 */

export interface ContactPayload {
  name: string;
  email: string;
  company: string;
  projectType: string;
  message: string;
}

export async function submitContact(payload: ContactPayload): Promise<void> {
  // TODO(n8n): replace the mock delay below with a real webhook call, e.g.
  //
  // const res = await fetch(process.env.NEXT_PUBLIC_CONTACT_WEBHOOK!, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(payload),
  // });
  // if (!res.ok) throw new Error("Failed to submit contact form");

  void payload;
  await new Promise((resolve) => setTimeout(resolve, 900));
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
