import { openai } from '@ai-sdk/openai';

/**
 * Returns the OpenAI chat model. The default `gpt-4o-mini` is fast, cheap,
 * and good enough for blog/social/email/product copy. Swap to any other
 * provider/model the Vercel AI SDK supports in one line.
 */
export function getAIModel() {
  return openai('gpt-4o-mini');
}

/** Convenience singleton used by the chat route. */
export const AI_MODEL = getAIModel();
