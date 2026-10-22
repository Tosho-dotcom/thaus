---
title: The Thaus Blueprint
description: How a complete business system is built — website, automation, data and AI — plus a ready-to-import newsletter signup workflow.
version: 1.0
updated: 2026-10
---

# The Thaus Blueprint

Most small businesses don't need "a website". They need a system: a website that captures people, an automation layer that does something useful with them, a place where the data lives, and a few emails that go out without anyone remembering to send them.

This Blueprint shows exactly how Thaus builds that system. It is the same structure behind thaus.co and every Thaus client build. Take it, use it, build it yourself. If you'd rather have it built for you, that's what Thaus does.

**What's inside**

1. The architecture — five parts, one system
2. The stack and what it actually costs
3. How a build runs, step by step
4. The free workflow: newsletter signup (import-ready)
5. Lessons from real builds
6. What to automate next
7. Security and reliability checklist

---

## 1. The architecture — five parts, one system

```
Visitor → Website → Automation server → Database
                         ↓
                  Email  +  AI
```

| Part | Job | What Thaus uses |
|---|---|---|
| **Website** | Show the offer, capture the visitor (forms, booking, chat) | Next.js, deployed on Vercel |
| **Automation server** | Receive form data, decide what happens next, connect everything | n8n (self-hosted) |
| **Database** | Store subscribers, leads, bookings — somewhere you can actually read | Notion |
| **Email** | Confirmations, replies, newsletters | SMTP or an email service (Resend, Brevo) |
| **AI** | Write newsletters, answer visitors, summarise reports | Claude (Anthropic API) |

The important idea: **the website never does the business logic.** A form only sends data to one address (a webhook). Everything after that — saving, checking duplicates, sending emails, notifying you — happens on the automation server. That keeps the website fast and simple, and lets you change the process without touching the site.

---

## 2. The stack and what it actually costs

For one small business with normal traffic. Prices change — treat these as orientation, not quotes.

| Part | Typical monthly cost | Notes |
|---|---|---|
| Hosting (Vercel) | $0–20 | The free Hobby plan is for personal, non-commercial projects. A business site belongs on Pro. |
| Automation (n8n self-hosted) | ~$5–15 | The software is free to self-host; you pay for a small server (VPS). |
| Database (Notion) | $0 | The free plan is enough to start. |
| Email | $0 to start | Free tiers exist (e.g. Resend: 3,000/month, max 100/day; Brevo: 300/day). Larger lists need a paid plan. |
| AI (Claude API) | A few dollars | Pay per use. Set a monthly spending limit from day one. |
| Domain | ~$1–2 (paid yearly) | Always registered in the business owner's name. |

**The real cost isn't the tools. It's the hours** — setting it up, fixing the edge cases, and keeping it running.

---

## 3. How a build runs, step by step

**1. Brief.** Write down, in plain words: who the visitor is, what you want them to do (book, buy, ask, subscribe), and what should happen after they do it. If you can't describe the "after", you don't need automation yet.

**2. Map the flow.** One line per step. Example:
`Form submitted → save to database → email the customer → notify the owner`.

**3. Build the data first.** Create the database with exactly the fields the flow needs (email, status, dates). Name fields clearly — you'll reference them everywhere.

**4. Build the automation.** One workflow per job. Start with the trigger (webhook), then validation, then storage, then emails.

**5. Build the website.** Forms send JSON to the webhook. Nothing else.

**6. Test like a stranger.** Wrong email, empty fields, double submits, the same person twice, mobile keyboard, a bot filling the hidden field.

**7. Launch, then document.** Write down what each workflow does and where its data lives. Future-you will need it.

---

## 4. The free workflow: newsletter signup

