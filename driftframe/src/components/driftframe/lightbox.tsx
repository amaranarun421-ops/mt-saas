"use client";

import * as React from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  Lock,
  Globe,
  ImageOff,
} from "lucide-react";
import type { ImageCardData } from "./image-card";

interface LightboxProps {
  images: ImageCardData[];
  index: number;
  open: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  /** Show owner actions (download/variation/visibility). */
  showOwnerActions?: boolean;
  onGenerateVariation?: (image: ImageCardData) => void;
}

/**
 * Fullscreen image viewer with backdrop blur, ESC to close, and prev/next.
 * Used on /dashboard/history and /gallery.
 */
export function Lightbox({
  images,
  index,
  open,
  onClose,
  onIndexChange,
  showOwnerActions = true,
  onGenerateVariation,
}: LightboxProps) {
  const image = images[index];
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    setFailed(false);
  }, [index, open]);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && index > 0) onIndexChange(index - 1);
      if (e.key === "ArrowRight" && index < images.length - 1)
        onIndexChange(index + 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, index, images.length, onClose, onIndexChange]);

  React.useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  if (!open || !image) return null;

  const canPrev = index > 0;
  const canNext = index < images.length - 1;

  function handleDownload() {
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
      .catch(() => window.open(image.url, "_blank"));
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Prev */}
      {canPrev && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onIndexChange(index - 1);
          }}
          aria-label="Previous image"
          className="absolute left-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      {/* Next */}
      {canNext && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onIndexChange(index + 1);
          }}
          aria-label="Next image"
          className="absolute right-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      {/* Content */}
      <div
        className="relative flex max-h-full max-w-5xl flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {failed ? (
          <div className="flex h-[60vh] w-[80vw] max-w-3xl flex-col items-center justify-center gap-3 rounded-2xl bg-white/5 text-white/70">
            <ImageOff className="h-8 w-8" />
            <p className="text-sm">This image could not be loaded.</p>
          </div>
        ) : (
          <img
            src={image.url}
            alt={image.prompt ?? "Generated image"}
            onError={() => setFailed(true)}
            className="driftframe-img max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
          />
        )}

        {(image.prompt || image.style) && (
          <div className="driftframe-glass w-full max-w-2xl rounded-xl p-4">
            {image.prompt && (
              <p className="text-sm text-foreground/90 line-clamp-3">
                {image.prompt}
              </p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {image.style && (
                <span className="rounded-full bg-muted px-2 py-0.5 capitalize">
                  {image.style.replace("-", " ")}
                </span>
              )}
              {image.aspectRatio && (
                <span className="rounded-full bg-muted px-2 py-0.5">
                  {image.aspectRatio}
                </span>
              )}
              {image.isPublic && (
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">
                  <Globe className="h-3 w-3" /> Public
                </span>
              )}
              {!image.isPublic && showOwnerActions && (
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">
                  <Lock className="h-3 w-3" /> Private
                </span>
              )}
            </div>

            {showOwnerActions && (
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#7c3aed] px-3 py-2 text-xs font-medium text-white hover:bg-[#6938ef] transition-colors min-h-[40px]"
                >
                  <Download className="h-4 w-4" /> Download
                </button>
                {onGenerateVariation && (
                  <button
                    type="button"
                    onClick={() => onGenerateVariation(image)}
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground hover:bg-muted/60 transition-colors min-h-[40px]"
                  >
                    <RefreshCw className="h-4 w-4" /> Generate variation
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
