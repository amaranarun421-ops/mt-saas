"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function ContactForm() {
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Thanks! We'll be in touch within one business day.");
    setLoading(false);
    (e.target as HTMLFormElement).reset();
    void form;
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-6 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" placeholder="Jane Doe" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="jane@company.com" required className="mt-1.5" />
        </div>
      </div>
      <div>
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" placeholder="How can we help?" required className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us what you're working on…"
          required
          rows={5}
          className="mt-1.5"
        />
      </div>
      <Button type="submit" disabled={loading} withArrow className="w-full group">
        {loading ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
