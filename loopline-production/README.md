# Loopline — AI Customer Support Chatbot SaaS

A premium, production-ready Next.js 16 template for an embeddable AI customer-support chatbot SaaS. Ship a real product in an afternoon — auth, billing, multi-bot workspaces, a live inbox, and a one-line embeddable widget, all wired together.

> **Built on Next.js 16 · TypeScript · Tailwind v4 · Prisma · NextAuth v4 · Stripe · Vercel AI SDK pattern**

---

## What's inside

### Marketing site
- **Landing page** — bold navy hero with wavy SVG divider, two-button CTA, flat icon-card feature grid, live widget preview, pricing section, FAQ accordion.
- **Pricing** — 3-tier plan cards (Free / Pro / Agency) with feature lists.
- **Docs** — script-tag install, npm package, widget theming, API reference, Stripe webhook guide, changelog.
- **Contact / Privacy / Terms** — ready to ship.

### Auth
- Email + password (bcrypt-hashed) with NextAuth credentials provider.
- Google + GitHub OAuth (auto-creates workspace on first login).
- Forgot-password / reset-password flow with expiring tokens.
- **Workspace name** collected at signup — one account manages multiple bots.

### Dashboard
- **Overview** — active conversations, resolution rate, usage warnings, recent activity.
- **Bots** — list with live status dots (mint-green pulse on active bots), create-bot modal.
- **Bot setup** — knowledge base upload (auto-chunked), per-bot theming with live widget preview, install snippet with copy button, npm package instructions.
- **Inbox** — two-pane conversation list + transcript, mobile collapse, needs-human filter, reply as human agent (breaks conversation out of AI mode), resolve.
- **Analytics** — 14-day volume chart, top questions, resolution rate, per-bot breakdown.
- **Billing** — 3-tier Stripe billing with usage gating, 80% warning banner, customer portal.
- **Settings** — workspace name, profile name, plan info.

### Embeddable widget
- Public iframe at `/widget/[botId]` — no end-user auth required.
- **Streaming AI responses** via Server-Sent Events.
- Per-bot theming (primary color, avatar, welcome message) propagates instantly.
- "Talk to a human" button flags conversation for handoff.
- Idle pulse ring on launcher button (Intercom/Crisp style).
- Dark mode via `prefers-color-scheme`.
- Resizes via `postMessage` so the collapsed iframe never blocks page interaction.

### Billing
- **Free** — 1 bot, 50 conversations/month.
- **Pro** ($29/mo) — 5 bots, unlimited conversations.
- **Agency** ($79/mo) — unlimited bots.
- Stripe Checkout + Customer Portal + webhook handler.
- **Simulated billing mode** — when Stripe keys aren't configured, upgrades complete instantly for local dev. Drop in your keys to go live.
- Usage gating on bot count + monthly conversations. Soft warning banner at 80%.

---

## Quick start

```bash
# 1. Install dependencies
bun install

# 2. Copy env and generate auth secret
cp .env.example .env
openssl rand -base64 32  # paste into AUTH_SECRET

# 3. Push the database schema
bun run db:push

# 4. Start the dev server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000), create an account, and you'll land in the dashboard.

---

## Installing the widget on a site

After creating a bot, copy the install snippet from **Dashboard → Bots → [bot] → Setup → Install**:

```html
<script
  src="https://your-loopline-deployment.app/widget.js"
  data-bot-id="bot_abc123"
  defer
></script>
```

Paste it anywhere in your HTML (usually before `</body>`). The widget loads as a sandboxed iframe themed to your bot's primary color. Works on WordPress, Webflow, plain HTML, or any framework.

---

## Going live with Stripe

1. Add to `.env`:
   ```
   STRIPE_SECRET_KEY="sk_live_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   STRIPE_PRICE_PRO_MONTHLY="price_..."
   STRIPE_PRICE_AGENCY_MONTHLY="price_..."
   ```
2. Create two recurring prices in Stripe (one for Pro $29/mo, one for Agency $79/mo).
3. Point your Stripe webhook at `https://your-domain.com/api/billing/webhook` with events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`

That's it — the same code paths switch from simulated to real billing automatically.

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v4 + custom design system |
| UI components | shadcn/ui (New York) + Lucide icons |
| Database | Prisma ORM (SQLite dev / Postgres prod) |
| Auth | NextAuth.js v4 (credentials + OAuth + Prisma adapter) |
| Billing | Stripe (Checkout + Customer Portal + webhooks) |
| AI | z-ai-web-dev-sdk (streaming chat completions) |
| Fonts | Archivo Black (display) + Manrope (body) |

---

## Design system

- **Primary**: royal blue ramp `#eef3ff → #10357f` (base `#1a56db`).
- **Hero navy**: `#0b0f1a` for marketing hero/CTA bands only.
- **Accent**: mint `#22c55e` — used **only** for "bot online/active" status indicators.
- **Dashboard**: cooler slate palette (functional, not flashy).
- **Shadows**: blue-tinted (`rgba(16, 53, 127, 0.06)`).
- **Motion**: message bubbles fade+slide-in (200ms), 3-dot pulsing typing indicator, idle pulse ring on widget launcher.
- **Scrollbars**: custom slim brand-tinted scrollbars everywhere.
- **Dark mode**: full support via `next-themes` across dashboard and widget.

---

## Project structure

```
src/
  app/
    (site)/              # marketing + auth pages
      (auth)/            # signin, signup, reset-password
      pricing/ docs/ contact/ privacy/ terms/
    (dashboard)/         # authenticated dashboard
      dashboard/
        bots/[id]/       # setup, inbox, analytics per bot
        inbox/ analytics/ billing/ settings/
    widget/[botId]/      # public embeddable widget (no auth)
    api/
      auth/              # NextAuth + signup + forgot/reset password
      bots/              # CRUD + knowledge base + analytics
      conversations/     # list + messages (human reply)
      widget/[botId]/    # public chat streaming + config
      billing/           # checkout + portal + webhook
      workspace/ user/   # settings
  components/
    brand/               # logo, wave divider, illustrations, theme toggle
    marketing/           # header, footer, landing sections, pricing, FAQ
    dashboard/           # sidebar, inbox view
    ui/                  # shadcn/ui components
  lib/
    auth.ts              # NextAuth config
    ai.ts                # z-ai streaming wrapper
    billing.ts           # plan definitions + usage gating
    stripe.ts            # Stripe client + simulated mode
    db.ts                # Prisma client
    utils.ts             # helpers (chunking, retrieval, formatting)
```

---

## License

MIT. See [LICENSE](./LICENSE) for details.

This template was built on top of an MIT-licensed Next.js starter kit. See [CREDITS.md](./CREDITS.md) for attribution.

All Loopline artwork (logo, illustrations, design system) is original work owned by this template project — no third-party illustration licenses are required to resell this template.
