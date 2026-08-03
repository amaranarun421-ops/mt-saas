/**
 * Driftframe image generation layer.
 *
 * This module is the SINGLE place that knows how images are produced.
 * Swap the implementation in `generateImages()` to move from the demo
 * (local SVG generative art) to a real DALL·E 3 backend — every call
 * site stays identical.
 *
 * ------------------------------------------------------------------
 * PRODUCTION (DALL·E 3) — uncomment & install:
 *
 *   bun add openai
 *
 * Then replace the body of `generateImages` with:
 *
 *   import OpenAI from "openai";
 *   const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
 *   const size = mapAspectRatioToDalleSize(aspectRatio);
 *   const urls = await Promise.all(
 *     Array.from({ length: count }, async () => {
 *       const styled = buildStyledPrompt(prompt, style);
 *       const res = await openai.images.generate({
 *         model: "dall-e-3",
 *         prompt: styled,
 *         n: 1,
 *         size,
 *       });
 *       return res.data[0].url!;
 *     }),
 *   );
 *   return urls.map((url) => ({ url, ...dims }));
 *
 * DALL·E 3 supports sizes: "1024x1024" | "1792x1024" | "1024x1792".
 * ------------------------------------------------------------------
 *
 * DEMO IMPLEMENTATION
 *
 * Instead of pulling from picsum.photos (unreachable from many sandboxed
 * browsers → broken images), we generate beautiful LOCAL SVG "generative
 * art" as data URLs. The art is deterministic by (prompt + style + seed)
 * so the same prompt yields consistent-but-varied results across the
 * batch-of-4 (seed + i). No network, no external service, always works.
 */

export interface GeneratedImage {
  url: string;
  width: number;
  height: number;
}

export interface AspectDimensions {
  width: number;
  height: number;
}

/** Map a user-facing aspect ratio to a concrete pixel size. */
export function aspectToDimensions(aspectRatio: string): AspectDimensions {
  switch (aspectRatio) {
    case "1:1":
      return { width: 768, height: 768 };
    case "16:9":
      return { width: 896, height: 504 };
    case "9:16":
      return { width: 504, height: 896 };
    case "4:3":
      return { width: 832, height: 624 };
    default:
      return { width: 768, height: 768 };
  }
}

/**
 * Map an aspect ratio to the nearest DALL·E 3 supported size.
 * (Only used when the production DALL·E 3 path is enabled.)
 */
export function mapAspectRatioToDalleSize(
  aspectRatio: string,
): "1024x1024" | "1792x1024" | "1024x1792" {
  switch (aspectRatio) {
    case "16:9":
      return "1792x1024";
    case "9:16":
      return "1024x1792";
    case "1:1":
    case "4:3":
    default:
      return "1024x1024";
  }
}

/**
 * Compose the final prompt sent to the model by prepending a style prefix.
 * (Only used in the production DALL·E 3 path.)
 */
export function buildStyledPrompt(prompt: string, style: string): string {
  const stylePrefix: Record<string, string> = {
    photographic: "photographic, realistic, 50mm lens, natural lighting,",
    anime: "anime style, cel shaded, vibrant colors,",
    "3d-render": "3D render, octane, ray-traced, highly detailed,",
    painting: "painterly, oil on canvas, textured brushstrokes,",
    sketch: "graphite sketch, line art, monochrome,",
  };
  const prefix = stylePrefix[style] ?? "";
  return prefix ? `${prefix} ${prompt}` : prompt;
}

/* ============================================================
 * Deterministic RNG — seeded by (prompt + style + seed).
 * Same inputs → same art. Different seed → different art.
 * ============================================================ */

/** Deterministic 32-bit string hash (FNV-1a). */
function hashString(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return Math.abs(hash);
}

/** Mulberry32 PRNG — fast, deterministic, decent distribution. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ============================================================
 * SVG generative art builder.
 *
 * Each style produces a visually distinct composition. The seed drives
 * shape counts, positions, rotations, and color picks so different
 * prompts → different art, same prompt → same art (deterministic).
 *
 * Output: data:image/svg+xml;base64,...  (always reachable, no network)
 * ============================================================ */

interface SvgArtOptions {
  prompt: string;
  style: string;
  seed: number;
  width: number;
  height: number;
}

const WATERMARK = "DRIFTFRAME";

