import { PricingSection, FaqSection, CtaBand } from "@/components/marketing/pricing-faq";
import { ComparisonTable } from "@/components/marketing/comparison-table";
import { WaveDivider } from "@/components/brand/wave-divider";

export const metadata = {
  title: "Pricing — Loopline",
  description:
    "Honest pricing for the Loopline AI support chatbot. Free for one bot, $29/mo for Pro, $79/mo for Agency. No surprise overages.",
};

export default function PricingPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-loopline-rays">
        <div className="absolute inset-0 bg-loopline-navy-grid opacity-50" />
        <div className="container-loopline relative py-20 text-center lg:py-28">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-300">
            Pricing
          </p>
          <h1 className="mt-3 font-display text-5xl text-white sm:text-6xl">
            <span className="text-gradient-loopline">Pay for value,</span>
            <br />
            not for seats.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-300">
            One workspace, as many bots as your plan allows. Upgrade when your
            support volume justifies it — not when you add a teammate.
          </p>
        </div>
        <WaveDivider className="absolute inset-x-0 bottom-0" fill="text-background" />
      </section>

      <PricingSection showHeader={false} />
      <ComparisonTable />
      <FaqSection />
      <CtaBand />
    </>
  );
}
