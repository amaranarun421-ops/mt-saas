"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Heart,
  Download,
  RefreshCw,
  Globe,
  Lock,
  Loader2,
  ImageOff,
} from "lucide-react";

export interface ImageCardData {
  id: string;
  url: string;
  width?: number | null;
  height?: number | null;
  isFavorite: boolean;
  isPublic: boolean;
  prompt?: string;
  style?: string;
  aspectRatio?: string;
}

interface ImageCardProps {
  image: ImageCardData;
  /** Show the full action overlay (favorite/download/variation/visibility). */
  showActions?: boolean;
  onOpen?: (image: ImageCardData) => void;
  onToggleFavorite?: (image: ImageCardData) => void | Promise<void>;
  onTogglePublic?: (image: ImageCardData) => void | Promise<void>;
  onGenerateVariation?: (image: ImageCardData) => void;
  className?: string;
  /** Render with a fixed aspect ratio box (for skeleton-like placeholders). */
  aspectRatio?: string;
}

/**
 * Gallery image card — v3.
 *
 * Image rendering changes (complaint 5):
 *  - Removed the onLoad-gated blur-to-sharp reveal. Some browsers don't
 *    reliably fire `onLoad` for `data:` URLs, which left images stuck at
 *    `filter: blur(20px); opacity: 0.4` (appearing broken).
 *  - Now uses a CSS-only fade-in animation (`.driftframe-img`) that runs
 *    on mount — no JS, no onLoad dependency.
 *  - Every <img> has explicit width/height attributes derived from the
 *    image's aspect ratio so the box never collapses to 0×0.
 *  - Added `alt` text + an `onError` fallback that swaps in a clean
 *    "Image failed" placeholder.
 */
export function ImageCard({
  image,
  showActions = true,
  onOpen,
  onToggleFavorite,
  onTogglePublic,
  onGenerateVariation,
  className,
  aspectRatio,
}: ImageCardProps) {
  const [favBusy, setFavBusy] = React.useState(false);
  const [pubBusy, setPubBusy] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  const ratio =
    aspectRatio ??
    (image.width && image.height ? `${image.width} / ${image.height}` : "1 / 1");

  // Default intrinsic dimensions for the <img> attrs — keeps the box from
  // collapsing to 0×0 while the asset is still loading. Uses the actual
  // width/height when available, otherwise a sensible 1:1 default.
  const intrinsicW = image.width || 600;
  const intrinsicH = image.height || 600;

  async function handleFavorite(e: React.MouseEvent) {
    e.stopPropagation();
    if (!onToggleFavorite) return;
    setFavBusy(true);
    try {
      await onToggleFavorite(image);
    } finally {
      setFavBusy(false);
    }
  }

  async function handlePublic(e: React.MouseEvent) {
    e.stopPropagation();
    if (!onTogglePublic) return;
    setPubBusy(true);
    try {
      await onTogglePublic(image);
    } finally {
      setPubBusy(false);
    }
  }

  function handleDownload(e: React.MouseEvent) {
    e.stopPropagation();
    const trigger = (href: string, filename: string, isSvg: boolean) => {
      const a = document.createElement("a");
      a.href = href;
      a.download = isSvg ? `${filename}.svg` : `${filename}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    };
    const filename = `driftframe-${image.id}`;
    if (image.url.startsWith("data:")) {
      trigger(image.url, filename, image.url.startsWith("data:image/svg"));
      return;
    }
    fetch(image.url)
      .then((r) => r.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        trigger(url, filename, false);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      })
      .catch(() => trigger(image.url, filename, false));
  }

  function handleVariation(e: React.MouseEvent) {
    e.stopPropagation();
    onGenerateVariation?.(image);
  }

  return (
    <figure
      className={cn(
        "driftframe-card-hover group relative w-full overflow-hidden rounded-2xl border border-border bg-card cursor-pointer",
        className,
      )}
      style={{ aspectRatio: ratio }}
      onClick={() => onOpen?.(image)}
    >
      {failed ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted/40 text-muted-foreground">
          <ImageOff className="h-6 w-6" />
          <span className="text-xs">Image failed</span>
        </div>
      ) : (
        <img
          src={image.url}
          alt={image.prompt ?? "Generated image"}
          width={intrinsicW}
          height={intrinsicH}
          loading="lazy"
          onError={() => setFailed(true)}
          className="drift-img-fade h-full w-full object-cover driftframe-img"
        />
      )}

      {/* Hover overlay */}
      {showActions && (
        <figcaption className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="pointer-events-auto flex items-center gap-1.5">
            <ActionButton
              onClick={handleFavorite}
              active={image.isFavorite}
              label={image.isFavorite ? "Unfavorite" : "Favorite"}
              busy={favBusy}
            >
              <Heart
                className="h-4 w-4"
                fill={image.isFavorite ? "#ff3d81" : "none"}
                color={image.isFavorite ? "#ff3d81" : "currentColor"}
              />
            </ActionButton>

            <ActionButton onClick={handleDownload} label="Download">
              <Download className="h-4 w-4" />
            </ActionButton>

            {onGenerateVariation && (
              <ActionButton onClick={handleVariation} label="Generate variation">
                <RefreshCw className="h-4 w-4" />
              </ActionButton>
            )}

            {onTogglePublic && (
              <ActionButton
                onClick={handlePublic}
                active={image.isPublic}
                label={image.isPublic ? "Make private" : "Make public"}
                busy={pubBusy}
              >
                {image.isPublic ? (
                  <Globe className="h-4 w-4" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
              </ActionButton>
            )}
          </div>
        </figcaption>
      )}

      {/* Public badge (visible without hover on public images) */}
      {image.isPublic && !showActions && (
        <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur">
          <Globe className="h-3 w-3" /> Public
        </span>
      )}
    </figure>
  );
}

function ActionButton({
  children,
  onClick,
  active,
  busy,
  label,
}: {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  active?: boolean;
  busy?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white backdrop-blur transition-all hover:bg-white/25 active:scale-90 min-h-[44px] min-w-[44px]",
        active && "bg-white/20",
      )}
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
    </button>
  );
}
