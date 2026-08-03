import { NextResponse } from "next/server";
import { streamChat, type ChatMessage } from "@/lib/ai";
import { retrieveTopChunks, generateVisitorId } from "@/lib/utils";
import { PLANS, computeUsageState } from "@/lib/billing";

const SHOWCASE_MODE = process.env.NEXT_PUBLIC_SHOWCASE_MODE !== "0";

interface Params {
  params: Promise<{ botId: string }>;
}

export async function POST(req: Request, { params }: Params) {
  const { botId } = await params;

  if (SHOWCASE_MODE || !process.env.DATABASE_URL) {
    const body = await req.json().catch(() => ({}));
    const messages: ChatMessage[] = Array.isArray(body.messages) ? body.messages : [];
    const conversationId = body.conversationId || `demo-conversation-${Date.now()}`;
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    const reply = lastUserMsg?.content
      ? `Demo reply: I received "${lastUserMsg.content.slice(0, 80)}". A real workspace would answer from its knowledge base.`
      : "Demo reply: How can I help you today?";

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ conversationId })}\n\n`));
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: reply, conversationId })}\n\n`));
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, conversationId })}\n\n`));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  }

  const { db } = await import("@/lib/db");
  const bot = await db.bot.findUnique({
    where: { id: botId },
    include: {
      workspace: { include: { subscription: true } },
      knowledgeChunks: { select: { content: true, sourceName: true } },
    },
  });

  if (!bot) {
    return NextResponse.json({ error: "Bot not found" }, { status: 404 });
  }

  const plan = bot.workspace.subscription?.plan || "FREE";
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const monthConvoCount = await db.conversation.count({
    where: {
      bot: { workspaceId: bot.workspaceId },
      createdAt: { gte: startOfMonth },
    },
  });
  const usage = computeUsageState(plan, 0, monthConvoCount);
  if (!usage.canStartConversation) {
    return NextResponse.json(
      {
        error: "This bot has reached its monthly conversation limit. Please contact the site owner.",
      },
      { status: 402 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const messages: ChatMessage[] = Array.isArray(body.messages) ? body.messages : [];
  const visitorId: string = body.visitorId || generateVisitorId();
  const conversationId: string | undefined = body.conversationId;

  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUserMsg) {
    return NextResponse.json({ error: "No user message" }, { status: 400 });
  }

  let conversation = conversationId
    ? await db.conversation.findUnique({ where: { id: conversationId } })
    : null;

  if (!conversation) {
    conversation = await db.conversation.create({
      data: {
        botId,
        visitorId,
        status: "AI",
        title: lastUserMsg.content.slice(0, 80),
      },
    });
  }

  await db.message.create({
    data: {
      conversationId: conversation.id,
      role: "USER",
      content: lastUserMsg.content,
    },
  });

  const topChunks = retrieveTopChunks(lastUserMsg.content, bot.knowledgeChunks, 4);

  const kbBlock =
    topChunks.length > 0
      ? `\n\nYou also have access to the following knowledge-base excerpts. Ground your answer in this content. If none of it is relevant, answer honestly based on the question alone.\n\n${topChunks
          .map((c, i) => `--- Excerpt ${i + 1} (${c.sourceName}) ---\n${c.content}`)
          .join("\n\n")}\n`
      : "";

  const systemPrompt = `You are the customer support assistant for "${bot.name}".
Your job is to help visitors with their questions about this product or service.

Rules:
- Be concise and friendly. Reply in 1-3 short paragraphs max.
- If a visitor asks something outside your knowledge, suggest they escalate to a human using the "Talk to a human" button.
- Never invent prices, dates, or policies that aren't in your knowledge base.
- If the visitor seems frustrated, acknowledge it before answering.${kbBlock}`;

  const chatMessages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    ...messages.filter((m) => m.role !== "system"),
  ];

  const encoder = new TextEncoder();
  const state = { closed: false };

  const stream = new ReadableStream({
    async start(controller) {
      const safeEnqueue = (chunk: Uint8Array) => {
        if (state.closed) return;
        try {
          controller.enqueue(chunk);
        } catch {
          state.closed = true;
        }
      };
      const safeClose = () => {
        if (state.closed) return;
        state.closed = true;
        try {
          controller.close();
        } catch {}
      };

      safeEnqueue(encoder.encode(`data: ${JSON.stringify({ conversationId: conversation!.id })}\n\n`));

      let assistantContent = "";
      try {
        for await (const delta of streamChat(chatMessages, { temperature: 0.4 })) {
          assistantContent += delta;
          safeEnqueue(encoder.encode(`data: ${JSON.stringify({ delta, conversationId: conversation!.id })}\n\n`));
        }
        await db.message.create({
          data: {
            conversationId: conversation!.id,
            role: "ASSISTANT",
            content: assistantContent,
          },
        });
        safeEnqueue(encoder.encode(`data: ${JSON.stringify({ done: true, conversationId: conversation!.id })}\n\n`));
      } catch (err: any) {
        console.error("[widget/chat] stream error:", err);
        safeEnqueue(
          encoder.encode(
            `data: ${JSON.stringify({ error: "Stream failed", fallback: "Sorry - I ran into an issue. Please try again or tap 'Talk to a human'." })}\n\n`,
          ),
        );
      } finally {
        safeClose();
      }
    },
    cancel() {
      state.closed = true;
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}