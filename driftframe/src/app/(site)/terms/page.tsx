import { GlassPanel } from "@/components/driftframe/glass-panel";

export const metadata = {
  title: "Terms of Service — Driftframe",
};

export default function TermsPage() {
  return (
    <div>
      <section className="bg-radial-spotlight">
        <div className="driftframe-container py-14">
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated: {new Date().getFullYear()}
          </p>
        </div>
      </section>
      <section>
        <div className="driftframe-container py-12">
          <GlassPanel className="space-y-6 text-sm leading-relaxed text-muted-foreground">
            <section>
              <h2 className="font-display text-lg font-medium text-foreground">
                1. Acceptance
              </h2>
              <p className="mt-2">
                By creating an account or using Driftframe, you agree to these
                terms. If you do not agree, do not use the service.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground">
                2. Credits &amp; billing
              </h2>
              <p className="mt-2">
                Generations consume credits at the posted rate (4 credits per
                batch of 4 images). Credit packs do not expire. Subscriptions
                auto-renew monthly until canceled. Failed generations are not
                charged. Refunds are issued at our discretion for documented
                service failures.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground">
                3. Acceptable use
              </h2>
              <p className="mt-2">
                You may not use Driftframe to generate content that is illegal,
                infringing, harassing, or sexually exploitative of real
                persons. We reserve the right to suspend accounts that violate
                these rules.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground">
                4. Content ownership
              </h2>
              <p className="mt-2">
                You retain ownership of the images you generate, subject to
                your jurisdiction&apos;s rules on AI-generated works. Driftframe
                receives a limited license to display public images in the
                community gallery.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground">
                5. Service availability
              </h2>
              <p className="mt-2">
                Driftframe is provided &ldquo;as is&rdquo; without warranty of
                availability or fitness for a particular purpose. We may modify
                or discontinue features with reasonable notice.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground">
                6. Changes to these terms
              </h2>
              <p className="mt-2">
                We may update these terms from time to time. Material changes
                will be communicated via the app or email. Continued use after
                changes constitutes acceptance.
              </p>
            </section>
          </GlassPanel>
        </div>
      </section>
    </div>
  );
}
