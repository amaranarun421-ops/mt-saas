import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { WaveDivider } from "@/components/brand/wave-divider";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-loopline-rays">
      <div className="absolute inset-0 bg-loopline-navy-grid opacity-40" />
      <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <Logo variant="light" />
        <h1 className="mt-12 font-display text-[120px] leading-none text-white sm:text-[160px]">
          <span className="text-gradient-loopline">404</span>
        </h1>
        <p className="mt-4 max-w-md text-lg text-slate-300">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" withArrow>
            <Link href="/" className="group">Back home</Link>
          </Button>
          <Button asChild size="lg" variant="outlineLight">
            <Link href="/docs">Read the docs</Link>
          </Button>
        </div>
      </div>
      <WaveDivider className="absolute inset-x-0 bottom-0" fill="text-background" />
    </div>
  );
}
