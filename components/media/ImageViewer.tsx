"use client";

import { useState, type ReactNode } from "react";

interface ImageViewerProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  fallback?: ReactNode;
}

export function ImageViewer({
  src,
  alt,
  className = "",
  imgClassName = "h-full w-full object-cover",
  fallback,
}: ImageViewerProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 ${className}`}>
        {fallback ?? (
          <span className="px-3 text-center text-xs text-slate-400">Image unavailable</span>
        )}
      </div>
    );
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={imgClassName}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
