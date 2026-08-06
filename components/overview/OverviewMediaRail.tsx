import { formatEngagementRate, formatNumber } from "@/lib/format";
import type { OverviewMediaPost } from "@/types/overview";

interface MediaPostCardProps {
  post: OverviewMediaPost;
}

export function MediaPostCard({ post }: MediaPostCardProps) {
  const preview = post.thumbnailUrl ?? post.mediaUrl;
  const isDirectVideo =
    post.isVideo &&
    Boolean(post.mediaUrl) &&
    /\.(mp4|webm|mov)(\?|$)/i.test(post.mediaUrl ?? "");

  return (
    <article className="flex w-[220px] shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="relative aspect-[4/5] bg-slate-100">
        {isDirectVideo ? (
          <video
            src={post.mediaUrl}
            poster={post.thumbnailUrl}
            className="h-full w-full object-cover"
            controls
            muted
            playsInline
            preload="metadata"
          />
        ) : preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 text-xs text-slate-500">
            No preview
          </div>
        )}

        {post.isVideo && !isDirectVideo && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow">
              ▶
            </span>
          </div>
        )}

        <span className="absolute left-2 top-2 rounded-md bg-black/65 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
          {post.isVideo ? "Reel / Video" : post.mediaType}
        </span>
      </div>

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
          {posts.map((post) => (
            <MediaPostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