/**
 * Build a single SVG image as a base64 data URL.
 *
 * Visual layers (bottom → top):
 *   1. Base gradient background (style-specific palette)
 *   2. Soft radial mesh blobs (2-5, style-specific colors)
 *   3. Style-specific shape composition (geometric / cel-shaded / etc.)
 *   4. Subtle film-grain noise overlay (feTurbulence)
 *   5. Vignette
 *   6. Prompt text strip (low opacity, clipped to bottom)
 *   7. Driftframe watermark (corner)
 */
export function generateSvgArt(opts: SvgArtOptions): string {
  const { prompt, style, seed, width, height } = opts;
  const rng = mulberry32(seed || 1);
  const id = `art${seed.toString(36)}`;

  const palette = getPalette(style);
  const shapes = buildShapes(style, rng, width, height, id, palette);
  const baseGradient = buildBaseGradient(style, rng, id, palette);
  const blobs = buildBlobs(rng, width, height, palette, id);
  const grain = buildGrain(id);
  const vignette = buildVignette(id);
  const promptStrip = buildPromptStrip(prompt, width, height, id);
  const watermark = buildWatermark(width, height);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid slice">
<defs>
${baseGradient}
${grain}
${vignette}
</defs>
<rect width="${width}" height="${height}" fill="url(#bg-${id})" />
${blobs}
${shapes}
<rect width="${width}" height="${height}" fill="url(#vignette-${id})" />
${promptStrip}
${watermark}
</svg>`;

  const base64 = Buffer.from(svg, "utf8").toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
}

/* ---------- Style palettes ---------- */

interface Palette {
  base: [string, string]; // gradient stops
  blobs: string[]; // blob fill colors
  shapes: string[]; // shape fill colors
  text: string; // prompt text color
}

function getPalette(style: string): Palette {
  switch (style) {
    case "anime":
      return {
        base: ["#1a0b2e", "#2d1b4e"],
        blobs: ["#ff3d81", "#7c3aed", "#3b82f6", "#06b6d4"],
        shapes: ["#ff3d81", "#7c3aed", "#f59e0b", "#10b981"],
        text: "#ffffff",
      };
    case "3d-render":
      return {
        base: ["#0f172a", "#1e293b"],
        blobs: ["#3b82f6", "#7c3aed", "#94a3b8", "#0ea5e9"],
        shapes: ["#60a5fa", "#a78bfa", "#cbd5e1", "#38bdf8"],
        text: "#e2e8f0",
      };
    case "painting":
      return {
        base: ["#3d2817", "#1f1410"],
        blobs: ["#cc7722", "#8b3a3a", "#1e3a5f", "#f5deb3"],
        shapes: ["#d2691e", "#a0522d", "#5b8a72", "#f4a460"],
        text: "#f5e6d3",
      };
    case "sketch":
      return {
        base: ["#f5f5f0", "#e0e0d8"],
        blobs: ["#999999", "#bbbbbb", "#666666", "#888888"],
        shapes: ["#1a1a1a", "#444444", "#666666", "#888888"],
        text: "#222222",
      };
    case "photographic":
    default:
      return {
        base: ["#2a0f1f", "#0f0a1f"],
        blobs: ["#ff3d81", "#7c3aed", "#3b82f6", "#f59e0b"],
        shapes: ["#ff3d81", "#7c3aed", "#3b82f6", "#fbbf24"],
        text: "#ffffff",
      };
  }
}

/* ---------- Base gradient ---------- */

function buildBaseGradient(
  style: string,
  rng: () => number,
  id: string,
  palette: Palette,
): string {
  const angle = Math.floor(rng() * 360);
  const [c1, c2] = palette.base;
  // Photographic gets a warm diagonal; others get a 135° brand-feel.
  const rotation = style === "photographic" ? angle : 135;
  return `
  <linearGradient id="bg-${id}" x1="0%" y1="0%" x2="${Math.cos((rotation * Math.PI) / 180) * 100}%" y2="${Math.sin((rotation * Math.PI) / 180) * 100}%" gradientUnits="userSpaceOnUse">
    <stop offset="0%" stop-color="${c1}" />
    <stop offset="100%" stop-color="${c2}" />
  </linearGradient>`;
}

/* ---------- Soft radial blobs (mesh-y feel) ---------- */

function buildBlobs(
  rng: () => number,
  w: number,
  h: number,
  palette: Palette,
  id: string,
): string {
  const count = 3 + Math.floor(rng() * 3); // 3-5 blobs
  let out = "";
  for (let i = 0; i < count; i++) {
    const cx = Math.floor(rng() * w);
    const cy = Math.floor(rng() * h);
    const r = Math.floor(Math.min(w, h) * (0.25 + rng() * 0.35));
    const color = palette.blobs[i % palette.blobs.length];
    const opacity = (0.35 + rng() * 0.35).toFixed(2);
    out += `<radialGradient id="blob-${id}-${i}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${color}" stop-opacity="${opacity}" />
      <stop offset="70%" stop-color="${color}" stop-opacity="${(parseFloat(opacity) * 0.3).toFixed(2)}" />
      <stop offset="100%" stop-color="${color}" stop-opacity="0" />
    </radialGradient>
    <ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * (0.7 + rng() * 0.5)}" fill="url(#blob-${id}-${i})" />`;
  }
  return out;
}

