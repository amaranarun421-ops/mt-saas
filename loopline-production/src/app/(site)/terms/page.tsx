import { WaveDivider } from "@/components/brand/wave-divider";

export const metadata = { title: "Terms of Service — Loopline" };

export default function TermsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-loopline-rays">
        <div className="absolute inset-0 bg-loopline-navy-grid opacity-50" />
        <div className="container-loopline relative py-16 text-center lg:py-20">
          <h1 className="font-display text-5xl text-white sm:text-6xl">
            <span className="text-gradient-loopline">Terms of Service</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-300">
            Last updated: August 2026
          </p>
        </div>
        <WaveDivider className="absolute inset-x-0 bottom-0" fill="text-background" />
      </section>

      <section className="bg-background py-16 lg:py-20">
        <div className="container-loopline-narrow space-y-6">
          {[
            ["1. Acceptance of terms", "By creating a Loopline workspace you agree to these terms. If you are using Loopline on behalf of a company, you represent that you have authority to bind that company."],
            ["2. Acceptable use", "You agree not to use Loopline to process protected health information, payment data, or any content that violates applicable law. You are responsible for the knowledge base content you upload and for the conversations your visitors generate."],
            ["3. Plans and billing", "Paid plans are billed monthly in advance via Stripe. Usage limits (bot count, conversation count) are enforced per plan. Plans can be upgraded or downgraded at any time; downgrades take effect at the end of the current billing period."],
            ["4. Refunds", "Refunds are handled case-by-case. If you are unhappy with a paid plan within 7 days of upgrading, email hello@loopline.dev and we will make it right."],
            ["5. Service availability", "Loopline is provided on an as-is basis. We target 99.9% uptime but do not warrant uninterrupted operation. The Pro and Agency plans include priority support."],
            ["6. Termination", "You can delete your workspace at any time from the dashboard. We reserve the right to suspend accounts that violate these terms."],
            ["7. Changes to terms", "We may update these terms with reasonable notice. Continued use after the effective date constitutes acceptance."],
            ["8. Contact", "Questions? Email hello@loopline.dev."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display text-xl text-foreground">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
