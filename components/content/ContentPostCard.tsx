"use client";

import type { ContentPost } from "@/types/content";
import { PostMediaPreview } from "@/components/media/PostMediaPreview";
import { Card } from "@/components/ui/Card";
import { formatEngagementRate, formatNumber } from "@/lib/format";

const typeIcons = {
  reel: (
    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  carousel: (
    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 0-2-2M5 11V9a2 2 0 0 1 2-2m0 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7h10" />
    </svg>
  ),
  image: (
    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
    </svg>
  ),
};

interface ContentPostCardProps {
  post: ContentPost;
  viewMode?: "grid" | "list";
}

export function ContentPostCard({ post, viewMode = "grid" }: ContentPostCardProps) {
  if (viewMode === "list") {
    return (
      <Card padding="sm" className="flex gap-4 p-4">
        <div className="w-28 shrink-0">
          <PostMediaPreview
            type={post.type}
            title={post.title}
            gradient={post.gradient}
            mediaUrl={post.mediaUrl}
            thumbnailUrl={post.thumbnailUrl}
            permalink={post.permalink}
            typeIcon={typeIcons[post.type]}
            containerClassName="h-24 w-full"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-medium text-slate-700">{post.typeLabel}</span>
              <span>·</span>
              <span>{post.postedDate}</span>
              <span>·</span>
              <span>{post.handle}</span>
            </div>
            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
              {formatEngagementRate(post.engagementRate)}
            </span>
          </div>
          <p className="line-clamp-2 text-sm text-slate-700">{post.caption || post.title}</p>
          {post.hashtags.length > 0 && (
            <p className="mt-2 line-clamp-1 text-xs text-indigo-600">
              {post.hashtags.slice(0, 6).join(" ")}
            </p>
          )}
          <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
            <span>{formatNumber(post.likes)} likes</span>
            <span>{formatNumber(post.comments)} comments</span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="sm" className="flex flex-col overflow-hidden p-0">
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-[8px] font-bold text-white">
            IG
          </span>
          <span className="text-xs font-medium text-slate-600">{post.typeLabel}</span>
          <span className="text-xs text-slate-400">{post.postedDate}</span>
        </div>
        <button
          type="button"
          className="text-slate-400 hover:text-slate-600"
          aria-label="Post options"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>
      </div>

      <PostMediaPreview
        type={post.type}
        title={post.title}
        gradient={post.gradient}
        mediaUrl={post.mediaUrl}
        thumbnailUrl={post.thumbnailUrl}
        permalink={post.permalink}
        typeIcon={typeIcons[post.type]}
        containerClassName="mx-3 aspect-square w-[calc(100%-1.5rem)]"
      />

      <div className="flex flex-1 flex-col px-3 py-3">
        <p className="line-clamp-3 text-xs leading-relaxed text-slate-700">
          {post.caption || post.title}
        </p>

        {post.hashtags.length > 0 && (
          <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-indigo-600">
            {post.hashtags.slice(0, 8).join(" ")}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
              {formatNumber(post.likes)}
            </span>
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.902-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
              </svg>
              {formatNumber(post.comments)}
            </span>
          </div>
          <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
            {formatEngagementRate(post.engagementRate)}
          </span>
        </div>
      </div>
    </Card>
  );
}
