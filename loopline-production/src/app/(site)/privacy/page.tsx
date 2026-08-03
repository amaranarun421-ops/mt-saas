import { WaveDivider } from "@/components/brand/wave-divider";

export const metadata = { title: "Privacy Policy — Loopline" };

export default function PrivacyPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-loopline-rays">
        <div className="absolute inset-0 bg-loopline-navy-grid opacity-50" />
        <div className="container-loopline relative py-16 text-center lg:py-20">
          <h1 className="font-display text-5xl text-white sm:text-6xl">
            <span className="text-gradient-loopline">Privacy Policy</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-300">
            Last updated: August 2026
          </p>
        </div>
        <WaveDivider className="absolute inset-x-0 bottom-0" fill="text-background" />
      </section>

      <section className="bg-background py-16 lg:py-20">
        <div className="container-loopline-narrow space-y-6">
          <Section title="1. Overview">
            <p>
              Loopline (&quot;we&quot;) operates an AI customer-support chatbot
              SaaS. This policy explains what data we collect, why we collect
              it, and how long we keep it. We collect the minimum needed to run
              the service and bill for it — nothing more.
            </p>
          </Section>
          <Section title="2. Data you provide">
            <ul>
              <li><strong>Account data:</strong> email, name, hashed password. Used for authentication.</li>
              <li><strong>Workspace data:</strong> the workspace name you choose at signup.</li>
              <li><strong>Bot configuration:</strong> bot name, avatar URL, primary color, welcome message.</li>
              <li><strong>Knowledge base content:</strong> the text and markdown you upload to ground AI responses.</li>
              <li><strong>Billing data:</strong> Stripe customer ID and subscription metadata. We never store your card details — Stripe does.</li>
            </ul>
          </Section>
          <Section title="3. Data your visitors provide">
            <p>
              End-users of the widget (your site visitors) generate
              conversations and messages. This content is stored on your behalf
              and is accessible only from your workspace&apos;s authenticated
              dashboard. We do not train models on visitor conversation content.
            </p>
          </Section>
          <Section title="4. Data retention">
            <p>
              Account and bot data is retained until you delete your workspace.
              Conversation data is retained for 90 days by default and can be
              purged on demand from the dashboard. Knowledge base chunks are
              deleted when you remove them from a bot.
            </p>
          </Section>
          <Section title="5. Your rights">
            <p>
              You can export or delete all data tied to your workspace at any
              time from the dashboard settings page. Email{" "}
              <a href="mailto:privacy@loopline.dev" className="text-brand-500 underline-offset-4 hover:underline">privacy@loopline.dev</a>{" "}
              for any data-subject request.
            </p>
          </Section>
          <Section title="6. Contact">
            <p>
              Questions about this policy? Email{" "}
              <a href="mailto:hello@loopline.dev" className="text-brand-500 underline-offset-4 hover:underline">hello@loopline.dev</a>.
            </p>
          </Section>
        </div>
      </section>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="font-display text-xl text-foreground">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground [&_a]:text-brand-500 [&_a:hover]:underline [&_strong]:text-foreground [&_strong]:font-semibold [&_ul]:space-y-1.5 [&_ul]:ml-4 [&_ul]:list-disc">
        {children}
      </div>
    </div>
  );
}
