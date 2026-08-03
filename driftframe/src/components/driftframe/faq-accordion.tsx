"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "Do credits expire?",
    a: "No. Credit packs you purchase never expire — use them whenever inspiration strikes. Subscription credits refill monthly and are added on top of any existing balance.",
  },
  {
    q: "Who owns the images I generate?",
    a: "You do. Driftframe claims no ownership over your generated images. Check your jurisdiction's guidance on AI-generated content for commercial use.",
  },
  {
    q: "What happens if a generation fails?",
    a: "If the image model errors out, your credits are not charged. The Generation row is marked as failed and you can retry the same prompt immediately.",
  },
  {
    q: "Can I get a refund?",
    a: "Unused credit packs are refundable within 14 days of purchase. Subscriptions are non-refundable for the current period but can be canceled anytime to stop the next refill. Failed generations are never charged.",
  },
  {
    q: "Are there API limits?",
    a: "The demo doesn't expose a public API. In production, your plan tier sets a per-minute and per-day generation cap. Pro subscribers get higher concurrency. Rate limits return HTTP 429 with a Retry-After header.",
  },
  {
    q: "Which styles are supported?",
    a: "Five presets: Photographic, Anime, 3D Render, Painting, and Sketch. Each tunes the model's prompt prefix and post-processing. The demo uses local SVG generative art for each style — production swaps to DALL·E 3 with the same style prefixes.",
  },
  {
    q: "Can I use generated images commercially?",
    a: "Yes. Generated images come with a commercial license for the account holder. You may not use Driftframe to generate content that is illegal, infringing, or sexually exploitative of real persons — see the Terms for the full acceptable-use policy.",
  },
];

export function FaqAccordion() {
  return (
    <Accordion type="single" collapsible defaultValue="item-0" className="space-y-3">
      {FAQS.map((item, i) => (
        <AccordionItem
          key={i}
          value={`item-${i}`}
          className="overflow-hidden rounded-xl border border-border bg-card/40 px-5"
        >
          <AccordionTrigger className="text-left text-sm font-medium hover:no-underline min-h-[56px]">
            {item.q}
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground">
            {item.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
