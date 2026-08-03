export const metadata = {
  title: 'Terms of Service',
  description: 'The terms under which you may use Scripta.',
};

export default function TermsPage() {
  return (
    <div className="px-6 md:px-12 lg:px-20 py-16 md:py-24 max-w-3xl">
      <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: January 2026</p>

      <div className="mt-10 space-y-8 text-foreground/90 leading-relaxed">
        <Section title="1. Acceptance">
          By creating a Scripta account, you agree to these terms. If you
          don&apos;t agree, don&apos;t use the service.
        </Section>
        <Section title="2. Acceptable use">
          You may not use Scripta to generate content that is illegal, harmful,
          harassing, or infringes on others&apos; intellectual property. We
          reserve the right to suspend accounts that violate these rules.
        </Section>
        <Section title="3. Your content">
          You retain ownership of the content you generate. By using Scripta,
          you grant us a limited license to process your prompts and store the
          resulting documents in our database, solely to operate the service.
        </Section>
        <Section title="4. Subscriptions">
          The Pro plan is billed monthly or annually through Stripe. You can
          cancel at any time from the billing portal; refunds for partial
          billing periods are issued at our discretion.
        </Section>
        <Section title="5. Service availability">
          We strive for high uptime but do not guarantee uninterrupted service.
          AI generation depends on third-party providers (OpenAI); occasional
          outages may occur.
        </Section>
        <Section title="6. Limitation of liability">
          Scripta is provided &quot;as is&quot;. We are not liable for indirect,
          incidental, or consequential damages arising from your use of the
          service.
        </Section>
        <Section title="7. Changes to these terms">
          We may update these terms from time to time. We&apos;ll notify you by
          email for material changes; continued use after the effective date
          constitutes acceptance.
        </Section>
        <Section title="8. Contact">
          Questions? Email{' '}
          <a
            href="mailto:legal@scripta.app"
            className="text-primary-600 underline"
          >
            legal@scripta.app
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
