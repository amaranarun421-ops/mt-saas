import {
  BookOpen,
  Rocket,
  KeyRound,
  Wand2,
  CreditCard,
  Code2,
  Server,
  Sparkles,
} from "lucide-react";
import { GlassPanel } from "@/components/driftframe/glass-panel";
import { GradientLink } from "@/components/driftframe/gradient-button";

export const metadata = {
  title: "Docs — Driftframe",
  description: "Everything you need to integrate Driftframe: quick start, auth, generation, billing, API reference, deployment.",
};

const SECTIONS = [
  {
    id: "quick-start",
    icon: Rocket,
    title: "Quick start",
    body: [
      "Sign up at /signup — you'll get 10 free credits, no card required.",
      "Open /dashboard, type a prompt, pick a style and aspect ratio.",
      "Click Generate. You'll get 4 variations in ~1.4 seconds.",
      "Favorite, download, or generate a variation. Toggle public to share in the gallery.",
    ],
    code: `# 1. Clone the starter
git clone https://github.com/your-org/driftframe.git
cd driftframe

# 2. Install dependencies
bun install

# 3. Set up the database
bun run db:push
bun run db:seed   # creates the demo user + showcase images

# 4. Start the dev server
bun run dev`,
  },
  {
    id: "authentication",
    icon: KeyRound,
    title: "Authentication",
    body: [
      "Driftframe uses NextAuth.js v4 with JWT sessions. Credentials (email/password) is the default; OAuth (Google, GitHub) is config-gated.",
      "Password hashes are bcrypt (12 rounds). The PrismaAdapter persists accounts/sessions to the database.",
      "The session JWT hydrates `creditsRemaining` on every request so the credit pill stays fresh.",
    ],
    code: `# .env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

# Adding OAuth is automatic — the buttons light up as soon as
# the matching env vars are present.`,
  },
  {
    id: "image-generation",
    icon: Wand2,
    title: "Image generation",
    body: [
      "POST /api/generate with { prompt, negativePrompt?, style, aspectRatio }. Requires auth + 4 credits.",
      "On success: 4 Image rows are created, credits are atomically decremented, a CreditTransaction is recorded, and the Generation is marked completed.",
      "On failure: no credits are charged. The Generation is marked failed and the API returns 500.",
      "Style presets: photographic, anime, 3d-render, painting, sketch. Aspect ratios: 1:1, 16:9, 9:16, 4:3.",
    ],
    code: `POST /api/generate
Content-Type: application/json

{
  "prompt": "A bioluminescent jellyfish over a neon skyline",
  "style": "photographic",
  "aspectRatio": "1:1"
}

# 200 OK
{
  "generationId": "clxxx...",
  "images": [
    { "id": "clxxx1...", "url": "data:image/svg+xml;base64,..." },
    { "id": "clxxx2...", "url": "data:image/svg+xml;base64,..." },
    { "id": "clxxx3...", "url": "data:image/svg+xml;base64,..." },
    { "id": "clxxx4...", "url": "data:image/svg+xml;base64,..." }
  ],
  "creditsRemaining": 96
}`,
  },
  {
    id: "credits-billing",
    icon: CreditCard,
    title: "Credits & billing",
    body: [
      "Credits are the unit of consumption. One batch-of-4 generation costs 4 credits.",
      "Credit packs: $9/50, $29/200 (most popular), $59/500. Credits never expire.",
      "Pro subscription: $19/mo, auto-refills 300 credits monthly. Cancel anytime.",
      "POST /api/credits/purchase with { packId: '50' | '200' | '500' | 'subscription' }. In production, replace the mock with Stripe Checkout.",
    ],
    code: `POST /api/credits/purchase
Content-Type: application/json

{ "packId": "200" }

# 200 OK
{
  "creditsAdded": 200,
  "creditsRemaining": 296,
  "purchaseId": "mock_pi_1234567890"
}`,
  },
  {
    id: "api-reference",
    icon: Code2,
    title: "API reference",
    body: [
      "All API routes are auth-gated via NextAuth JWT. Mutations are POST/PATCH/DELETE only.",
      "Base URL: same origin (relative paths only — never write absolute URLs in client code).",
      "Errors return { error: string } with an appropriate status code (400, 401, 402, 404, 500).",
    ],
    code: `# Auth
POST   /api/auth/signup            # { email, password, name? } → 201
POST   /api/auth/callback/credentials  # NextAuth credentials flow
POST   /api/auth/reset-password    # { email } → 200 (stub)

# Generation
POST   /api/generate               # { prompt, style, aspectRatio, ... }

# Images
PATCH  /api/images/:id             # { favorite?, isPublic? }

# Billing
POST   /api/credits/purchase       # { packId }`,
  },
  {
    id: "deployment",
    icon: Server,
    title: "Deployment",
    body: [
      "Driftframe deploys cleanly to Vercel. The SQLite database works for demos but should be swapped for Postgres in production.",
      "Set the following env vars in your Vercel project: DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, plus any OAuth credentials.",
      "Run `bun run db:push` once after the first deploy to create the schema.",
      "Optional: set OPENAI_API_KEY and uncomment the DALL·E 3 block in src/lib/ai/image-model.ts to swap the local SVG art for real generation.",
    ],
    code: `# Production env vars
DATABASE_URL=...                   # Postgres connection string
NEXTAUTH_SECRET=...                # openssl rand -base64 32
NEXTAUTH_URL=https://yourdomain.com

# Optional — enable real generation
OPENAI_API_KEY=sk-...

# Optional — enable OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

# Optional — enable real Stripe checkout
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...`,
  },
];

export default function DocsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-radial-spotlight">
        <div className="driftframe-container py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="driftframe-pill">
              <BookOpen className="h-3 w-3" />
              Documentation
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Everything you need to ship.
            </h1>
            <p className="mt-3 text-muted-foreground">
              Quick start, auth, generation, billing, API reference, and
              deployment — in one place.
            </p>
          </div>
        </div>
      </section>

      {/* Quick nav */}
      <section>
        <div className="driftframe-container py-8">
          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="inline-flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-3 text-center text-xs font-medium text-muted-foreground hover:border-[#7c3aed]/40 hover:text-foreground transition-colors min-h-[80px] justify-center"
                >
                  <s.icon className="h-5 w-5" />
                  <span>{s.title}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sections */}
      <section>
        <div className="driftframe-container py-8 pb-16">
          <div className="mx-auto max-w-3xl space-y-12">
            {SECTIONS.map((s) => (
              <div key={s.id} id={s.id} className="scroll-mt-20">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#7c3aed] text-white">
                    <s.icon className="h-4 w-4" />
                  </span>
                  <h2 className="font-display text-2xl font-semibold tracking-tight">
                    {s.title}
                  </h2>
                </div>
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                  {s.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                <pre className="mt-5 overflow-x-auto rounded-xl border border-border bg-[#0a0a0f] p-4 text-xs leading-relaxed text-zinc-200 driftframe-scroll">
                  <code>{s.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-radial-spotlight border-t border-border">
        <div className="driftframe-container py-12 text-center">
          <Sparkles className="mx-auto h-7 w-7 text-[#7c3aed]" />
          <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight">
            Ready to build?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Start with 10 free credits and the full source on GitHub.
          </p>
          <div className="mt-6 flex justify-center">
            <GradientLink href="/signup" leftIcon={<Rocket className="h-4 w-4" />}>
              Get started free
            </GradientLink>
          </div>
        </div>
      </section>
    </div>
  );
}
