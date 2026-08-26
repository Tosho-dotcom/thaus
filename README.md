# thaus

Marketing site for **Thaus** — a faceless digital product studio building complete
business systems (web + automation) and documenting the process in the open.

Single-page Next.js App Router site: `Nav → Hero → Portfolio → Contact → Newsletter → Footer`.

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Scripts

| | |
|---|---|
| `npm run dev` | dev server |
| `npm run build` | production build |
| `npm run start` | serve the production build |
| `npm run lint` | eslint (flat config) |

## Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 ·
framer-motion · tsParticles · shadcn primitives.

Tailwind v4 is CSS-first — there is no `tailwind.config.js`. All design tokens and
theme mapping live in `app/globals.css`.

## Before you change anything

- **`AGENTS.md`** — this Next.js major has breaking changes versus older
  conventions. Check `node_modules/next/dist/docs/` before writing framework code
  instead of relying on memory. `CLAUDE.md` is a one-line include of this file.
- **`PROJECT.md`** — the real documentation: architecture, design tokens, the hero
  graphic's two render paths and the veil pitfall behind them, analytics setup,
  known gaps, and a change log with the reasoning behind past decisions.
- **`source_json/`** — the design brief the implementation answers to.

## Status

Not deployed yet. `thaus.co` is set as `metadataBase` in `app/layout.tsx` but no
hosting is configured in this repo, and the contact and newsletter forms are
UI-only stubs. See "Known gaps" in `PROJECT.md`.
