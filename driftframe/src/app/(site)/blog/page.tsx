import { Calendar, Clock, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { GlassPanel } from "@/components/driftframe/glass-panel";
import { generateSvgArt } from "@/lib/ai/image-model";

export const metadata = {
  title: "Blog — Driftframe",
  description: "Essays on AI image generation, prompt craft, and building Driftframe.",
};

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  authorInitials: string;
  date: string;
  readingTime: string;
  category: string;
  prompt: string;
  style: string;
  seed: number;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "prompt-craft-for-photographic-style",
    title: "Prompt craft for the photographic style",
    excerpt:
      "Lighting, lens, and composition cues that consistently produce realistic images. A field guide for the photographic preset.",
    author: "Sofia Reyes",
    authorInitials: "SR",
    date: "2025-11-12",
    readingTime: "6 min",
    category: "Prompt craft",
    prompt: "Golden hour portrait of a sailor on a wooden dock, 85mm lens",
    style: "photographic",
    seed: 9001,
  },
  {
    slug: "the-credit-pack-model",
    title: "Why we chose credit packs over subscriptions",
    excerpt:
      "Subscriptions create anxiety. Credit packs create ownership. Here's the math behind our pricing decision.",
    author: "Mira Okonkwo",
    authorInitials: "MO",
    date: "2025-10-28",
    readingTime: "5 min",
    category: "Building Driftframe",
    prompt: "Mountain peak at golden hour, lone climber silhouette",
    style: "photographic",
    seed: 9002,
  },
  {
    slug: "anime-style-breakdown",
    title: "Anime style breakdown: cel-shading in 2025",
    excerpt:
      "What the anime preset actually does, and how to steer it with prompt structure. Includes 4 worked examples.",
    author: "Hiroshi Tanaka",
    authorInitials: "HT",
    date: "2025-10-15",
    readingTime: "8 min",
    category: "Style guides",
    prompt: "Cyberpunk samurai in neon rain, cel-shaded illustration",
    style: "anime",
    seed: 9003,
  },
  {
    slug: "batch-of-four-design",
    title: "Why we generate four images per prompt",
    excerpt:
      "Two is too few. Eight is too many. Four is the sweet spot for variation without decision fatigue.",
    author: "Aisha Bello",
    authorInitials: "AB",
    date: "2025-09-30",
    readingTime: "4 min",
    category: "Product design",
    prompt: "Floating crystal garden on pastel sky, soft 3D render",
    style: "3d-render",
    seed: 9004,
  },
  {
    slug: "building-the-masonry-gallery",
    title: "Building the masonry gallery with pure CSS",
    excerpt:
      "No JS masonry library — just CSS columns and break-inside. How we keep the gallery fast and responsive.",
    author: "Hiroshi Tanaka",
    authorInitials: "HT",
    date: "2025-09-12",
    readingTime: "7 min",
    category: "Engineering",
    prompt: "Underwater coral city with translucent fish, painterly",
    style: "painting",
    seed: 9005,
  },
  {
    slug: "negative-prompts-explained",
    title: "Negative prompts, explained simply",
    excerpt:
      "What to exclude and why. A short guide to writing negative prompts that actually move the output.",
    author: "Daniel Park",
    authorInitials: "DP",
    date: "2025-08-28",
    readingTime: "5 min",
    category: "Prompt craft",
    prompt: "Volcanic glass palace on a floating island, sketch crosshatch",
    style: "sketch",
    seed: 9006,
  },
];

export default function BlogPage() {
  const [featured, ...rest] = BLOG_POSTS;
  const featuredCover = generateSvgArt({
    prompt: featured.prompt,
    style: featured.style,
    seed: featured.seed,
    width: 1200,
    height: 600,
  });

  return (
    <div>
      {/* Hero */}
      <section className="bg-radial-spotlight">
        <div className="driftframe-container py-16 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="driftframe-pill">
              <Sparkles className="h-3 w-3" />
              The Driftframe blog
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Notes on prompt craft, product, and AI art.
            </h1>
            <p className="mt-3 text-muted-foreground">
              Long-form essays from the team behind Driftframe.
            </p>
          </div>
        </div>
      </section>

      {/* Featured post */}
      <section>
        <div className="driftframe-container py-12">
          <Link href={`/blog/${featured.slug}`} className="block">
            <GlassPanel className="overflow-hidden p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div
                  className="aspect-[16/10] w-full overflow-hidden bg-muted"
                  aria-hidden
                >
                  <img
                    src={featuredCover}
                    alt={featured.title}
                    width={1200}
                    height={600}
                    className="driftframe-img h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-8">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full bg-[#7c3aed]/10 px-2 py-0.5 font-medium text-[#7c3aed]">
                      Featured
                    </span>
                    <span>{featured.category}</span>
                  </div>
                  <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                    {featured.title}
                  </h2>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {featured.excerpt}
                  </p>
                  <div className="mt-6 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#7c3aed] text-[10px] font-semibold text-white">
                      {featured.authorInitials}
                    </span>
                    <span className="font-medium text-foreground">{featured.author}</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(featured.date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {featured.readingTime}
                    </span>
                  </div>
                  <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#7c3aed]">
                    Read the post <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </GlassPanel>
          </Link>
        </div>
      </section>

      {/* Post grid */}
      <section>
        <div className="driftframe-container pb-16">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => {
              const cover = generateSvgArt({
                prompt: post.prompt,
                style: post.style,
                seed: post.seed,
                width: 600,
                height: 400,
              });
              return (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <GlassPanel className="driftframe-card-hover flex h-full flex-col overflow-hidden p-0">
                    <div
                      className="aspect-[16/10] w-full overflow-hidden bg-muted"
                      aria-hidden
                    >
                      <img
                        src={cover}
                        alt={post.title}
                        width={600}
                        height={400}
                        className="driftframe-img h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <span className="text-xs font-medium text-[#7c3aed]">
                        {post.category}
                      </span>
                      <h3 className="mt-2 font-display text-lg font-medium leading-snug">
                        {post.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="mt-auto pt-4 flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#7c3aed] text-[9px] font-semibold text-white">
                          {post.authorInitials}
                        </span>
                        <span className="font-medium text-foreground">{post.author}</span>
                        <span>·</span>
                        <span>{post.readingTime}</span>
                      </div>
                    </div>
                  </GlassPanel>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
