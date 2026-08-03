# Driftframe

> Premium AI Image Generation SaaS template — light-mode-first, gradient-driven, built for Gumroad.

Driftframe turns a single prompt into four stunning image variations. Credit
packs (not lock-in subscriptions), a Pinterest-style masonry gallery with
blur-to-sharp progressive reveal, and a public showcase. Ship a polished AI
image product in an afternoon.

## What's new in v2

- **Light-mode-first** — warm `#f7f7f8` canvas, signature gradient intact. Dark mode still available via the toggle.
- **Real OAuth** — Google + GitHub providers wired up. Add `GOOGLE_CLIENT_ID` / `GITHUB_CLIENT_ID` to `.env` and the buttons light up. Without them they render disabled with a config hint.
- **Local SVG generative art** — broken picsum images replaced with a deterministic, style-aware SVG generator (`src/lib/ai/image-model.ts`). Always renders, no network.
- **Unique modern logo** — original "drift frame" SVG mark (two overlapping offset rounded rectangles, gradient-filled front + outlined back). Wordmark uses Clash Display with `frame` in gradient text. Favicon at `src/app/icon.svg`.
- **12-section landing page** — hero with browser-frame product mockup, logo cloud, bento features, gradient-text stats, 3-step flow, showcase gallery, testimonials, pricing preview, comparison table, FAQ, full-gradient CTA banner, 5-column footer.
- **Modern scrollbar** — global gradient-thumb scrollbar + dedicated `.driftframe-scroll` for scrollable lists.
- **Dropdown user menu** — shadcn `DropdownMenu` with name/email header, Settings / Billing / Theme submenu / Sign out.
- **`driftframe-container`** — consistent responsive padding (24 / 32 / 48 / 64px) across every page.
- **Unique section backgrounds** — `.bg-gradient-mesh`, `.bg-dot-grid`, `.bg-grid-lines`, `.bg-radial-spotlight`, `.bg-noise`, `.driftframe-divider`.
- **Test user auto-seeded** — `demo@driftframe.app` / `demo1234` (100 credits). Signin form pre-fills the credentials and shows a glass info banner. Auto-seeded on every visit to `/signin` and `/gallery` (idempotent — safe to wipe the DB).
- **Hydration-safe theme toggle** — stable first paint (Sun + "Toggle theme" title), dynamic only after mount.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript 5**
- **Prisma 6** + **SQLite** (swap to Postgres in production by changing the datasource)
- **NextAuth v4** — CredentialsProvider + PrismaAdapter + **real Google/GitHub OAuth** (conditional on env vars)
- **Tailwind CSS v4** + **shadcn/ui** (New York) + **Lucide** icons
- **TanStack Query**, **Zustand**, **Framer Motion** available
- **Fontshare** fonts: Clash Display (headings) + Satoshi (body)

## Features

- **Batch-of-4 generation** — every prompt returns four variations, with shimmer + gradient progress-ring placeholders and a 600ms blur-to-sharp reveal.
- **Credit-based billing** — $9 / 50, $29 / 200, $59 / 500 packs that never expire, plus an optional $19/mo subscription (300 credits/month). Mock checkout credits the account instantly; swap in Stripe for production.
- **Masonry gallery** — pure-CSS `columns` masonry (no JS lib) with glow-on-hover cards.
- **Public showcase** — opt any image into the community gallery with a single toggle. Private by default.
- **History + lightbox** — filter by style / favorites via shadcn `Select`, fullscreen viewer with keyboard nav (ESC, ←/→), "generate variation" from any image.
- **Auth** — email/password with bcrypt-hashed credentials, auto-login on signup, 10 free starting credits, Google + GitHub OAuth (config-gated).
- **Light-mode-first** — warm `#f7f7f8` canvas with the signature `#ff3d81 → #7c3aed → #3b82f6` gradient. Toggle to dark `#0a0a0f`.
- **Responsive** — mobile-first, 44px touch targets, mobile drawers for nav and the prompt sidebar.

## Getting started

```bash
bun install
bun run db:push   # create the SQLite schema
bun run db:seed   # create the demo user + 3 public showcase images (idempotent)
bun run dev       # http://localhost:3000
```

The demo user (`demo@driftframe.app` / `demo1234`, 100 credits) is also
auto-seeded on first visit to `/signin` or `/gallery` — no manual step
required.

### Test user

