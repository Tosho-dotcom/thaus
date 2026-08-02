# Thaus — project details

Marketing site for **Thaus**, a faceless digital product studio building complete
business systems (web + automation) and documenting the process in the open.

| | |
|---|---|
| Repository | https://github.com/Tosho-dotcom/thaus (private) |
| Default branch | `main` |
| Production domain | `https://thaus.co` (set as `metadataBase` in `app/layout.tsx`; not deployed yet) |
| Package name | `thaus` v0.1.0, `private: true` |

## Stack

- **Next.js 16.2.12** — App Router. Note `AGENTS.md`: this Next major has breaking
  changes vs. older conventions, so check `node_modules/next/dist/docs/` before
  writing framework code rather than relying on memory.
- **React 19.2.4** / **TypeScript 5** (strict, `@/*` path alias to repo root)
- **Tailwind CSS v4** via `@tailwindcss/postcss` — CSS-first config, no
  `tailwind.config.js`. All theming lives in `app/globals.css` under `@theme inline`.
- **shadcn** — `components.json` set to the `base-nova` style, `neutral` base colour,
  RSC on, lucide icons. Only `button`, `input`, `textarea` are vendored into
  `components/ui/`.
- **framer-motion 12** — scroll reveals and nav transitions.
- **@tsparticles** (`engine` + `react` + `slim`) — hero node-network graphic.
- **lucide-react** — icons.
- **@base-ui/react**, `clsx`, `tailwind-merge`, `class-variance-authority`, `tw-animate-css`.

## Commands

```bash
npm run dev     # next dev — http://localhost:3000
npm run build   # next build
npm run start   # next start (serves the production build)
npm run lint    # eslint (flat config, eslint.config.mjs)
```

## Structure

```
app/
  layout.tsx          fonts, metadata, OG/Twitter cards, <html>/<body> shell
  page.tsx            single-page composition: Nav > Hero > Portfolio > Contact > Newsletter > Footer
  globals.css         design tokens + Tailwind v4 theme mapping
components/
  Nav.tsx             fixed header, scroll-aware background, mobile overlay menu
  Hero.tsx            headline + CTA, hosts the particle graphic
  hero/HeroGraphic.tsx    interactive tsParticles network (client)
  hero/StaticNetwork.tsx  static SVG fallback for prefers-reduced-motion
  Portfolio.tsx / PortfolioCard.tsx   work grid, driven by lib/portfolio-data.ts
  Contact.tsx         contact form (name, email, company, project type, message)
  Newsletter.tsx      "Build Log" email capture
  Section.tsx         shared section wrapper (max-w-[1200px], vertical rhythm)
  Reveal.tsx          scroll-into-view animation wrapper
  CtaButton.tsx       CtaButton / CtaLink variants
  icons.tsx           inline SVG icons
  ui/                 shadcn primitives (button, input, textarea)
lib/
  motion.ts           shared easing (EASE) + fadeUp / fadeIn / staggerContainer variants
  portfolio-data.ts   PortfolioItem[] — the work list
  webhooks.ts         form submit stubs (see "Known gaps")
  utils.ts            cn() helper
public/               favicons, og.png, logo, portfolio thumbnails
source_json/          design source of truth (see below)
```

## Design system

Tokens are defined once as CSS custom properties in `app/globals.css` and exposed
to Tailwind through `@theme inline`, so `bg-bg`, `text-ink`, `border-line`,
`text-dim`, `bg-accent` etc. are real utilities. The shadcn semantic tokens
(`--color-primary`, `--color-border`, …) are remapped onto the same palette so
vendored components inherit the brand automatically.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0a0a0b` | page background |
| `--surface` | `#131316` | cards |
| `--surface-hover` | `#1a1a1f` | card hover |
| `--line` | `#26262b` | borders (default border colour for `*`) |
| `--ink` | `#f4f4f2` | primary text |
| `--dim` | `#8a8a93` | secondary text |
| `--accent` | `#3b5bff` | cobalt — CTAs, links, particle network |
| `--accent-hover` | `#2e49e0` | CTA hover |

**Type:** Space Grotesk (`--font-display`) for everything, JetBrains Mono
(`--font-mono`) for accents — both loaded via `next/font/google`.

**Radii:** `rounded-card` 12px, `rounded-control` 10px, `rounded-tag` 8px.

**Motion:** one shared easing curve `[0.22, 1, 0.36, 1]` (easeOutExpo-like) in
`lib/motion.ts`. Every reveal uses it, so timing feels consistent across sections.

**Reduced motion is a real branch, not a nicety:** `HeroGraphic` checks
`useReducedMotion()` and returns `StaticNetwork` (a plain SVG) instead of mounting
tsParticles at all.

The design intent — palette, spacing scale, section copy, radii — is captured in
`source_json/thaus_website_spec.json` (342 lines) and
`source_json/thaus_hero_graphic_addon.json` (144 lines). Treat those as the brief
the implementation answers to.

## Hero graphic

`components/hero/HeroGraphic.tsx` renders a full-bleed cobalt node network:

- Particle count adapts to viewport — 34 on mobile (≤767px), 95 on desktop — and
  tsParticles density scaling normalises it further across container sizes.
- Hover uses `grab` mode plus parallax; click interaction is off.
- `pauseOnBlur` and `pauseOnOutsideViewport` keep it from burning CPU off-screen.
- Scroll drives `opacity` 1 → 0.25 and `y` 0 → -40px via `useScroll`/`useTransform`.

## Known gaps

- **Forms are not wired up.** `lib/webhooks.ts` contains UI-only stubs — both
  `submitContact` and `subscribeNewsletter` just `await` a fake delay. The real
  n8n webhook calls are sketched in comments; they need
  `NEXT_PUBLIC_CONTACT_WEBHOOK` / `NEXT_PUBLIC_NEWSLETTER_WEBHOOK` env vars.
- **Portfolio has one entry** (Zynnth) and `public/portfolio/zynnth.png` is a
  placeholder pending a real screenshot.
- **Not deployed.** `thaus.co` is referenced in metadata but no hosting is set up
  in this repo.

## Repo conventions

- `CLAUDE.md` is a one-line include of `AGENTS.md`; put agent instructions in
  `AGENTS.md`.
- `.gitignore` is the stock create-next-app one: `node_modules/`, `.next/`,
  `.env*`, `*.tsbuildinfo`, `.vercel` are excluded. No secrets are committed.
- `.claude/settings.local.json` is local-only and stays out of the repo.