/* ---------- Style-specific shape compositions ---------- */

function buildShapes(
  style: string,
  rng: () => number,
  w: number,
  h: number,
  id: string,
  palette: Palette,
): string {
  switch (style) {
    case "anime":
      return buildAnimeShapes(rng, w, h, palette);
    case "3d-render":
      return build3DShapes(rng, w, h, palette, id);
    case "painting":
      return buildPaintingShapes(rng, w, h, palette);
    case "sketch":
      return buildSketchShapes(rng, w, h);
    case "photographic":
    default:
      return buildPhotographicShapes(rng, w, h, palette);
  }
}

/** Photographic: warm light leaks + soft bokeh circles. */
function buildPhotographicShapes(
  rng: () => number,
  w: number,
  h: number,
  palette: Palette,
): string {
  let out = "";
  // Light leak streaks
  const streaks = 2 + Math.floor(rng() * 2);
  for (let i = 0; i < streaks; i++) {
    const x = Math.floor(rng() * w);
    const y = Math.floor(rng() * h);
    const len = Math.floor(Math.min(w, h) * (0.4 + rng() * 0.4));
    const angle = Math.floor(rng() * 360);
    const color = palette.shapes[i % palette.shapes.length];
    out += `<line x1="${x}" y1="${y}" x2="${x + Math.cos((angle * Math.PI) / 180) * len}" y2="${y + Math.sin((angle * Math.PI) / 180) * len}" stroke="${color}" stroke-width="${20 + Math.floor(rng() * 40)}" stroke-opacity="${(0.1 + rng() * 0.2).toFixed(2)}" stroke-linecap="round" />`;
  }
  // Bokeh circles
  const bokeh = 8 + Math.floor(rng() * 8);
  for (let i = 0; i < bokeh; i++) {
    const cx = Math.floor(rng() * w);
    const cy = Math.floor(rng() * h);
    const r = 8 + Math.floor(rng() * 30);
    const color = palette.shapes[i % palette.shapes.length];
    out += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="1.5" stroke-opacity="${(0.15 + rng() * 0.25).toFixed(2)}" />`;
  }
  return out;
}

/** Anime: bold geometric shapes with hard edges, saturated colors. */
function buildAnimeShapes(
  rng: () => number,
  w: number,
  h: number,
  palette: Palette,
): string {
  let out = "";
  // Big triangles + sun/moon discs
  const triangles = 4 + Math.floor(rng() * 4);
  for (let i = 0; i < triangles; i++) {
    const x = Math.floor(rng() * w);
    const y = Math.floor(rng() * h);
    const size = 60 + Math.floor(rng() * 180);
    const rotation = Math.floor(rng() * 360);
    const color = palette.shapes[i % palette.shapes.length];
    const opacity = (0.5 + rng() * 0.4).toFixed(2);
    out += `<polygon points="0,${-size} ${size * 0.866},${size * 0.5} ${-size * 0.866},${size * 0.5}" fill="${color}" fill-opacity="${opacity}" transform="translate(${x} ${y}) rotate(${rotation})" />`;
  }
  // Sun/moon disc
  const dx = Math.floor(rng() * w);
  const dy = Math.floor(rng() * h * 0.6);
  const dr = 40 + Math.floor(rng() * 60);
  out += `<circle cx="${dx}" cy="${dy}" r="${dr}" fill="${palette.shapes[0]}" fill-opacity="0.85" />`;
  // Speed lines
  const lines = 6 + Math.floor(rng() * 6);
  for (let i = 0; i < lines; i++) {
    const y = Math.floor(rng() * h);
    const x1 = Math.floor(rng() * w * 0.4);
    const x2 = x1 + 60 + Math.floor(rng() * 200);
    out += `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#ffffff" stroke-width="${1 + Math.floor(rng() * 2)}" stroke-opacity="${(0.15 + rng() * 0.2).toFixed(2)}" />`;
  }
  return out;
}

