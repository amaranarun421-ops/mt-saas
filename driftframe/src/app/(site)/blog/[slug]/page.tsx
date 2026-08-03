import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, ArrowRight, Sparkles } from "lucide-react";
import { GlassPanel } from "@/components/driftframe/glass-panel";
import { GradientLink } from "@/components/driftframe/gradient-button";
import { generateSvgArt } from "@/lib/ai/image-model";
import { BLOG_POSTS } from "../page";

export const dynamicParams = false;

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Post not found — Driftframe" };
  return { title: `${post.title} — Driftframe` };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const cover = generateSvgArt({
    prompt: post.prompt,
    style: post.style,
    seed: post.seed,
    width: 1200,
    height: 600,
  });

  // Two inline SVG "in-article" illustrations, distinct from the cover.
  const inline1 = generateSvgArt({
    prompt: post.prompt,
    style: post.style,
    seed: post.seed + 100,
    width: 800,
    height: 500,
  });
  const inline2 = generateSvgArt({
    prompt: post.prompt,
    style: post.style,
    seed: post.seed + 200,
    width: 800,
    height: 500,
  });

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <div>
      {/* Hero */}
      <section className="bg-radial-spotlight">
        <div className="driftframe-container py-12 md:py-16">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to blog
            </Link>
            <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="rounded-full bg-[#7c3aed]/10 px-2 py-0.5 font-medium text-[#7c3aed]">
                {post.category}
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(post.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.readingTime}
              </span>
            </div>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              {post.excerpt}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#7c3aed] text-xs font-semibold text-white">
                {post.authorInitials}
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">{post.author}</p>
                <p className="text-xs text-muted-foreground">Driftframe team</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cover image */}
      <section>
        <div className="driftframe-container py-8">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-border bg-muted">
            <img
              src={cover}
              alt={post.title}
              width={1200}
              height={600}
              className="driftframe-img aspect-[2/1] w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Article body */}
      <section>
        <div className="driftframe-container py-8">
          <article className="mx-auto max-w-2xl space-y-6 text-base leading-relaxed text-foreground/90">
            <p>
              When we set out to build Driftframe, the first decision wasn&apos;t
              which model to use or how to design the UI — it was the question
              of <em>what kind of tool</em> we wanted to ship. Most AI image
              generators feel like slot machines: loud, addictive, designed to
              keep you spinning. We wanted the opposite.
            </p>
            <p>
              The post you&apos;re reading explores one specific decision in
              depth. We&apos;ll walk through the constraints, the alternatives
              we considered, and the trade-offs we ultimately accepted.
            </p>
            <h2 className="font-display text-2xl font-semibold tracking-tight pt-4">
              The constraint
            </h2>
            <p>
              Whatever we shipped had to feel deliberate. Not minimal for the
              sake of minimalism — deliberate. Every pixel on screen had to
              earn its place. Every interaction had to have a clear cause and
              effect. If a user couldn&apos;t predict what would happen when
              they clicked a button, we hadn&apos;t done our job.
            </p>
            <figure className="my-8">
              <div className="overflow-hidden rounded-2xl border border-border bg-muted">
                <img
                  src={inline1}
                  alt={`${post.title} — illustration 1`}
                  width={800}
                  height={500}
                  className="driftframe-img aspect-[8/5] w-full object-cover"
                />
              </div>
              <figcaption className="mt-2 text-center text-xs text-muted-foreground">
                Fig 1. A worked example using the {post.style.replace("-", " ")} preset.
              </figcaption>
            </figure>
            <h2 className="font-display text-2xl font-semibold tracking-tight pt-4">
              The alternatives
            </h2>
            <p>
              We considered three approaches. The first was to copy the
              incumbent: a sidebar of sliders, a giant preview canvas, and a
              credit counter in the top-right. Familiar, but boring — and it
              carried the baggage of every other tool that had used the same
              layout.
            </p>
            <p>
              The second was to strip everything back to a single prompt box.
              Clean, but useless the moment you wanted to do anything more than
              generate. Style and aspect ratio are non-negotiable.
            </p>
            <p>
              The third — the one we shipped — was a glass prompt sidebar paired
              with a masonry canvas. The sidebar holds the prompt, style chips,
              and aspect-ratio chips. The canvas holds the results. The credit
              cost is visible at all times. Nothing else.
            </p>
            <h2 className="font-display text-2xl font-semibold tracking-tight pt-4">
              The trade-off
            </h2>
            <p>
              The cost of this approach is that some advanced features —
              inpainting, control-net, multi-image blending — don&apos;t have
              an obvious home. We&apos;re OK with that for now. Driftframe is
              for creators who want to ship, not for power users who want to
              tinker. When we do add those features, they&apos;ll be in a
              separate workspace, not bolted onto the studio.
            </p>
            <figure className="my-8">
              <div className="overflow-hidden rounded-2xl border border-border bg-muted">
                <img
                  src={inline2}
                  alt={`${post.title} — illustration 2`}
                  width={800}
                  height={500}
                  className="driftframe-img aspect-[8/5] w-full object-cover"
                />
              </div>
              <figcaption className="mt-2 text-center text-xs text-muted-foreground">
                Fig 2. Variation with a different seed — same prompt, different feel.
              </figcaption>
            </figure>
            <h2 className="font-display text-2xl font-semibold tracking-tight pt-4">
              What&apos;s next
            </h2>
            <p>
              We&apos;re shipping the v3 dashboard in the next few weeks —
              sidebar nav, billing, API keys, usage charts. The studio stays
              the same; everything around it gets more polished. If you have
              thoughts, we read every email at{" "}
              <a href="mailto:hello@driftframe.app" className="text-[#7c3aed] hover:underline">
                hello@driftframe.app
              </a>
              .
            </p>
            <p className="pt-4 text-sm text-muted-foreground">
              — The Driftframe team
            </p>
          </article>
        </div>
      </section>

      {/* Author bio */}
      <section>
        <div className="driftframe-container py-8">
          <div className="mx-auto max-w-2xl">
            <GlassPanel className="flex items-start gap-4">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#7c3aed] text-sm font-semibold text-white">
                {post.authorInitials}
              </span>
              <div>
                <p className="font-display text-base font-medium">{post.author}</p>
                <p className="text-xs text-[#7c3aed]">Driftframe team</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {post.author} writes about prompt craft, product design, and
                  the engineering behind Driftframe. Find more of their work in
                  the blog archive.
                </p>
              </div>
            </GlassPanel>
          </div>
        </div>
      </section>

      {/* Related posts */}
      <section className="border-t border-border bg-muted/30">
        <div className="driftframe-container py-12">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-xl font-semibold tracking-tight">
              Keep reading
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {related.map((rel) => {
                const relCover = generateSvgArt({
                  prompt: rel.prompt,
                  style: rel.style,
                  seed: rel.seed,
                  width: 600,
                  height: 400,
                });
                return (
                  <Link key={rel.slug} href={`/blog/${rel.slug}`}>
                    <GlassPanel className="driftframe-card-hover flex h-full flex-col overflow-hidden p-0">
                      <div className="aspect-[16/10] w-full overflow-hidden bg-muted">
                        <img
                          src={relCover}
                          alt={rel.title}
                          width={600}
                          height={400}
                          className="driftframe-img h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-5">
                        <span className="text-xs font-medium text-[#7c3aed]">
                          {rel.category}
                        </span>
                        <h3 className="mt-2 font-display text-base font-medium leading-snug">
                          {rel.title}
                        </h3>
                        <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                          {rel.readingTime} <ArrowRight className="h-3 w-3" />
                        </div>
                      </div>
                    </GlassPanel>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-radial-spotlight border-t border-border">
        <div className="driftframe-container py-12 text-center">
          <Sparkles className="mx-auto h-7 w-7 text-[#7c3aed]" />
          <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight">
            Try the studio yourself.
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            10 free credits. No card. No subscription.
          </p>
          <div className="mt-6 flex justify-center">
            <GradientLink href="/signup" leftIcon={<Sparkles className="h-4 w-4" />}>
              Start creating
            </GradientLink>
          </div>
        </div>
      </section>
    </div>
  );
}
