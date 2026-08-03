import {
  LandingHero,
  LandingLogoBar,
  LandingStats,
  LandingFeatures,
  LandingSteps,
  LandingCodePreview,
  LandingAiBand,
  LandingDisqualifier,
} from "@/components/marketing/landing-sections";
import { PricingSection, FaqSection, CtaBand } from "@/components/marketing/pricing-faq";
import { TestimonialsMarquee } from "@/components/marketing/testimonials-marquee";
import { ComparisonTable } from "@/components/marketing/comparison-table";
import { ChangelogSection } from "@/components/marketing/changelog";

export default function HomePage() {
  return (
    <>
      <LandingHero />
      <LandingLogoBar />
      <LandingFeatures />
      <LandingStats />
      <LandingAiBand />
      <LandingSteps />
      <LandingCodePreview />
      <TestimonialsMarquee />
      <PricingSection />
      <ComparisonTable />
      <LandingDisqualifier />
      <FaqSection />
      <ChangelogSection />
      <CtaBand />
    </>
  );
}