/** 3D render: metallic geometric facets with a highlight. */
function build3DShapes(
  rng: () => number,
  w: number,
  h: number,
  palette: Palette,
  id: string,
): string {
  let out = "";
  // Metallic linear gradient for facets
  out += `<linearGradient id="metal-${id}" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#e2e8f0" />
    <stop offset="50%" stop-color="#94a3b8" />
    <stop offset="100%" stop-color="#475569" />
  </linearGradient>`;
  // Polygon facets
  const facets = 5 + Math.floor(rng() * 5);
  for (let i = 0; i < facets; i++) {
    const cx = Math.floor(rng() * w);
    const cy = Math.floor(rng() * h);
    const size = 40 + Math.floor(rng() * 120);
    const rotation = Math.floor(rng() * 360);
    const color = palette.shapes[i % palette.shapes.length];
    const opacity = (0.4 + rng() * 0.4).toFixed(2);
    // Irregular quadrilateral
    const pts = [
      [0, -size],
      [size * (0.7 + rng() * 0.5), -size * 0.2],
      [size * 0.6, size * 0.8],
      [-size * 0.7, size * 0.3],
    ]
      .map((p) => p.join(","))
      .join(" ");
    out += `<polygon points="${pts}" fill="${color}" fill-opacity="${opacity}" transform="translate(${cx} ${cy}) rotate(${rotation})" />`;
    // Edge highlight
    out += `<polygon points="${pts}" fill="none" stroke="url(#metal-${id})" stroke-width="1.5" stroke-opacity="0.6" transform="translate(${cx} ${cy}) rotate(${rotation})" />`;
  }
  return out;
}

/** Painting: overlapping blurred circles in oil-palette colors. */
function buildPaintingShapes(
  rng: () => number,
  w: number,
  h: number,
  palette: Palette,
): string {
  let out = "";
  const count = 10 + Math.floor(rng() * 10);
  for (let i = 0; i < count; i++) {
    const cx = Math.floor(rng() * w);
    const cy = Math.floor(rng() * h);
    const r = 30 + Math.floor(rng() * 100);
    const color = palette.shapes[i % palette.shapes.length];
    const opacity = (0.3 + rng() * 0.4).toFixed(2);
    // SVG blur via inline filter on each circle is expensive; use opacity
    // layering + a soft radial fill to fake painterly strokes.
    out += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" fill-opacity="${opacity}" style="filter:blur(${Math.floor(r * 0.2)}px)" />`;
  }
  // Brush stroke accents
  const strokes = 4 + Math.floor(rng() * 4);
  for (let i = 0; i < strokes; i++) {
    const x1 = Math.floor(rng() * w);
    const y1 = Math.floor(rng() * h);
    const x2 = x1 + Math.floor((rng() - 0.5) * 200);
    const y2 = y1 + Math.floor((rng() - 0.5) * 200);
    const color = palette.shapes[i % palette.shapes.length];
    out += `<path d="M${x1} ${y1} Q${(x1 + x2) / 2 + (rng() - 0.5) * 60} ${(y1 + y2) / 2 + (rng() - 0.5) * 60} ${x2} ${y2}" stroke="${color}" stroke-width="${8 + Math.floor(rng() * 16)}" stroke-opacity="${(0.4 + rng() * 0.3).toFixed(2)}" stroke-linecap="round" fill="none" style="filter:blur(3px)" />`;
  }
  return out;
}

