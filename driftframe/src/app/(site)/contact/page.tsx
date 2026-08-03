"use client";

import * as React from "react";
import { toast } from "sonner";
import { Mail, MessageSquare, MapPin, Clock } from "lucide-react";
import { GlassPanel } from "@/components/driftframe/glass-panel";
import { GradientButton } from "@/components/driftframe/gradient-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Demo: no backend. Simulate success.
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setName("");
    setEmail("");
    setMessage("");
    toast.success("Thanks! We'll be in touch soon.");
  }

  return (
    <div>
      <section className="bg-radial-spotlight">
        <div className="driftframe-container py-16 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="driftframe-pill">
              <Mail className="h-3 w-3" />
              Contact
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Get in touch.
            </h1>
            <p className="mt-3 text-muted-foreground">
              Questions, support, or feedback — we read every message.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="driftframe-container grid grid-cols-1 gap-8 py-16 md:py-20 lg:grid-cols-[1fr_320px]">
          {/* Form */}
          <GlassPanel>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11"
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[140px] resize-none"
                  placeholder="How can we help?"
                />
              </div>
              <div className="flex justify-end">
                <GradientButton
                  type="submit"
                  loading={loading}
                  leftIcon={<MessageSquare className="h-4 w-4" />}
                >
                  Send message
                </GradientButton>
              </div>
            </form>
          </GlassPanel>

          {/* Side info */}
          <div className="space-y-4">
            <GlassPanel>
              <h3 className="font-display text-base font-medium">Reach us</h3>
              <ul className="mt-4 space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#7c3aed]" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">hello@driftframe.app</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#7c3aed]" />
                  <div>
                    <p className="font-medium">Studio</p>
                    <p className="text-muted-foreground">Remote · Worldwide</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#7c3aed]" />
                  <div>
                    <p className="font-medium">Hours</p>
                    <p className="text-muted-foreground">Mon–Fri · 9am–6pm CET</p>
                  </div>
                </li>
              </ul>
            </GlassPanel>
            <p className="text-center text-xs text-muted-foreground">
              Demo mode — the form does not transmit. Wire it to your email
              provider in production.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
