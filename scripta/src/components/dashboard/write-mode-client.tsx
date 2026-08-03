'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Sparkles,
  Square,
  Save,
  RefreshCw,
  Send,
  Lock,
  ArrowLeft,
  Zap,
  FileText,
  MessageSquare,
  Mail,
  Package,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useStreamingGeneration } from './use-streaming-generation';
import { CustomDropdown, type DropdownOption } from './custom-dropdown';
import { useSession } from 'next-auth/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useStickToBottom } from 'use-stick-to-bottom';

type Mode = 'blog' | 'social' | 'email' | 'product';

interface ModeConfig {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  requiresPro: boolean;
  inputs: Array<{
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'dropdown';
    placeholder?: string;
    options?: DropdownOption[];
    required?: boolean;
    helper?: string;
  }>;
}

const MODE_CONFIG: Record<Mode, ModeConfig> = {
  blog: {
    title: 'Blog Post Generator',
    description: 'Generate a structured blog post with H1, H2 sections, intro, and conclusion.',
    icon: FileText,
    color: 'from-violet-500 to-purple-600',
    requiresPro: false,
    inputs: [
      {
        name: 'topic',
        label: 'Topic',
        type: 'text',
        placeholder: 'How AI is reshaping content marketing',
        required: true,
        helper: 'What should the post be about?',
      },
      {
        name: 'tone',
        label: 'Tone',
        type: 'dropdown',
        options: [
          { value: 'professional', label: 'Professional' },
          { value: 'casual', label: 'Casual' },
          { value: 'authoritative', label: 'Authoritative' },
          { value: 'friendly', label: 'Friendly' },
          { value: 'persuasive', label: 'Persuasive' },
        ],
        required: true,
      },
      {
        name: 'length',
        label: 'Target length',
        type: 'dropdown',
        options: [
          { value: 'short (~300 words)', label: 'Short (~300 words)' },
          { value: 'medium (~600 words)', label: 'Medium (~600 words)' },
          { value: 'long (~1000 words)', label: 'Long (~1000 words)' },
        ],
        required: true,
      },
      {
        name: 'keywords',
        label: 'Target keywords (comma-separated)',
        type: 'text',
        placeholder: 'AI, content marketing, automation',
        helper: 'Optional — used to bias the post for SEO.',
      },
    ],
  },
  social: {
    title: 'Social Caption Generator',
    description: 'Three variations + hashtags for Instagram, LinkedIn, or X.',
    icon: MessageSquare,
    color: 'from-pink-500 to-rose-600',
    requiresPro: false,
    inputs: [
      {
        name: 'topic',
        label: 'Topic',
        type: 'text',
        placeholder: 'Launch of our new AI editor',
        required: true,
      },
      {
        name: 'platform',
        label: 'Platform',
        type: 'dropdown',
        options: [
          { value: 'instagram', label: 'Instagram' },
          { value: 'linkedin', label: 'LinkedIn' },
          { value: 'x', label: 'X (Twitter)' },
        ],
        required: true,
      },
      {
        name: 'tone',
        label: 'Tone',
        type: 'dropdown',
        options: [
          { value: 'professional', label: 'Professional' },
          { value: 'casual', label: 'Casual' },
          { value: 'witty', label: 'Witty' },
          { value: 'inspirational', label: 'Inspirational' },
          { value: 'bold', label: 'Bold' },
        ],
        required: true,
      },
    ],
  },
  email: {
    title: 'Email Copy Generator',
    description: 'Welcome, promo, follow-up, or announcement emails — subject + body.',
    icon: Mail,
    color: 'from-blue-500 to-indigo-600',
    requiresPro: true,
    inputs: [
      {
        name: 'goal',
        label: 'Goal',
        type: 'dropdown',
        options: [
          { value: 'welcome', label: 'Welcome new subscriber' },
          { value: 'promo', label: 'Promotional offer' },
          { value: 'follow-up', label: 'Follow-up / nudge' },
          { value: 'announcement', label: 'Product announcement' },
        ],
        required: true,
      },
      {
        name: 'audience',
        label: 'Audience',
        type: 'text',
        placeholder: 'Indie founders on the free plan',
        required: true,
      },
      {
        name: 'keyPoint',
        label: 'Key point',
        type: 'textarea',
        placeholder: 'New Pro plan with unlimited AI generations and team folders',
        required: true,
        helper: 'The single takeaway the reader should leave with.',
      },
    ],
  },
  product: {
    title: 'Product Description Generator',
    description: 'Short + long benefits-led descriptions in one generation.',
    icon: Package,
    color: 'from-amber-500 to-orange-600',
    requiresPro: true,
    inputs: [
      {
        name: 'product',
        label: 'Product name',
        type: 'text',
        placeholder: 'Aero Running Shoes',
        required: true,
      },
      {
        name: 'features',
        label: 'Key features (one per line)',
        type: 'textarea',
        placeholder: 'Carbon-fiber plate\nBreathable knit upper\n285g per shoe',
        required: true,
        helper: 'List 2-5 features — the AI will weave them into benefits.',
      },
      {
        name: 'tone',
        label: 'Tone',
        type: 'dropdown',
        options: [
          { value: 'confident', label: 'Confident' },
          { value: 'playful', label: 'Playful' },
          { value: 'luxurious', label: 'Luxurious' },
          { value: 'minimal', label: 'Minimal' },
          { value: 'friendly', label: 'Friendly' },
        ],
        required: true,
      },
    ],
  },
};

