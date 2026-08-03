# Scripta — AI Blog & Content Writer SaaS

A complete, production-ready Next.js 16 SaaS template for AI content generation.

Built on top of the [MIT-licensed AI Starter Kit](https://nextjstemplates.com/)
by nextjstemplates.com and elevated into a premium, complete product. See
[`CREDITS.md`](./CREDITS.md) for full attribution.

---

## What you get

| Feature | Status |
| --- | --- |
| 4 AI write modes (Blog Post, Social Caption, Email Copy, Product Description) | ✅ streaming token-by-token |
| Full NextAuth v5 flow (email/password + Google + GitHub OAuth) | ✅ email verification + rate limiting |
| Forgot / reset password | ✅ 1-hour tokens, Resend email |
| Stripe subscriptions (Free / Pro monthly / Pro annual) | ✅ checkout, webhook, customer portal |
| Plan-gated feature access (Free: blog+social, Pro: all 4) | ✅ |
| Credit system (Free: 10/mo, Pro: unlimited) | ✅ per-generation deduction |
| Saved documents with folders + tags + search | ✅ |
| Split-view document editor with "regenerate with instructions" | ✅ |
| Cmd+K command palette | ✅ quick-jump to write modes & recent docs |
| Glass-morphism dashboard sidebar | ✅ |
| Dark mode (next-themes) | ✅ across all pages |
| Skeleton loaders (no spinners) for streaming states | ✅ |
| Animated gradient border on the active / generating text card | ✅ |
| Modern scrollbar, custom dropdowns (no native `<select>`), pointer cursor everywhere | ✅ |

---

## Tech stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript 5 (strict)
- **Styling**: Tailwind CSS 4 + shadcn/ui (New York) + custom design tokens
- **Database**: SQLite via Prisma 6 ORM
- **Auth**: NextAuth v5 beta + `@auth/prisma-adapter`
- **Email**: Resend (with graceful no-op fallback in dev)
- **Payments**: Stripe (checkout, webhooks, customer portal)
- **AI**: Vercel AI SDK (`@ai-sdk/openai`, `ai`) — defaults to `gpt-4o-mini`
- **Forms**: react-hook-form + zod v4
- **Icons**: lucide-react (with a handful of inline brand SVGs)
- **Toasts**: sonner
- **Theme**: next-themes
- **Fonts**: Onest (Geist fallback)

---

## Getting started

### 1. Install dependencies

```bash
bun install   # or npm / pnpm / yarn
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in:

- `AUTH_SECRET` — generate with `openssl rand -base64 32`
- `DATABASE_URL` — defaults to a local SQLite file at `file:/home/z/my-project/db/custom.db`
- `OPENAI_API_KEY` — required for the 4 write modes to actually generate content
- `RESEND_API_KEY` + `RESEND_FROM_EMAIL` — for verification & reset emails (optional in dev; the app surfaces the verification URL inline instead)
- `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`,
  `STRIPE_PRICE_PRO_MONTHLY`, `STRIPE_PRICE_PRO_ANNUAL` — required for Pro checkout
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — set both, then set
  `NEXT_PUBLIC_GOOGLE_CONFIGURED=1` to surface the Google sign-in button
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` — same pattern as Google

### 3. Push the database schema

```bash
bun run db:push
```

This creates all the tables (users, accounts, sessions, documents, folders,
subscriptions, password_reset_tokens, verification_tokens) in SQLite.

### 4. Run the dev server

```bash
bun run dev
```

Open `http://localhost:3000` — you should see the marketing landing page.

### 5. (Optional) Test Stripe webhooks locally

In a separate terminal:

```bash
bun run stripe:listen
```

This forwards Stripe test-mode webhooks to your local
`/api/webhooks/stripe` route. Copy the printed `whsec_...` secret into
`STRIPE_WEBHOOK_SECRET`.

---

## Project structure

```
prisma/
  schema.prisma             # SQLite schema — users, accounts, sessions,
                            # documents, folders, subscriptions,
                            # password_reset_tokens, verification_tokens
src/
  app/
    (site)/                 # Marketing site
      page.tsx              # Landing page (hero, modes, features, pricing, testimonials, CTA)
      pricing/              # /pricing
      contact/              # /contact
      privacy/ terms/       # Legal
      (auth)/               # Auth pages (signin, signup, reset-password, verify-email)
    dashboard/
      layout.tsx            # Auth-gated dashboard shell (sidebar + command palette)
      page.tsx              # Overview (recent docs, stats, quick-start)
      write/[mode]/         # 4 write modes (blog/social/email/product)
      documents/            # List + editor
      documents/[id]/       # Split-view editor with regenerate
      billing/              # Plan, Stripe portal, subscription details
      settings/             # Profile, password, delete account
    api/
      auth/                 # signup, verify-email, forgot/reset-password, resend-verification
      auth/[...nextauth]/   # NextAuth handlers
      ai/[mode]/            # Streaming AI generation with credit deduction
      documents/            # CRUD for saved documents
      folders/              # CRUD for folders
      stripe/
        checkout/            # Create checkout session
        portal/              # Create customer-portal session
      webhooks/stripe/      # Stripe webhook handler
      user/credits/         # GET current credit balance
      user/profile/         # PATCH profile / password / delete account
  components/
    marketing/              # header, footer
    auth/                   # signin/signup/reset-password forms, social-auth buttons
    dashboard/              # dashboard-shell, command-palette, write-mode-client,
                            # documents-list, document-editor, billing, settings,
                            # custom-dropdown (no native select), use-streaming-generation
    ui/                     # shadcn/ui primitives
  lib/
    ai/                     # model.ts (OpenAI client), prompts.ts (4-mode system prompts)
    credits/                # deduction + monthly refresh logic
    email/                  # Resend integration
    rate-limit/             # In-memory rate limiter
    stripe/                 # PLANS config + Stripe client
    zod/                    # auth + AI-mode input schemas
  auth.ts                   # NextAuth v5 config
  proxy.ts                  # Next.js 16 proxy (was middleware.ts)
public/images/             # Real photos and SVGs (hero, tabs, benefits, users)
```

---

## Customisation

### Change the brand name

Search-and-replace `Scripta` across the repo. The most prominent places:

- `src/app/layout.tsx` — metadata title template
- `src/components/marketing/header.tsx` — header logo
- `src/components/marketing/footer.tsx` — footer logo + copy
- `src/components/dashboard/dashboard-shell.tsx` — sidebar logo
- `src/components/auth/auth-shell.tsx` — auth card logo
- `src/lib/email/index.ts` — email `from` name
- `README.md`, `CREDITS.md`

### Change the violet primary

All brand tokens live in `src/app/globals.css` under `@theme inline`:

- `--color-primary-50` through `--color-primary-800` — the violet ramp
- `--color-amber-300` — the warm accent used ONLY for credit pills
- `--background-image-gradient-2` + `.button-bg` — the gradient used on buttons and active indicators

### Swap the AI model

`src/lib/ai/model.ts`:

```ts
return openai('gpt-4o-mini');
// → return anthropic('claude-3-5-haiku');
// → return mistral('mistral-small-latest');
// etc. — any provider the Vercel AI SDK supports.
```

### Add a new write mode

1. Add a new mode to the `WriteMode` type in `src/lib/ai/prompts.ts` and a
   matching `xxxPrompt()` builder.
2. Add a zod input schema in `src/lib/zod/auth.schema.ts` and register it in
   `inputSchemaByMode`.
3. Add the mode to the `VALID_MODES` array in `src/app/api/ai/[mode]/route.ts`
   and to `MODE_CONFIG` in `src/components/dashboard/write-mode-client.tsx`.
4. Add the mode to `PLANS.free.modes` or `PLANS.pro.modes` in
   `src/lib/stripe/index.ts` to gate it.

---

## Deploying to Vercel

1. Push the repo to GitHub.
2. Import it in Vercel.
3. Set all the env vars from `.env.example` in the Vercel project settings.
4. Use a real Postgres (Neon, Supabase) by swapping `DATABASE_URL` and the
   `provider` in `prisma/schema.prisma` from `sqlite` to `postgresql`.
5. Run `bun run db:push` against the production DB once.
6. Set the Stripe webhook endpoint to `https://yourdomain.com/api/webhooks/stripe`.

---

## License

MIT. The original AI Starter Kit is also MIT-licensed. See [`LICENSE`](./LICENSE)
and [`CREDITS.md`](./CREDITS.md).
