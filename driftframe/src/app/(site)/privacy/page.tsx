import { GlassPanel } from "@/components/driftframe/glass-panel";

export const metadata = {
  title: "Privacy Policy — Driftframe",
};

export default function PrivacyPage() {
  return (
    <div>
      <section className="bg-radial-spotlight">
        <div className="driftframe-container py-14">
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Privacy Policy
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
                1. What we collect
              </h2>
              <p className="mt-2">
                Driftframe stores the email address and (optionally) display
                name you provide at signup, along with the prompts and
                generated images you create. Passwords are stored as bcrypt
                hashes and never in plaintext.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground">
                2. How we use it
              </h2>
              <p className="mt-2">
                Your account information is used to authenticate you, persist
                your generations, and credit your account. Aggregated,
                non-identifying usage may be used to improve the product.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground">
                3. Public content
              </h2>
              <p className="mt-2">
                Images you explicitly mark as public appear in the community
                gallery alongside their prompt. Private images are visible only
                to you. You can toggle visibility at any time.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground">
                4. Third parties
              </h2>
              <p className="mt-2">
                In production, image generation is delegated to a model
                provider (e.g. OpenAI) and payments are processed by Stripe.
                Each operates under its own privacy policy. This template does
                not embed analytics or advertising trackers.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground">
                5. Your rights
              </h2>
              <p className="mt-2">
                You can request export or deletion of your account and all
                associated data at any time by contacting support. Deletion is
                irreversible.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground">
                6. Contact
              </h2>
              <p className="mt-2">
                Questions about this policy? Reach us via the contact page.
              </p>
            </section>
          </GlassPanel>
        </div>
      </section>
    </div>
  );
}
