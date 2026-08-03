import { notFound } from 'next/navigation';
import { WriteModeClient } from '@/components/dashboard/write-mode-client';

const VALID_MODES = ['blog', 'social', 'email', 'product'] as const;
type Mode = (typeof VALID_MODES)[number];

export function generateStaticParams() {
  return VALID_MODES.map((mode) => ({ mode }));
}

export default async function WriteModePage({
  params,
}: {
  params: Promise<{ mode: string }>;
}) {
  const { mode } = await params;
  if (!VALID_MODES.includes(mode as Mode)) {
    notFound();
  }
  return <WriteModeClient mode={mode as Mode} />;
}

export const dynamicParams = false;
