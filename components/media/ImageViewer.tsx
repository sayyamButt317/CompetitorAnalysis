"use client";

import { useState, type ReactNode } from "react";

interface ImageViewerProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  fallback?: ReactNode;
  loading?: "lazy" | "eager";
  placeholderClassName?: string;
}

export function ImageViewer({
  src,
  alt,
  className = "",
  imgClassName = "h-full w-full object-cover",
  fallback,
  loading = "lazy",
  placeholderClassName = "bg-slate-900",
}: ImageViewerProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`flex items-center justify-center ${placeholderClassName} ${className}`}>
        {fallback ?? (
          <span className="px-3 text-center text-xs text-slate-400">Image unavailable</span>
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${placeholderClassName} ${className}`}>
      {!loaded && (
        <div className={`absolute inset-0 ${placeholderClassName}`} aria-hidden />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`${imgClassName} ${loaded ? "opacity-100" : "opacity-0"} transition-opacity duration-200`}
        loading={loading}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
