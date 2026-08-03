import { WaveDivider } from "@/components/brand/wave-divider";
import { ContactForm } from "./contact-form";

export const metadata = {
  title: "Contact — Loopline",
  description: "Get in touch with the Loopline team.",
};

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-loopline-rays">
        <div className="absolute inset-0 bg-loopline-navy-grid opacity-50" />
        <div className="container-loopline relative py-16 text-center lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-300">
            Contact
          </p>
          <h1 className="mt-3 font-display text-5xl text-white sm:text-6xl">
            <span className="text-gradient-loopline">Talk to us.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-300">
            Questions about the template, custom enterprise deals, or just want
            to say hi? We usually reply within one business day.
          </p>
        </div>
        <WaveDivider className="absolute inset-x-0 bottom-0" fill="text-background" />
      </section>

      <section className="bg-background py-16 lg:py-20">
        <div className="container-loopline">
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-[1fr_240px]">
            <ContactForm />
            <aside className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Email
                </p>
                <p className="mt-1 text-sm text-foreground">hello@loopline.dev</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Response time
                </p>
                <p className="mt-1 text-sm text-foreground">Within 1 business day</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Enterprise
                </p>
                <p className="mt-1 text-sm text-foreground">
                  Custom SLAs and white-label available.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
