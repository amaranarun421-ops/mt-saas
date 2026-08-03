import { NextResponse } from 'next/server';
import { streamText, type ModelMessage } from 'ai';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { getAIModel } from '@/lib/ai/model';
import { resolveSystemPrompt, type WriteMode } from '@/lib/ai/prompts';
import { inputSchemaByMode } from '@/lib/zod/auth.schema';
import { deductCredit, maybeRefreshMonthlyCredits } from '@/lib/credits';
import { PLANS } from '@/lib/stripe';

export const maxDuration = 60;

const VALID_MODES: WriteMode[] = ['blog', 'social', 'email', 'product'];

export async function POST(
  req: Request,
  { params }: { params: Promise<{ mode: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { mode } = await params;
    if (!VALID_MODES.includes(mode as WriteMode)) {
      return NextResponse.json(
        { error: `Unknown write mode: ${mode}` },
        { status: 404 }
      );
    }

    // Refresh free-tier monthly credits if a new month has started.
    await maybeRefreshMonthlyCredits(session.user.id);

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true, creditsRemaining: true, emailVerified: true },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    if (!user.emailVerified) {
      return NextResponse.json(
        { error: 'Please verify your email before generating content.' },
        { status: 403 }
      );
    }

    // Free plan can only access blog + social
    const planConfig = PLANS[user.plan as keyof typeof PLANS];
    if (planConfig && !planConfig.modes.includes(mode as WriteMode)) {
      return NextResponse.json(
        {
          error:
            'Your current plan does not include this write mode. Upgrade to Pro to unlock all 4 modes.',
          upgradeRequired: true,
        },
        { status: 403 }
      );
    }

    // Deduct credit (pro is unlimited)
    const deduction = await deductCredit(session.user.id);
    if (!deduction.ok) {
      return NextResponse.json(
        {
          error:
            "You've used all your monthly credits. Upgrade to Pro for unlimited generations.",
          upgradeRequired: true,
        },
        { status: 402 }
      );
    }

    const body = await req.json();
    const { input } = body as { input: Record<string, unknown> };

    const schema = inputSchemaByMode[mode as WriteMode];
    const parsed = schema.safeParse(input);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.issues[0]?.message ?? 'Invalid input',
        },
        { status: 400 }
      );
    }

    const systemPrompt = resolveSystemPrompt(
      mode as WriteMode,
      parsed.data as Record<string, unknown>
    );

    // Build a synthetic user message describing the task
    const userMessage = `Generate ${mode} content based on: ${JSON.stringify(parsed.data)}`;
    const messages: ModelMessage[] = [
      { role: 'user', content: userMessage },
    ];

    const result = streamText({
      model: getAIModel(),
      system: systemPrompt,
      messages,
    });

    return result.toTextStreamResponse({
      headers: {
        'X-Scripta-Credits-Remaining': String(deduction.remaining),
      },
    });
  } catch (err) {
    console.error('[ai/generate] error', err);
    return NextResponse.json(
      { error: 'Generation failed. Please try again.' },
      { status: 500 }
    );
  }
}