interface WriteModeClientProps {
  mode: Mode;
}

export function WriteModeClient({ mode }: WriteModeClientProps) {
  const config = MODE_CONFIG[mode];
  const Icon = config.icon;
  const router = useRouter();
  const { data: session, update } = useSession();
  const plan = session?.user?.plan ?? 'free';
  const isLocked = config.requiresPro && plan !== 'pro';

  const [formValues, setFormValues] = React.useState<Record<string, string>>(
    () => {
      const init: Record<string, string> = {};
      for (const input of config.inputs) {
        if (input.type === 'dropdown' && input.options) {
          init[input.name] = input.options[0].value;
        } else {
          init[input.name] = '';
        }
      }
      return init;
    }
  );

  const [instructions, setInstructions] = React.useState('');
  const [titleOverride, setTitleOverride] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);

  const { generate, stop, output, isStreaming, error, reset } =
    useStreamingGeneration({
      mode,
      onCreditChange: (credits) => {
        // Force session refresh so the dashboard header pill updates
        update?.().catch(() => {});
      },
    });

  // The "AI output" pane sticks to the bottom while streaming.
  const { scrollRef } = useStickToBottom();

  const handleGenerate = () => {
    if (isLocked) {
      toast.error('This mode requires a Pro plan. Upgrade to unlock.');
      router.push('/dashboard/billing');
      return;
    }
    // Validate required fields
    for (const input of config.inputs) {
      if (input.required && !formValues[input.name]?.trim()) {
        toast.error(`${input.label} is required.`);
        return;
      }
    }
    generate(formValues, instructions || undefined);
  };

  const handleSave = async () => {
    if (!output.trim()) {
      toast.error('Nothing to save yet. Generate something first.');
      return;
    }
    setIsSaving(true);
    try {
      const title =
        titleOverride.trim() ||
        deriveTitleFromOutput(output) ||
        formValues.topic ||
        formValues.product ||
        formValues.audience ||
        `Untitled ${mode}`;
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: mode,
          title,
          content: output,
        }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        toast.error(json.error ?? 'Failed to save.');
        return;
      }
      const json = await res.json();
      toast.success('Document saved.');
      router.push(`/dashboard/documents/${json.document.id}`);
    } catch (err) {
      console.error(err);
      toast.error('Network error.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Breadcrumb header */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="h-3 w-3" />
          Dashboard
        </Link>
        <div className="mt-2 flex items-center gap-3">
          <div
            className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${config.color} text-white shadow-theme-sm`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              {config.title}
            </h1>
            <p className="text-sm text-muted-foreground">{config.description}</p>
          </div>
        </div>
      </div>

      {/* Locked banner */}
      {isLocked && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-500/30 p-4 flex flex-col md:flex-row md:items-center gap-3 md:justify-between">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                This mode requires the Pro plan
              </p>
              <p className="text-xs text-amber-800 dark:text-amber-300/80 mt-0.5">
                Upgrade to unlock all 4 write modes and unlimited generations.
              </p>
            </div>
          </div>
          <Button asChild className="btn-elevated btn-press">
            <Link href="/dashboard/billing">
              Upgrade to Pro
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}

      {/* Split view: input form | AI output */}
      <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
        {/* Input form */}
        <Card className="border-border/60 h-fit lg:sticky lg:top-20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary-500" />
              Inputs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {config.inputs.map((input) => (
              <div key={input.name} className="space-y-1.5">
                <Label htmlFor={input.name} className="text-xs">
                  {input.label}
                  {input.required && <span className="text-red-500 ml-0.5">*</span>}
                </Label>
                {input.type === 'text' && (
                  <Input
                    id={input.name}
                    placeholder={input.placeholder}
                    value={formValues[input.name] ?? ''}
                    onChange={(e) =>
                      setFormValues((v) => ({ ...v, [input.name]: e.target.value }))
                    }
                    disabled={isStreaming}
                  />
                )}
                {input.type === 'textarea' && (
                  <Textarea
                    id={input.name}
                    placeholder={input.placeholder}
                    rows={4}
                    value={formValues[input.name] ?? ''}
                    onChange={(e) =>
                      setFormValues((v) => ({ ...v, [input.name]: e.target.value }))
                    }
                    disabled={isStreaming}
                  />
                )}
                {input.type === 'dropdown' && input.options && (
                  <CustomDropdown
                    aria-label={input.label}
                    value={formValues[input.name] ?? input.options[0].value}
                    options={input.options}
                    onChange={(v) =>
                      setFormValues((vals) => ({ ...vals, [input.name]: v }))
                    }
                    disabled={isStreaming}
                  />
                )}
                {input.helper && (
                  <p className="text-xs text-muted-foreground">{input.helper}</p>
                )}
              </div>
            ))}

            <div className="pt-2 flex items-center gap-2">
              {isStreaming ? (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-10"
                  onClick={stop}
                >
                  <Square className="mr-2 h-4 w-4" />
                  Stop generating
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isLocked}
                  className="flex-1 btn-elevated btn-press h-10"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {output ? 'Regenerate' : 'Generate'}
                  {!isLocked && plan !== 'pro' && (
                    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-amber-100/60 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                      <Zap className="h-2.5 w-2.5" />1
                    </span>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* AI output */}
        <Card
          className={cn(
            'border-border/60 min-h-[60vh] relative',
            isStreaming && 'gradient-border-active'
          )}
        >
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              {isStreaming ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-500" />
                  </span>
                  Generating…
                </>
              ) : output ? (
                <>
                  <FileText className="h-4 w-4 text-primary-500" />
                  Output
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Output
                </>
              )}
            </CardTitle>
            {output && !isStreaming && (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerate}
                  className="h-8"
                >
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                  Regenerate
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn-elevated btn-press h-8"
                >
                  <Save className="mr-1.5 h-3.5 w-3.5" />
                  {isSaving ? 'Saving…' : 'Save'}
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            ) : output ? (
              <div ref={scrollRef} className="custom-scrollbar max-h-[70vh] overflow-y-auto pr-2 -mr-2">
                <div className="prose prose-sm dark:prose-invert max-w-none fade-in-token">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {output}
                  </ReactMarkdown>
                </div>
                {/* Regenerate-with-instructions input */}
                <div className="mt-6 pt-4 border-t border-border/40">
                  <Label htmlFor="instructions" className="text-xs">
                    Refine with instructions
                  </Label>
                  <div className="mt-2 flex gap-2">
                    <Input
                      id="instructions"
                      placeholder="e.g. make it more punchy, add a stat, shorten the intro…"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if (!isStreaming) handleGenerate();
                        }
                      }}
                      disabled={isStreaming}
                    />
                    <Button
                      type="button"
                      onClick={handleGenerate}
                      disabled={isStreaming}
                      className="btn-elevated btn-press shrink-0"
                      size="icon"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Press <kbd className="rounded border border-border bg-muted px-1 text-[10px]">Enter</kbd> to regenerate with these instructions.
                  </p>
                </div>
              </div>
            ) : isStreaming ? (
              <StreamingSkeleton />
            ) : (
              <div className="rounded-lg border border-dashed border-border/60 py-16 px-6 text-center">
                <div className="mx-auto max-w-sm">
                  <svg
                    viewBox="0 0 64 64"
                    className="mx-auto h-16 w-16 text-primary-400/50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M32 8L8 24l24 16 24-16L32 8z" />
                    <path d="M8 36l24 16 24-16" />
                  </svg>
                  <h3 className="mt-4 text-lg font-semibold">Nothing here yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Fill in the inputs on the left and hit{' '}
                    <span className="font-medium text-foreground">Generate</span>.
                    Output will stream in here token-by-token.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StreamingSkeleton() {
  return (
    <div className="space-y-3 py-2">
      <div className="h-6 w-3/4 rounded skeleton-shimmer" />
      <div className="h-px bg-border/40 my-3" />
      <div className="h-3 w-full rounded skeleton-shimmer" />
      <div className="h-3 w-11/12 rounded skeleton-shimmer" />
      <div className="h-3 w-10/12 rounded skeleton-shimmer" />
      <div className="h-3 w-9/12 rounded skeleton-shimmer" />
      <div className="h-px bg-border/40 my-3" />
      <div className="h-4 w-1/2 rounded skeleton-shimmer" />
      <div className="h-3 w-full rounded skeleton-shimmer" />
      <div className="h-3 w-10/12 rounded skeleton-shimmer" />
      <div className="h-3 w-8/12 rounded skeleton-shimmer" />
    </div>
  );
}

function deriveTitleFromOutput(output: string): string | null {
  // Try to find the first markdown H1
  const match = /^#\s+(.+)$/m.exec(output);
  if (match) return match[1].trim().slice(0, 120);
  // Fallback: first non-empty line
  const firstLine = output.split('\n').find((l) => l.trim().length > 0);
  return firstLine ? firstLine.trim().slice(0, 120) : null;
}
