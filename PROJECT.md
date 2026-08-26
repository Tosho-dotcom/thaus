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
- **@tsparticles** (`engine` + `react` + `slim`) — hero node-network graphic,
  desktop only (see "Hero graphic").
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
  layout.tsx          fonts, metadata, OG/Twitter cards, GA4 tag, <html>/<body> shell
  page.tsx            single-page composition: Nav > Hero > Portfolio > Contact > Newsletter > Footer
  globals.css         design tokens + Tailwind v4 theme mapping
components/
  Nav.tsx             fixed header, scroll-aware background, mobile overlay menu
  Hero.tsx            headline + CTA, hosts the particle graphic
  hero/HeroGraphic.tsx    picks the network variant per viewport / motion pref (client)
  hero/StaticNetwork.tsx  canvas network painted once — mobile + prefers-reduced-motion
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
`useReducedMotion()` and returns `StaticNetwork` (a 2D canvas drawn once) instead
of mounting tsParticles at all. Touch viewports take the same branch.

The design intent — palette, spacing scale, section copy, radii — is captured in
`source_json/thaus_website_spec.json` (342 lines) and
`source_json/thaus_hero_graphic_addon.json` (144 lines). Treat those as the brief
the implementation answers to.

## Hero graphic

`components/hero/HeroGraphic.tsx` renders a full-bleed cobalt node network in one
of two variants. The split is at **1023px** — the same `lg` boundary the veil,
the scrim and `pointer-events` in `Hero.tsx` already use. Keep them in sync; they
drifted once (the hook was at 767px) and tablets ended up with the animated field
under an unmasked veil.

**Desktop (≥1024px)** — animated tsParticles field:

- 95 particles, with density scaling normalising it across container sizes.
- Hover uses `grab` mode plus parallax; click interaction is off.
- `pauseOnBlur` and `pauseOnOutsideViewport` keep it from burning CPU off-screen.

**Mobile / touch (≤1023px)** — `StaticNetwork`, painted once to a 2D canvas:

- There is no cursor, so the grab/parallax interaction has no trigger; running the
  rAF loop would spend battery for no visible payoff. Binding it to touch-drag was
  considered and rejected — the field is full-bleed, so it would fight scrolling.
- Node count comes from canvas area (`NODE_AREA`, clamped 30–120), redrawn on resize.
- Scroll takes over as the sense of motion.

Both variants share the scroll transform: `opacity` 1 → 0.25 and `y` 0 → -40px via
`useScroll`/`useTransform`.

**The veil is the fragile part.** `.hero-veil` sits over the network to protect
copy contrast. Below `lg` it has no mask, so it covers the whole hero — and a
`backdrop-filter: blur()` of *any* radius erases the 1–2.6px nodes behind it.
Mobile therefore gets a flat tint only (`rgba(10,10,11,0.25)`, no blur); the `lg`
rule re-adds `blur(26px)` because there the mask confines it to the copy column.
The mobile scrim in `Hero.tsx` is `from-bg/40 via-transparent to-bg/40` for the
same reason — an opaque middle band swallows the network.

If the network ever looks "missing" on a phone, check the veil and the scrim
before the renderer: it renders fine, it just gets covered.

## Analytics

Google Analytics 4 (`G-D5RZMD9516`) is wired in `app/layout.tsx` using the
built-in `next/script` component with `strategy="afterInteractive"` — deliberately
not `@next/third-parties`, whose `GoogleAnalytics` component would add an
experimental dependency for the same result. The measurement ID is a public value
and is committed directly rather than read from an env var.

The site is a single page, so there are no route-change pageviews to forward.

## Known gaps

- **Forms are not wired up.** `lib/webhooks.ts` contains UI-only stubs — both
  `submitContact` and `subscribeNewsletter` just `await` a fake delay. The real
  n8n webhook calls are sketched in comments; they need
  `NEXT_PUBLIC_CONTACT_WEBHOOK` / `NEXT_PUBLIC_NEWSLETTER_WEBHOOK` env vars.
- **Portfolio has one entry** (Zynnth) and `public/portfolio/zynnth.png` is a
  placeholder pending a real screenshot.
- **Not deployed.** `thaus.co` is referenced in metadata but no hosting is set up
  in this repo. The GA4 tag is live in the code but will not report real traffic
  until the site is served from a public domain.
- **Mobile hero is verified in an iframe, not on hardware.** The 390px-wide probe
  is faithful for CSS media queries and canvas output, but perceived brightness of
  a dim cobalt network on an OLED phone at low brightness is not something it can
  confirm. Tuning knobs if it reads wrong: the tint in `app/globals.css`
  (`.hero-veil`) and the scrim stops in `components/Hero.tsx`.

## Change log

Newest first. Only changes worth remembering the reasoning for — `git log` has
the full history.

### 2026-08-03

- **`6a206a0` — hero node network now visible on mobile.** It had always been
  rendering on phones; the unmasked mobile veil's backdrop blur was erasing it,
  with a second scrim compounding it. So phones paid the full animation cost and
  saw nothing. Fixed by dropping the mobile blur, lightening the tint and scrim,
  and switching touch viewports to `StaticNetwork`. The hook's breakpoint also
  moved 767 → 1023 to match `lg`. Desktop unchanged. See "Hero graphic".
- **`9aa33fb` — Google Analytics 4 added.** See "Analytics".

### 2026-08-02

- **`4c9cb55` — this file added.**
- **`9ee2b75` — initial commit.**

## Repo conventions

- `CLAUDE.md` is a one-line include of `AGENTS.md`; put agent instructions in
  `AGENTS.md`.
- `.gitignore` is the stock create-next-app one: `node_modules/`, `.next/`,
  `.env*`, `*.tsbuildinfo`, `.vercel` are excluded. No secrets are committed.
- `.claude/settings.local.json` is local-only and stays out of the repo.
