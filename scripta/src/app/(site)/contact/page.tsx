'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Mail, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    // Simulated submit — in production wire to Resend or your inbox.
    await new Promise((r) => setTimeout(r, 800));
    toast.success('Thanks! We\'ll be in touch soon.');
    setIsLoading(false);
    (e.target as HTMLFormElement).reset();
  }

  return (
    <div className="px-6 md:px-12 lg:px-20 py-16 md:py-24">
      <div className="grid gap-12 lg:grid-cols-2 max-w-5xl mx-auto">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Get in touch
          </h1>
          <p className="mt-4 text-muted-foreground text-lg">
            Questions about Scripta, custom integrations, or licensing?
            We read every message and reply within 24 hours.
          </p>

          <div className="mt-8 space-y-3">
            <ContactRow
              icon={Mail}
              label="Email"
              value="hello@scripta.app"
            />
            <ContactRow
              icon={MessageSquare}
              label="Support"
              value="Reply from your dashboard billing page"
            />
          </div>
        </div>

        <Card className="border-border/60 shadow-theme-sm card-lift">
          <CardContent className="p-6 md:p-8">
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" required placeholder="Jane" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" required placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  required
                  rows={6}
                  placeholder="Tell us what you're working on…"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full button-bg btn-press text-white h-11"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  'Send message'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border/60 p-4">
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div className="mt-0.5 font-medium">{value}</div>
      </div>
    </div>
  );
}
