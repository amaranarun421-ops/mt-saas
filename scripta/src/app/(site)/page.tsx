import { auth } from '@/auth';
import {
  HeroSection,
  StackSection,
  StatsSection,
  WriteModesSection,
  BentoSection,
  HowItWorksSection,
  PricingPreviewSection,
  ComparisonSection,
  TestimonialsSection,
  FaqPreviewSection,
  CtaSection,
} from '@/components/marketing/sections';
import { FeaturesGridSection } from '@/components/marketing/sections/features-grid-section';

export default async function HomePage() {
  const session = await auth();
  const isAuthed = !!session?.user;

  return (
    <>
      {/* Hero — dark plum/violet #2a1a5e with wave divider + side illustration */}
      <HeroSection isAuthed={isAuthed} />
      <StackSection />
      <WriteModesSection />
      <StatsSection />
      {/* Bento grid — modern 6-cell mixed layout */}
      <BentoSection />
      {/* New flat two-tone icon cards (v2 polish) */}
      <FeaturesGridSection />
      <HowItWorksSection />
      <PricingPreviewSection isAuthed={isAuthed} />
      <ComparisonSection />
      <TestimonialsSection />
      <FaqPreviewSection />
      <CtaSection isAuthed={isAuthed} />
    </>
  );
}
