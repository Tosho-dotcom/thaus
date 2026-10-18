# thaus

Marketing site for **Thaus**, an independent studio building complete business systems: web,
automation and AI, documented in the open.

**Live:** https://thaus.co

Single-page Next.js App Router site: `Nav → Hero → Tech stack → How it works → Portfolio →
Services → FAQ → Contact → Newsletter → Footer`, plus an AI chat assistant.

## What is behind the site

- **Contact and newsletter forms** post to self-hosted **n8n** webhooks (validation, honeypot,
  de-duplicated subscribers in Notion, auto-replies). The workflows are documented in
  [n8n-automation](https://github.com/Tosho-dotcom/n8n-automation).
- **AI chat assistant** (`components/ChatWidget.tsx` → `app/api/chat/route.ts` → n8n):
  - Next.js API route acts as a server-side gateway: origin allow-list, input validation
    (session ID format, 1–500 character messages), a 30-second upstream timeout and friendly
    fallback messages.
  - **Rate limiting** with Upstash Redis: per IP per minute, per IP per day and per session per
    day. If Redis is unavailable it fails open, because n8n applies its own caps.
  - The request is forwarded to an **n8n AI Agent** with a shared secret header. The agent runs
    on Claude with conversation memory, a lead-capture tool, response caching, a knowledge base
    and system prompt that are edited in Notion, chat logging and a dedicated error path.
  - The browser never sees the webhook URL, the secret or any model API key.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your own values
npm run dev
```

Open <http://localhost:3000>.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_CONTACT_WEBHOOK`, `NEXT_PUBLIC_NEWSLETTER_WEBHOOK` | n8n webhooks for the forms |
| `N8N_CHAT_WEBHOOK_URL`, `N8N_CHAT_SECRET` | server-side only: chat agent webhook and shared secret |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | server-side only: rate limiting |

No secrets are committed. Real values live in Vercel environment variables and in n8n's
encrypted credential store.

## Scripts

| | |
|---|---|
| `npm run dev` | dev server |
| `npm run build` | production build |
| `npm run start` | serve the production build |
| `npm run lint` | eslint (flat config) |

## Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · framer-motion ·
tsParticles · shadcn primitives · Upstash Redis · n8n · Claude · Vercel.

Tailwind v4 is CSS-first: there is no `tailwind.config.js`. All design tokens and theme mapping
live in `app/globals.css`.

## Documentation

- **`PROJECT.md`**: architecture, design tokens, the hero graphic's two render paths, analytics
  and a change log with the reasoning behind past decisions.
- **`AGENTS.md`**: rules for AI-assisted development in this repository (this Next.js major has
  breaking changes, so framework code is checked against the bundled docs).
- **`source_json/`**: the design brief the implementation answers to.
