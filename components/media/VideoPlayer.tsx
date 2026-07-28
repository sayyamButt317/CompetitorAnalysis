"use client";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  autoPlay?: boolean;
  playsInline?: boolean;
}

export function VideoPlayer({
  src,
  poster,
  className = "",
  controls = true,
  muted = false,
  loop = false,
  autoPlay = false,
  playsInline = true,
}: VideoPlayerProps) {
  return (
    <video
      src={src}
      poster={poster}
      controls={controls}
      muted={muted}
      loop={loop}
      autoPlay={autoPlay}
      playsInline={playsInline}
      preload={autoPlay ? "auto" : "metadata"}
      className={`bg-black object-cover ${className}`}
    />
  );
}
