import { WaveDivider } from "@/components/brand/wave-divider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, Terminal, Package, Palette, Webhook } from "lucide-react";

export const metadata = {
  title: "Docs — Loopline",
  description:
    "Install the Loopline widget on any site. Script tag, npm package, theming, webhook reference, and changelog.",
};

const SECTIONS = [
  { id: "install", label: "Install snippet" },
  { id: "npm", label: "npm package" },
  { id: "theming", label: "Widget theming" },
  { id: "api", label: "API reference" },
  { id: "webhooks", label: "Webhooks" },
  { id: "changelog", label: "Changelog" },
];

export default function DocsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-loopline-rays">
        <div className="absolute inset-0 bg-loopline-navy-grid opacity-50" />
        <div className="container-loopline relative py-16 text-center lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-300">
            Documentation
          </p>
          <h1 className="mt-3 font-display text-5xl text-white sm:text-6xl">
            <span className="text-gradient-loopline">Ship the widget</span>
            <br />
            in five minutes.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-300">
            Everything a developer needs to install, theme, and extend the
            Loopline widget on any site.
          </p>
        </div>
        <WaveDivider className="absolute inset-x-0 bottom-0" fill="text-background" />
      </section>

      <section className="bg-background py-16 lg:py-20">
        <div className="container-loopline">
          <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
            {/* Sidebar TOC */}
            <aside className="lg:sticky lg:top-20 lg:self-start">
              <nav className="rounded-2xl border border-border bg-card p-4">
                <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  On this page
                </p>
                <ul className="space-y-1">
                  {SECTIONS.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="block rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition hover:bg-accent hover:text-foreground"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            {/* Content */}
            <div className="max-w-3xl space-y-16">
              <DocSection id="install" icon={Terminal} title="Install the snippet (script tag)">
                <p>
                  The fastest way to get Loopline on your site. After creating a
                  bot in the dashboard, copy the snippet from the{" "}
                  <Link href="/dashboard" className="text-brand-500 underline-offset-4 hover:underline">
                    setup page
                  </Link>{" "}
                  and paste it anywhere in your HTML — usually just before the
                  closing <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">&lt;/body&gt;</code> tag.
                </p>
                <CodeBlock language="html">{`<script
  src="https://your-loopline-deployment.app/widget.js"
  data-bot-id="bot_abc123"
  defer
></script>`}</CodeBlock>
                <p>
                  The script injects an iframe pointing at{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">/widget/[botId]</code>{" "}
                  on your Loopline deployment. No build step on the host site,
                  no React requirement, and the widget is fully cross-origin
                  sandboxed.
                </p>
                <Checklist
                  items={[
                    "Works on WordPress, Webflow, plain HTML, and any framework",
                    "Cross-origin safe — the widget runs in a sandboxed iframe",
                    "Per-bot theming (color, avatar, welcome message) propagates instantly",
                    "Loads with `defer` so it never blocks your page",
                  ]}
                />
              </DocSection>

              <DocSection id="npm" icon={Package} title="npm package (React apps)">
                <p>
                  If your site is a React app, you can use the official
                  <code className="mx-1 rounded bg-muted px-1.5 py-0.5 font-mono text-xs">@loopline/widget</code>
                  package instead of the script tag. The package wraps the same
                  iframe but gives you a typed React component.
                </p>
                <CodeBlock language="bash">{`npm install @loopline/widget
# or
bun add @loopline/widget`}</CodeBlock>
                <CodeBlock language="tsx">{`import { LooplineWidget } from "@loopline/widget";

export default function Layout({ children }) {
  return (
    <>
      {children}
      <LooplineWidget
        botId="bot_abc123"
        src="https://your-loopline-deployment.app"
      />
    </>
  );
}`}</CodeBlock>
              </DocSection>

              <DocSection id="theming" icon={Palette} title="Widget theming">
                <p>
                  Each bot carries its own theme — primary color, avatar, and
                  welcome message. Update these from{" "}
                  <code className="mx-1 rounded bg-muted px-1.5 py-0.5 font-mono text-xs">/dashboard/bots/[id]/setup</code>{" "}
                  and the widget picks them up on the next load. The setup page
                  includes a live preview pane so you can see the widget
                  re-theme in real time as you change the color picker.
                </p>
                <p>
                  The primary color is applied to:
                </p>
                <ul className="ml-4 list-disc space-y-1 text-sm text-muted-foreground">
                  <li>The launcher button background</li>
                  <li>The header bar inside the widget</li>
                  <li>Outgoing assistant message bubbles</li>
                  <li>The "send" button and focus ring</li>
                </ul>
                <p>
                  <strong>Dark mode:</strong> the widget respects the host
                  page&apos;s <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">prefers-color-scheme</code>{" "}
                  media query automatically. No setup required.
                </p>
              </DocSection>

              <DocSection id="api" icon={Terminal} title="API reference">
                <p>
                  The widget speaks to your Loopline deployment over two
                  endpoints. Both are public (no end-user auth) but scoped to a
                  specific bot ID.
                </p>
                <ApiEndpoint
                  method="GET"
                  path="/api/widget/[botId]/config"
                  desc="Returns the bot's public config — name, avatar URL, primary color, welcome message. Used by the widget on mount."
                />
                <ApiEndpoint
                  method="POST"
                  path="/api/widget/[botId]/chat"
                  desc="Streams an assistant response. Accepts { messages, visitorId, conversationId? } and returns a text/event-stream of token deltas. Creates a new conversation if conversationId is absent."
                />
                <p>
                  All other endpoints (bot management, knowledge base,
                  conversations, billing) require an authenticated session
                  scoped to the workspace that owns the bot.
                </p>
              </DocSection>

              <DocSection id="webhooks" icon={Webhook} title="Stripe webhooks">
                <p>
                  Point your Stripe webhook at{" "}
                  <code className="mx-1 rounded bg-muted px-1.5 py-0.5 font-mono text-xs">/api/billing/webhook</code>{" "}
                  and Loopline will handle the following events:
                </p>
                <ul className="ml-4 list-disc space-y-1 text-sm text-muted-foreground">
                  <li><code className="rounded bg-muted px-1 font-mono text-xs">checkout.session.completed</code> — upgrade the workspace to the purchased plan</li>
                  <li><code className="rounded bg-muted px-1 font-mono text-xs">customer.subscription.updated</code> — sync plan + current_period_end</li>
                  <li><code className="rounded bg-muted px-1 font-mono text-xs">customer.subscription.deleted</code> — downgrade to FREE</li>
                  <li><code className="rounded bg-muted px-1 font-mono text-xs">invoice.payment_failed</code> — mark subscription as PAST_DUE</li>
                </ul>
                <p>
                  When Stripe keys aren&apos;t configured, Loopline runs in a
                  simulated billing mode — checkout sessions complete instantly
                  via the success redirect, so you can test the full upgrade
                  flow without a real Stripe account.
                </p>
              </DocSection>

              <DocSection id="changelog" icon={Terminal} title="Changelog">
                <div className="space-y-4">
                  <ChangelogItem version="1.2.0" date="Aug 2026">
                    Streaming AI responses via Server-Sent Events. Visitors now
                    see answers form in real time instead of waiting for a
                    complete response.
                  </ChangelogItem>
                  <ChangelogItem version="1.1.0" date="Jul 2026">
                    Human handoff inbox. Visitors can escalate to a human with
                    one tap; agents reply from the dashboard inbox.
                  </ChangelogItem>
                  <ChangelogItem version="1.0.0" date="Jul 2026">
                    Initial public release. Multi-bot workspaces, embeddable
                    widget, knowledge base, Stripe billing, dark mode.
                  </ChangelogItem>
                </div>
              </DocSection>

              <div className="rounded-2xl border border-brand-300 bg-brand-50 p-6 dark:bg-brand-500/10">
                <h3 className="font-display text-xl text-foreground">
                  Ready to ship?
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Create your first bot and get the install snippet in under
                  five minutes.
                </p>
                <Button asChild className="mt-4">
                  <Link href="/signup">Start free</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function DocSection({
  id,
  icon: Icon,
  title,
  children,
}: {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
          <Icon className="h-4 w-4" />
        </span>
        <h2 className="font-display text-2xl text-foreground">{title}</h2>
      </div>
      <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-muted-foreground [&_a]:text-brand-500 [&_a:hover]:underline [&_strong]:text-foreground [&_strong]:font-semibold">
        {children}
      </div>
    </section>
  );
}

function CodeBlock({
  language,
  children,
}: {
  language: string;
  children: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-navy-900">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="font-mono text-xs text-slate-400">{language}</span>
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
        </div>
      </div>
      <pre className="overflow-x-auto p-4 scrollbar-loopline">
        <code className="font-mono text-sm text-slate-200">{children}</code>
      </pre>
    </div>
  );
}

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mint-500/15 text-mint-600">
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
          <span className="text-foreground/90">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ApiEndpoint({
  method,
  path,
  desc,
}: {
  method: string;
  path: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <span className="rounded-md bg-brand-500 px-2 py-0.5 font-mono text-xs font-semibold text-white">
          {method}
        </span>
        <code className="font-mono text-sm text-foreground">{path}</code>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

function ChangelogItem({
  version,
  date,
  children,
}: {
  version: string;
  date: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-l-2 border-brand-300 pl-4">
      <div className="flex items-center gap-2">
        <span className="font-display text-base text-foreground">v{version}</span>
        <span className="text-xs text-muted-foreground">· {date}</span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{children}</p>
    </div>
  );
}