- Email: `demo@driftframe.app`
- Password: `demo1234`
- Credits: 100 (plus 3 seeded public showcase images)

The signin form pre-fills these credentials and shows an info banner. Just
click **Sign in**.

## Project structure

```
src/
  app/
    (site)/            # marketing + auth (site header + sticky footer)
      page.tsx         # landing — 12 sections (hero, logo cloud, bento, stats, ...)
      pricing/         # full pricing + guarantee band + FAQ
      gallery/         # public showcase
      contact/ privacy/ terms/
      signin/ signup/ reset-password/
    (dashboard)/       # app (dashboard header w/ dropdown user menu)
      dashboard/       # generation studio
      dashboard/history/ dashboard/credits/ dashboard/settings/
    api/
      auth/[...nextauth]/  auth/signup/  auth/reset-password/
      generate/        images/[id]/   credits/purchase/   user/profile/
    icon.svg           # favicon (logo mark only)
  components/
    driftframe/        # logo, gradient-button, glass-panel, credit-pill,
                       # style-chip, masonry-grid, image-card, progress-ring,
                       # shimmer-skeleton, lightbox, buy-credits-modal,
                       # social-auth, showcase-gallery, faq-accordion, ...
    layout/            # site-header, site-footer, dashboard-header, theme-toggle
    ui/                # shadcn/ui (incl. dropdown-menu, select, accordion)
  lib/
    auth.ts            # NextAuth config (Credentials + Google + GitHub)
    ai/image-model.ts  # SINGLE swap point: SVG demo ↔ DALL·E 3
    constants.ts       # credit packs, style presets, aspect ratios
    db.ts              # Prisma client
    ensure-seed.ts     # idempotent demo-user auto-seed hook
prisma/
  schema.prisma
  seed.ts              # `bun run db:seed`
```

## Going to production

### Real image generation (DALL·E 3)

The demo uses a **local SVG generative-art generator** so it runs without an
API key and renders even in sandboxed browsers. Swapping to DALL·E 3 is a
one-file change in `src/lib/ai/image-model.ts`:

```bash
bun add openai
```

```ts
// .env
OPENAI_API_KEY=sk-...
```

Uncomment the production block at the top of `generateImages()` and replace
the body — every call site stays identical. See the file's header comment
for the exact drop-in.

### Stripe billing

The mock checkout at `src/app/api/credits/purchase/route.ts` directly credits
the user. In production:

1. Replace the route body with Stripe Checkout Session creation and return
   the redirect URL.
2. Add a webhook at `/api/webhooks/stripe` (raw body parsing) that handles:
   - `checkout.session.completed` → add credits + create `CreditPurchase`
   - `invoice.payment_succeeded` (subscription) → refill 300 credits monthly
   - `customer.subscription.deleted` → mark `Subscription.status = "canceled"`
3. Set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in `.env`.

### OAuth providers

Google and GitHub providers are already wired in `src/lib/auth.ts` — they're
included conditionally based on env vars. Just add to `.env`:

```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

Set the authorized redirect URIs:
- Google: `http://localhost:3000/api/auth/callback/google`
- GitHub: `http://localhost:3000/api/auth/callback/github`

The "Continue with Google / GitHub" buttons on `/signin` and `/signup` will
light up automatically (they fetch `/api/auth/providers` on mount and disable
themselves with a config hint if the provider isn't configured).

### Database

SQLite is great for the demo. For production, switch `prisma/schema.prisma`
`datasource db` to `postgresql` and run `bun run db:push` against your
connection string.

## Environment variables

See `.env.example`. The demo only needs `DATABASE_URL` and
`NEXTAUTH_SECRET` (a dev default is provided). Add OAuth + Stripe vars to
enable those features.

## Credits

- **Fonts**: [Clash Display](https://www.fontshare.com/fonts/clash-display) &
  [Satoshi](https://www.fontshare.com/fonts/satoshi) by Fontshare (free).
- **Illustrations**: unDraw-style hand-crafted SVGs recolored to the Driftframe accent.
- **Icons**: [Lucide](https://lucide.dev) (ISC).
- **UI primitives**: [shadcn/ui](https://ui.shadcn.com) (MIT).
- **Brand icons**: Google & GitHub logomarks are inline SVGs (no icon lib).

See `CREDITS.md` for the full attribution list.

## License

MIT — ship it, sell it, fork it. Attribution appreciated but not required.
