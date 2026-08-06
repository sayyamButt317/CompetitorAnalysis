"use client";

import { PostMediaPreview } from "@/components/media/PostMediaPreview";
import { formatEngagementRate, formatNumber } from "@/lib/format";
import type { OverviewMediaPost } from "@/types/overview";

const POST_GRADIENTS = [
  "from-violet-600 via-purple-600 to-fuchsia-500",
  "from-blue-600 via-indigo-600 to-purple-600",
  "from-rose-500 via-pink-600 to-orange-400",
  "from-emerald-600 via-teal-600 to-cyan-500",
  "from-amber-500 via-orange-500 to-red-500",
];

const typeIcons = {
  reel: (
    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  carousel: (
    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 0-2-2M5 11V9a2 2 0 0 1 2-2m0 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7h10"
      />
    </svg>
  ),
  image: (
    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
      />
    </svg>
  ),
};

function toPreviewType(post: OverviewMediaPost): "reel" | "carousel" | "image" {
  if (post.isVideo) return "reel";
  if (/carousel/i.test(post.mediaType)) return "carousel";
  return "image";
}

interface MediaPostCardProps {
  post: OverviewMediaPost;
  index: number;
}

export function MediaPostCard({ post, index }: MediaPostCardProps) {
  const previewType = toPreviewType(post);
  const title = post.caption || (post.ownerHandle ? `@${post.ownerHandle}` : "Instagram post");

  return (
    <article className="flex w-[220px] shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <PostMediaPreview
        type={previewType}
        title={title}
        gradient={POST_GRADIENTS[index % POST_GRADIENTS.length]}
        mediaUrl={post.mediaUrl}
        thumbnailUrl={post.thumbnailUrl}
        permalink={post.permalink}
        typeIcon={typeIcons[previewType]}
        containerClassName="aspect-[4/5] w-full rounded-none"
      />

      <div className="flex flex-1 flex-col gap-2 p-3">
        {post.ownerHandle && (
          <p className="truncate text-[11px] font-medium text-slate-500">@{post.ownerHandle}</p>
        )}
        <p className="line-clamp-3 text-xs leading-relaxed text-slate-700">{post.caption}</p>
        <div className="mt-auto flex items-center justify-between gap-2 text-[11px] text-slate-500">
          <span>{formatNumber(post.likes)} likes</span>
          <span>{formatNumber(post.comments)} comments</span>
        </div>
        {post.engagementRate != null && (
          <p className="text-[11px] font-semibold text-indigo-600">
            {formatEngagementRate(post.engagementRate)} ER
          </p>
        )}
        {post.permalink && (
          <a
            href={post.permalink}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium text-sky-700 hover:text-sky-800"
          >
            Open on Instagram →
          </a>
        )}
      </div>
    </article>
  );
}

interface MediaRailProps {
  title: string;
  subtitle?: string;
  posts: OverviewMediaPost[];
  emptyLabel?: string;
}

export function OverviewMediaRail({
  title,
  subtitle,
  posts,
  emptyLabel = "No Instagram media in this analysis.",
}: MediaRailProps) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
      </div>

      {posts.length === 0 ? (
        <p className="text-sm text-slate-500">{emptyLabel}</p>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {posts.map((post, index) => (
            <MediaPostCard key={post.id} post={post} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}
