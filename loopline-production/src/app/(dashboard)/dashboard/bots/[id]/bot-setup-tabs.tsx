"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WidgetLivePreview } from "./widget-live-preview";
import { KnowledgeBasePanel } from "./knowledge-base-panel";
import { InstallSnippetPanel } from "./install-snippet-panel";
import { BotSettingsPanel } from "./bot-settings-panel";
import { Card } from "@/components/ui/card";

export interface BotData {
  id: string;
  name: string;
  primaryColor: string;
  welcomeMessage: string;
  avatarUrl: string | null;
}

export interface KnowledgeChunk {
  id: string;
  sourceName: string;
  content: string;
  createdAt: string;
}

export function BotSetupTabs({
  bot,
  knowledgeChunks,
  installSnippet,
  appUrl,
}: {
  bot: BotData;
  knowledgeChunks: KnowledgeChunk[];
  installSnippet: string;
  appUrl: string;
}) {
  const [color, setColor] = useState(bot.primaryColor);
  const [name, setName] = useState(bot.name);
  const [welcome, setWelcome] = useState(bot.welcomeMessage);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div>
        <Tabs defaultValue="settings">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="settings">Bot settings</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge base</TabsTrigger>
            <TabsTrigger value="install">Install</TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="mt-4">
            <BotSettingsPanel
              bot={bot}
              color={color}
              setColor={setColor}
              name={name}
              setName={setName}
              welcome={welcome}
              setWelcome={setWelcome}
            />
          </TabsContent>

          <TabsContent value="knowledge" className="mt-4">
            <KnowledgeBasePanel botId={bot.id} initialChunks={knowledgeChunks} />
          </TabsContent>

          <TabsContent value="install" className="mt-4">
            <InstallSnippetPanel
              botId={bot.id}
              snippet={installSnippet}
              appUrl={appUrl}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Live preview */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <Card className="overflow-hidden p-0">
          <div className="border-b border-border bg-muted/50 px-4 py-2.5">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Live preview
            </p>
          </div>
          <div className="bg-loopline-dots p-6">
            <WidgetLivePreview
              name={name || "Your bot"}
              color={color}
              welcome={welcome || "Hi! How can I help?"}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
