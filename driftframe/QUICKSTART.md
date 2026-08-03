# Quickstart

1. **Install dependencies**
   ```bash
   bun install
   ```

2. **Set up the database**
   ```bash
   bun run db:push     # create SQLite schema
   bun run db:seed     # seed demo user + showcase images (idempotent)
   ```

3. **Run the dev server**
   ```bash
   bun run dev
   ```

4. **Open http://localhost:3000**

5. **Sign in** — go to `/signin`. The test credentials are pre-filled:
   - Email: `demo@driftframe.app`
   - Password: `demo1234`
   - Just click **Sign in**.

## What's in the box

- 25 pages (11 marketing + 3 auth + 11 dashboard)
- NextAuth (Credentials + Google/GitHub OAuth, config-gated)
- Prisma schema (User, Generation, Image, CreditTransaction, CreditPurchase, Subscription)
- AI image generation (SVG demo by default; DALL·E 3 swap documented in `src/lib/ai/image-model.ts`)
- Mock Stripe billing (credit packs + subscription; production swap documented)
- Light-mode-first design with signature gradient
- Responsive, mobile-first, 44px touch targets

## Going to production

See `README.md` → "Going to production" for:
- DALL·E 3 swap (one file)
- Stripe Checkout + webhook setup
- Google/GitHub OAuth env vars
- Postgres swap (one line in `prisma/schema.prisma`)

## Test user

Auto-seeded on first visit to `/signin`. Reset anytime with `bun run db:reset && bun run db:seed`.
