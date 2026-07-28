"use client";

import { useState } from "react";
import { ImageViewer } from "@/components/media/ImageViewer";
import { MediaLightbox } from "@/components/media/MediaLightbox";
import { resolveMediaSource } from "@/lib/media";

interface PostMediaPreviewProps {
  type: "reel" | "carousel" | "image";
  title: string;
  gradient: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  permalink?: string;
  typeIcon: React.ReactNode;
  containerClassName?: string;
}

export function PostMediaPreview({
  type,
  title,
  gradient,
  mediaUrl,
  thumbnailUrl,
  permalink,
  typeIcon,
  containerClassName = "mx-3 mt-2 h-28 w-[calc(100%-1.5rem)]",
}: PostMediaPreviewProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const media = resolveMediaSource(mediaUrl, thumbnailUrl, type);

  if (!media) {
    return (
      <div className={`relative flex items-end rounded-lg bg-gradient-to-br ${gradient} p-3 ${containerClassName}`}>
        <p className="text-xs font-semibold leading-snug text-white">{title}</p>
        <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/30 text-white">
          {typeIcon}
        </span>
      </div>
    );
  }

  const previewSrc =
    media.kind === "video"
      ? media.poster ?? thumbnailUrl ?? mediaUrl
      : media.src;

  const isVideo = media.kind === "video";

  return (
    <>
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className={`group relative block overflow-hidden rounded-lg bg-slate-900 text-left [transform:translateZ(0)] ${containerClassName}`}
        aria-label={`View ${media.kind}: ${title}`}
      >
        {previewSrc ? (
          <ImageViewer
            src={previewSrc}
            alt={title}
            className="h-full w-full"
            imgClassName="h-full w-full object-cover"
            loading="eager"
            placeholderClassName="bg-slate-900"
          />
        ) : (
          <div className={`h-full w-full bg-gradient-to-br ${gradient}`} />
        )}

        {isVideo && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20 transition group-hover:bg-black/30">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg">
              <svg className="ml-0.5 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        )}

        <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm">
          {typeIcon}
        </span>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 pt-6">
          <p className="line-clamp-2 text-[10px] font-medium leading-snug text-white">{title}</p>
        </div>
      </button>

      <MediaLightbox
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        kind={media.kind}
        src={media.src}
        poster={media.poster}
        title={title}
        permalink={permalink}
      />
    </>
  );
}
