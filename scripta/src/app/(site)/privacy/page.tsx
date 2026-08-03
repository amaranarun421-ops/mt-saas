export const metadata = {
  title: 'Privacy Policy',
  description: 'How Scripta handles your data.',
};

export default function PrivacyPage() {
  return (
    <div className="px-6 md:px-12 lg:px-20 py-16 md:py-24 max-w-3xl">
      <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: January 2026</p>

      <div className="mt-10 space-y-8 text-foreground/90 leading-relaxed">
        <Section title="1. Overview">
          Scripta is a SaaS template for AI content generation. We respect your
          privacy and only collect the data we need to operate the service. This
          policy explains what we collect, how we use it, and your rights.
        </Section>
        <Section title="2. Account information">
          When you create an account, we store your email address, name, and a
          hashed password (or a reference to your Google/GitHub OAuth account).
          We use this to authenticate you and personalise your dashboard.
        </Section>
        <Section title="3. Content you generate">
          The prompts you submit and the documents you save are stored in our
          database so you can revisit them. We do not use your content to train
          AI models. Generation requests are forwarded to OpenAI under their
          API data usage policy, which does not train on customer inputs.
        </Section>
        <Section title="4. Billing">
          Payment processing is handled by Stripe. We never see or store your
          full card number — only a Stripe customer identifier and subscription
          status. See{' '}
          <a
            href="https://stripe.com/privacy"
            target="_blank"
            rel="noreferrer"
            className="text-primary-600 underline"
          >
            Stripe&apos;s privacy policy
          </a>{' '}
          for details.
        </Section>
        <Section title="5. Cookies & sessions">
          We use a single JWT session cookie set by NextAuth. We do not use
          third-party analytics or advertising cookies.
        </Section>
        <Section title="6. Data retention">
          Your data is retained for as long as your account is active. You can
          delete your account at any time from the Settings page, which
          permanently removes all your documents, folders, and account
          information within 30 days.
        </Section>
        <Section title="7. Contact">
          Questions about privacy? Email{' '}
          <a
            href="mailto:privacy@scripta.app"
            className="text-primary-600 underline"
          >
            privacy@scripta.app
          </a>
          .
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-3 text-foreground/80">{children}</p>
    </section>
  );
}
