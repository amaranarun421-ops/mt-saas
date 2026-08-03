# Credits & Attribution

Driftframe is built on open-source and free-to-use work. This template is
released under the MIT license.

## Base template

- **AI Starter Kit** by [nextjstemplates.com](https://nextjstemplates.com/templates/ai-starter-kit) — MIT.
  Used as a UI-pattern reference. The original Drizzle/NextAuth v5 stack was
  migrated to Next.js 16 + Prisma + NextAuth v4 for the sandbox environment.

## Fonts

- **[Clash Display](https://www.fontshare.com/fonts/clash-display)** by Indian Type Factory / Fontshare — free for personal & commercial use.
- **[Satoshi](https://www.fontshare.com/fonts/satoshi)** by Indian Type Factory / Fontshare — free for personal & commercial use.

Loaded via the Fontshare CSS API: `https://api.fontshare.com`.

## Illustrations

- **[unDraw](https://undraw.co)** by Katerina Limpitsouni — MIT-style license (free for personal & commercial use, no attribution required).
  Used (recolored to `#7c3aed`) on the auth pages and the dashboard history
  empty state only. The hand-crafted SVG scenes in
  `src/components/driftframe/illustrations.tsx` are original Driftframe work
  in the spirit of unDraw; swap in real unDraw exports if you prefer.

## Icons

- **[Lucide](https://lucide.dev)** — ISC license.

## UI primitives

- **[shadcn/ui](https://ui.shadcn.com)** (New York style) — MIT license. Built on Radix UI.

## Framework & libraries

- [Next.js](https://nextjs.org) (MIT), [React](https://react.dev) (MIT),
  [TypeScript](https://www.typescriptlang.org) (Apache-2.0),
  [Tailwind CSS](https://tailwindcss.com) (MIT),
  [Prisma](https://www.prisma.io) (Apache-2.0),
  [NextAuth.js](https://next-auth.js.org) (ISC),
  [TanStack Query](https://tanstack.com/query) (MIT),
  [Zustand](https://github.com/pmndrs/zustand) (MIT),
  [Framer Motion](https://www.framer.com/motion) (MIT),
  [bcryptjs](https://github.com/dcodeIO/bcryptjs) (BSD-3-Clause),
  [Zod](https://zod.dev) (MIT).

## Demo imagery

- **Driftframe SVG generative art** (original work) — the demo image model
  (`src/lib/ai/image-model.ts`) produces deterministic SVG art as base64 data
  URLs, varied by style preset (photographic, anime, 3D render, painting,
  sketch) and seeded by `(prompt + style + seed)`. No network, always
  renders. Swap to DALL·E 3 (or any provider) via the same file for
  production — every call site stays identical.

## Brand icons

- **Google "G" logomark** and **GitHub Octocat** — trademarked brand icons,
  reproduced as inline SVGs in `src/components/driftframe/social-auth.tsx`
  for the OAuth sign-in buttons. Their use here is functional (sign-in
  affordance); all trademarks belong to their respective owners.

---

If you ship Driftframe as a commercial product, a one-line credit
("Built with Driftframe") is appreciated but not required.