/** Sketch: monochrome graphite — thin line patterns + cross-hatching. */
function buildSketchShapes(
  rng: () => number,
  w: number,
  h: number,
): string {
  let out = "";
  // Cross-hatching patches
  const patches = 4 + Math.floor(rng() * 4);
  for (let i = 0; i < patches; i++) {
    const x = Math.floor(rng() * w);
    const y = Math.floor(rng() * h);
    const pw = 80 + Math.floor(rng() * 160);
    const ph = 80 + Math.floor(rng() * 160);
    const angle = Math.floor(rng() * 180);
    const opacity = (0.15 + rng() * 0.25).toFixed(2);
    out += `<g transform="translate(${x} ${y}) rotate(${angle})" stroke="#1a1a1a" stroke-width="1" stroke-opacity="${opacity}">`;
    const spacing = 6 + Math.floor(rng() * 6);
    for (let lx = 0; lx < pw; lx += spacing) {
      out += `<line x1="${lx}" y1="0" x2="${lx}" y2="${ph}" />`;
    }
    for (let ly = 0; ly < ph; ly += spacing) {
      out += `<line x1="0" y1="${ly}" x2="${pw}" y2="${ly}" />`;
    }
    out += `</g>`;
  }
  // Soft graphite gradient blob (the "subject" hint)
  const cx = Math.floor(rng() * w);
  const cy = Math.floor(rng() * h);
  const r = 60 + Math.floor(rng() * 80);
  out += `<radialGradient id="sketch-blob" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#1a1a1a" stop-opacity="0.5" />
    <stop offset="100%" stop-color="#1a1a1a" stop-opacity="0" />
  </radialGradient>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#sketch-blob)" />`;
  // Outline contour
  out += `<ellipse cx="${cx}" cy="${cy}" rx="${r * 0.7}" ry="${r * 0.5}" fill="none" stroke="#1a1a1a" stroke-width="1.5" stroke-opacity="0.6" />`;
  return out;
}

/* ---------- Film grain noise ---------- */

function buildGrain(id: string): string {
  return `<filter id="grain-${id}" x="0%" y="0%" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
    <feColorMatrix type="saturate" values="0" />
    <feComponentTransfer>
      <feFuncA type="linear" slope="0.06" />
    </feComponentTransfer>
    <feComposite operator="over" in2="SourceGraphic" />
  </filter>`;
}

/* ---------- Vignette ---------- */

function buildVignette(id: string): string {
  return `<radialGradient id="vignette-${id}" cx="50%" cy="50%" r="60%">
    <stop offset="55%" stop-color="#000000" stop-opacity="0" />
    <stop offset="100%" stop-color="#000000" stop-opacity="0.5" />
  </radialGradient>`;
}

/* ---------- Prompt text strip (subtle, clipped to bottom) ---------- */

function buildPromptStrip(prompt: string, w: number, h: number, id: string): string {
  if (!prompt) return "";
  // Clip to a bottom strip
  const stripHeight = Math.min(64, Math.floor(h * 0.12));
  const text = escapeXml(prompt).slice(0, 140);
  const fontSize = Math.max(11, Math.floor(w / 60));
  return `
  <clipPath id="prompt-clip-${id}">
    <rect x="0" y="${h - stripHeight}" width="${w}" height="${stripHeight}" />
  </clipPath>
  <g clip-path="url(#prompt-clip-${id})">
    <rect x="0" y="${h - stripHeight}" width="${w}" height="${stripHeight}" fill="rgba(0,0,0,0.35)" />
    <text x="${Math.floor(w * 0.04)}" y="${h - Math.floor(stripHeight * 0.4)}" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="${fontSize}" fill="#ffffff" fill-opacity="0.7" font-weight="500">${text}</text>
  </g>`;
}

/* ---------- Driftframe watermark (corner) ---------- */

function buildWatermark(w: number, h: number): string {
  const fontSize = Math.max(10, Math.floor(w / 80));
  const pad = Math.max(12, Math.floor(w * 0.025));
  return `<text x="${w - pad}" y="${h - pad}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="${fontSize}" fill="#ffffff" fill-opacity="0.35" font-weight="700" text-anchor="end" letter-spacing="2">${WATERMARK}</text>`;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/* ============================================================
 * Public entry point — generate `count` images for a prompt.
 * ============================================================ */

/**
 * Generate `count` images for a prompt.
 *
 * Demo: returns local SVG generative art as base64 data URLs, seeded by
 * a hash of prompt+style, so the same prompt yields consistent-but-varied
 * results across the batch (seed + i).
 */
export async function generateImages(
  prompt: string,
  count: number,
  aspectRatio: string,
  style: string,
): Promise<GeneratedImage[]> {
  const dims = aspectToDimensions(aspectRatio);
  const seedBase = hashString(`${prompt}::${style}`);

  // Simulate model latency so the shimmer + progress ring is visible.
  await new Promise((resolve) => setTimeout(resolve, 1400));

  return Array.from({ length: count }, (_, i) => {
    const seed = seedBase + i * 7919; // distinct-but-related seeds per batch
    const url = generateSvgArt({
      prompt,
      style,
      seed,
      width: dims.width,
      height: dims.height,
    });
    return {
      url,
      width: dims.width,
      height: dims.height,
    };
  });
}
