/**
 * UI-only stubs. Both forms on the site are wired to these functions instead
 * of a real backend. Point them at n8n webhooks when those are ready —
 * the fetch calls are sketched out below, just uncomment and set the env vars.
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
}

export async function subscribeNewsletter(
  payload: NewsletterPayload
): Promise<void> {
  // TODO(n8n): replace the mock delay below with a real webhook call, e.g.
  //
  // const res = await fetch(process.env.NEXT_PUBLIC_NEWSLETTER_WEBHOOK!, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(payload),
  // });
  // if (!res.ok) throw new Error("Failed to subscribe");

  void payload;
  await new Promise((resolve) => setTimeout(resolve, 700));
}
