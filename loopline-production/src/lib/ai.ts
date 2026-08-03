// AI streaming wrapper around z-ai-web-dev-sdk.
// The widget + dashboard use this to stream assistant responses.

import ZAI from "z-ai-web-dev-sdk";

let _zai: ZAI | null = null;

export async function getZAI(): Promise<ZAI> {
  if (_zai) return _zai;
  _zai = await ZAI.create();
  return _zai;
}

export type ChatRole = "system" | "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

/**
 * Stream assistant tokens from the underlying z-ai model.
 * Returns an async iterable of string deltas.
 *
 * The z-ai SDK returns a raw ReadableStream (not an async iterable) when
 * stream:true is set. We parse the SSE "data:" lines ourselves.
 */
export async function* streamChat(
  messages: ChatMessage[],
  opts: { temperature?: number } = {},
): AsyncGenerator<string, void, unknown> {
  const zai = await getZAI();

  const result: any = await zai.chat.completions.create({
    messages,
    stream: true,
    temperature: opts.temperature ?? 0.4,
  });

  // The SDK returns response.body (a ReadableStream) when streaming.
  if (result && typeof result.getReader === "function") {
    const reader = result.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // Process complete lines
      const lines = buffer.split("\n");
      buffer = lines.pop() || ""; // keep incomplete line in buffer

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data:")) continue;

        const payload = trimmed.slice(5).trim();
        if (payload === "[DONE]") return;

        try {
          const data = JSON.parse(payload);
          const delta =
            data?.choices?.[0]?.delta?.content ??
            data?.choices?.[0]?.message?.content ??
            "";
          if (delta) yield delta as string;
        } catch {
          // skip malformed JSON (partial chunk)
        }
      }
    }

    // Process any remaining buffer
    if (buffer.trim().startsWith("data:")) {
      const payload = buffer.trim().slice(5).trim();
      if (payload && payload !== "[DONE]") {
        try {
          const data = JSON.parse(payload);
          const delta =
            data?.choices?.[0]?.delta?.content ??
            data?.choices?.[0]?.message?.content ??
            "";
          if (delta) yield delta as string;
        } catch {
          // ignore
        }
      }
    }
    return;
  }

  // Fallback: SDK returned a non-streaming response (async iterable or object)
  if (result && typeof result[Symbol.asyncIterator] === "function") {
    for await (const part of result as any) {
      const delta =
        part?.choices?.[0]?.delta?.content ??
        part?.choices?.[0]?.message?.content ??
        part?.content ??
        "";
      if (delta) yield delta as string;
    }
    return;
  }

  // Fallback: non-streaming response — emit as a single delta
  const content =
    result?.choices?.[0]?.message?.content ??
    result?.choices?.[0]?.delta?.content ??
    "";
  if (content) yield content as string;
}

/**
 * Non-streaming completion — used for short utility calls (titles, summaries).
 */
export async function completeChat(
  messages: ChatMessage[],
  opts: { temperature?: number; maxTokens?: number } = {},
): Promise<string> {
  const zai = await getZAI();
  const completion = await zai.chat.completions.create({
    messages,
    stream: false,
    temperature: opts.temperature ?? 0.4,
  });
  return (
    completion?.choices?.[0]?.message?.content ??
    completion?.choices?.[0]?.delta?.content ??
    ""
  );
}
