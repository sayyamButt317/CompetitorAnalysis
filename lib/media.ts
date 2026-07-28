export type MediaKind = "video" | "image";

export function isVideoMedia(
  type: "reel" | "carousel" | "image",
  mediaUrl?: string,
): boolean {
  if (type === "reel") return true;
  if (!mediaUrl) return false;
  return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(mediaUrl);
}

export function resolveMediaSource(
  mediaUrl?: string,
  thumbnailUrl?: string,
  type?: "reel" | "carousel" | "image",
): { kind: MediaKind; src: string; poster?: string } | null {
  const video = isVideoMedia(type ?? "image", mediaUrl);
  const src = video ? mediaUrl : mediaUrl ?? thumbnailUrl;

  if (!src) return null;

  return {
    kind: video ? "video" : "image",
    src,
    poster: video ? thumbnailUrl ?? mediaUrl : undefined,
  };
}
