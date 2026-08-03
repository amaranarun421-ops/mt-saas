"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Copy, ExternalLink, FileCode2, Terminal } from "lucide-react";
import { toast } from "sonner";

export function InstallSnippetPanel({
  botId,
  snippet,
  appUrl,
}: {
  botId: string;
  snippet: string;
  appUrl: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copySnippet() {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      toast.success("Snippet copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      toast.error("Couldn't copy — please copy manually");
    }
  }

  const widgetUrl = `${appUrl}/widget/${botId}`;

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-border bg-muted/50 px-5 py-3">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-brand-500" />
            <h3 className="font-display text-base text-foreground">
              Script tag install
            </h3>
          </div>
          <Button size="sm" variant="outline" onClick={copySnippet}>
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-mint-500" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy
              </>
            )}
          </Button>
        </div>
        <pre className="overflow-x-auto p-5 text-sm scrollbar-loopline">
          <code className="font-mono text-foreground">{snippet}</code>
        </pre>
        <div className="border-t border-border bg-muted/30 px-5 py-3">
          <p className="text-xs text-muted-foreground">
            Paste this anywhere in your HTML — usually just before the closing{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono">&lt;/body&gt;</code>{" "}
            tag. Works on any site: WordPress, Webflow, plain HTML, or your existing app.
          </p>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-border bg-muted/50 px-5 py-3">
          <div className="flex items-center gap-2">
            <FileCode2 className="h-4 w-4 text-brand-500" />
            <h3 className="font-display text-base text-foreground">
              npm package
            </h3>
          </div>
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
            React
          </span>
        </div>
        <div className="space-y-3 p-5">
          <pre className="overflow-x-auto rounded-lg bg-navy-900 p-4 text-sm scrollbar-loopline">
            <code className="font-mono text-slate-200">{`bun add @loopline/widget`}</code>
          </pre>
          <pre className="overflow-x-auto rounded-lg bg-navy-900 p-4 text-sm scrollbar-loopline">
            <code className="font-mono text-slate-200">{`import { LooplineWidget } from "@loopline/widget";

<LooplineWidget
  botId="${botId}"
  src="${appUrl}"
/>`}</code>
          </pre>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint-500/15 text-mint-600">
            <ExternalLink className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-base text-foreground">
              Test the widget now
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Open the widget in a new tab to see exactly what your visitors will see.
            </p>
            <Button asChild size="sm" variant="outline" className="mt-3">
              <a href={widgetUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" />
                Open widget preview
              </a>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
