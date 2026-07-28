"use client";

import { ImageViewer } from "@/components/media/ImageViewer";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import type { MediaKind } from "@/lib/media";

interface MediaLightboxProps {
  open: boolean;
  onClose: () => void;
  kind: MediaKind;
  src: string;
  poster?: string;
  title?: string;
  permalink?: string;
}

export function MediaLightbox({
  open,
  onClose,
  kind,
  src,
  poster,
  title,
  permalink,
}: MediaLightboxProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8">
      <div
        className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3">
          <p className="truncate text-sm font-medium text-white">{title ?? "Media preview"}</p>
          <div className="flex shrink-0 items-center gap-2">
            {permalink && (
              <a
                href={permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-indigo-300 hover:bg-white/10"
              >
                Open original
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
              aria-label="Close viewer"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center bg-black">
          {kind === "video" ? (
            <VideoPlayer
              src={src}
              poster={poster}
              className="max-h-[calc(90vh-56px)] w-full"
              controls
              autoPlay
            />
          ) : (
            <ImageViewer
              src={src}
              alt={title ?? "Post media"}
              className="flex max-h-[calc(90vh-56px)] w-full items-center justify-center"
              imgClassName="max-h-[calc(90vh-56px)] w-full object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
}