**File:** `thaus-newsletter-signup-workflow.json` — download: [thaus.co/downloads/thaus-newsletter-signup-workflow.json](https://thaus.co/downloads/thaus-newsletter-signup-workflow.json)

### What it does

1. Receives `{ email, honeypot }` from your website form.
2. Drops bots: if the hidden `honeypot` field is filled, nothing happens.
3. Checks your Notion database — if the email already exists, it stops (no duplicates).
4. Creates a new subscriber with **Status = Subscribed** and today's date.
5. Replies to the website so the form can show "You're in."

What it **doesn't** do: send a welcome email, send newsletters, or handle unsubscribes. See section 6.

### Setup (about 20 minutes)

**A. Notion database**

1. Create a database called e.g. *Newsletter* with these properties:
    - `Title` (default title)
    - `Email` (email)
    - `Status` (select, with options **Subscribed** and **Unsubscribed**)
    - `Date subscribed` (date)
    - `Date unsubscribed` (date)
2. Create a Notion integration (notion.so/my-integrations) and copy its token.
3. On the database page: **⋯ → Connections →** add your integration. *(Forgetting this step is the #1 reason n8n "can't find" a database.)*

**B. n8n**

1. Import the workflow: new workflow → **⋯ → Import from file**.
2. Create a **Notion API** credential with your integration token.
3. In both Notion nodes: select the credential and pick your database from the list.
4. In the **Webhook** node → *Options → Allowed Origins (CORS)*: enter your site's address. **Add both versions** — `https://yourdomain.com,https://www.yourdomain.com` (plus `http://localhost:3000` while testing).
5. Save and **activate**. Copy the **Production URL** of the webhook.

**C. Website form**

Add a hidden honeypot field and send JSON:

```html
<input type="text" name="honeypot" tabindex="-1" autocomplete="off"
       style="position:absolute;left:-9999px" aria-hidden="true">
```

```js
await fetch("YOUR_WEBHOOK_PRODUCTION_URL", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, honeypot }),
});
```

Keep the URL in an environment variable, not hardcoded.

**D. Test**
Subscribe with your own email → a new row appears in Notion. Subscribe again with the same email → no second row.

---

## 5. Lessons from real builds

These cost real hours on Thaus builds. Now they don't have to cost yours.

- **`www` vs no `www` breaks forms.** The browser treats `yourdomain.com` and `www.yourdomain.com` as different origins. If CORS only allows one, the form fails with a CORS error in the browser console — and n8n never even sees the request.
- **"It doesn't work" is often cache.** After deploying, browsers can keep the old JavaScript. Hard refresh (Ctrl/Cmd + Shift + R) before you debug anything.
- **New Notion databases are invisible to integrations** until you add the connection on that page.
- **Sending from Gmail needs an App Password** (requires 2-step verification), not your normal password. Fine for a few notifications; not for newsletters.
- **Business emails should come from the business domain.** Newsletters sent from a personal Gmail look unprofessional and land in spam.
- **AI that "says" it did something hasn't necessarily done it.** If an AI agent saves leads through a tool, instruct it to confirm only after the tool returns success.
- **Free hosting plans often exclude commercial use.** Check before a client site goes live.

---

## 6. What to automate next

Each of these builds on the same architecture. All of them are part of Thaus builds.

| Automation | What it does | Thaus plan |
|---|---|---|
| **Contact form + auto-reply** | Notifies the owner, replies to the sender instantly | Foundation |
| **Welcome email** | First impression the moment someone subscribes | Full Haus |
| **Weekly AI newsletter** | Writes and sends a weekly email from your domain, on schedule | Full Haus |
| **Unsubscribe flow** | One-click unsubscribe that updates the database | Full Haus |
| **Booking system** | Request → confirmation → reminder → review request | Full Haus |
| **AI chat assistant** | Answers visitors from your own knowledge base and captures leads | Full Haus |
| **Monthly report** | Leads, bookings, subscribers and chat insights in one email | Full Haus |

---

## 7. Security and reliability checklist

- [ ] Every public form has a honeypot field.
- [ ] Webhooks only accept your own domains (CORS) — or sit behind a server-side route with a secret header.
- [ ] Secrets (API keys, webhook secrets) live in environment variables, never in front-end code or Git.
- [ ] Rate limits on anything that costs money (AI chat, emails).
- [ ] A monthly spending limit on every AI account.
- [ ] Nobody outside your team has access to the automation editor.
- [ ] Every email list has a working unsubscribe link.
- [ ] Customers' personal data is only collected when needed — and you can explain where it's stored.

---

## Want it built instead?

- **Template — $39.** The full website code from a real Thaus build. Code only, set it up yourself. *($39 is credited toward Foundation within 30 days.)*
- **Foundation — from $990.** A professional website with the contact form and newsletter signup automated. Hosted and monitored for $29/month.
- **Full Haus — $249/month + setup.** The complete system: AI newsletter, booking, AI chat assistant, monthly reports, ongoing maintenance.
- **Custom.** Your own servers, integrations, SLA — book a call.

→ **thaus.co/#pricing**

*Built in public. Follow the build on Instagram and TikTok @thaus.co, or in the weekly Build Log.*
