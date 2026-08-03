'use client';

import * as React from 'react';
import { toast } from 'sonner';

interface UseStreamingGenerationArgs {
  mode: 'blog' | 'social' | 'email' | 'product';
  onCreditChange?: (credits: number) => void;
}

interface UseStreamingGenerationReturn {
  generate: (input: Record<string, unknown>, instructions?: string) => Promise<void>;
  stop: () => void;
  output: string;
  isStreaming: boolean;
  error: string | null;
  reset: () => void;
}

/**
 * Streams AI output token-by-token into the editor.
 *
 * Posts the user's input form to `/api/ai/[mode]` and consumes the
 * Server-Sent-Events-flavored data stream emitted by the AI SDK's
 * `streamText.toDataStreamResponse()`.
 */
export function useStreamingGeneration({
  mode,
  onCreditChange,
}: UseStreamingGenerationArgs): UseStreamingGenerationReturn {
  const [output, setOutput] = React.useState('');
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const abortRef = React.useRef<AbortController | null>(null);

  const generate = React.useCallback(
    async (input: Record<string, unknown>, instructions?: string) => {
      // Abort any prior in-flight request
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setOutput('');
      setError(null);
      setIsStreaming(true);

      try {
        const res = await fetch(`/api/ai/${mode}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({ input, instructions }),
        });

        if (!res.ok) {
          const json = await res.json().catch(() => ({ error: 'Request failed' }));
          if (res.status === 402 && json.upgradeRequired) {
            setError(json.error);
            toast.error(json.error);
          } else if (res.status === 403 && json.upgradeRequired) {
            setError(json.error);
            toast.error(json.error);
          } else {
            setError(json.error ?? `Generation failed (${res.status})`);
            toast.error(json.error ?? 'Generation failed.');
          }
          return;
        }

        // Read the new credit count from the response header
        const remainingHeader = res.headers.get('X-Scripta-Credits-Remaining');
        if (remainingHeader && onCreditChange) {
          const n = Number(remainingHeader);
          if (!Number.isNaN(n)) onCreditChange(n);
        }

        const reader = res.body?.getReader();
        if (!reader) {
          setError('No response body.');
          return;
        }

        const decoder = new TextDecoder();
        // Plain-text stream — append every decoded chunk to the output.
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          if (chunk) {
            setOutput((prev) => prev + chunk);
          }
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          // intentional abort — keep what we have
        } else {
          console.error('[useStreamingGeneration]', err);
          setError('Network error. Please try again.');
          toast.error('Network error.');
        }
      } finally {
        setIsStreaming(false);
      }
    },
    [mode, onCreditChange]
  );

  const stop = React.useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
  }, []);

  const reset = React.useCallback(() => {
    abortRef.current?.abort();
    setOutput('');
    setError(null);
    setIsStreaming(false);
  }, []);

  return { generate, stop, output, isStreaming, error, reset };
}
