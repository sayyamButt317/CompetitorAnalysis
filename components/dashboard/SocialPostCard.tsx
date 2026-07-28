import type { CompetitorPostsGroup, SocialPost } from "@/types/dashboard";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { PostMediaPreview } from "@/components/media/PostMediaPreview";
import { formatNumber } from "@/lib/format";

const typeIcons = {
  reel: (
    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  carousel: (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 0-2-2M5 11V9a2 2 0 0 1 2-2m0 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7h10" />
    </svg>
  ),
  image: (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
    </svg>
  ),
};

interface SocialPostCardProps {
  post: SocialPost;
}

export function SocialPostCard({ post }: SocialPostCardProps) {
  return (
    <Card padding="sm" className="flex w-52 shrink-0 flex-col overflow-hidden p-0">
      <div className="flex items-center gap-2 px-3 pt-3">
        <Avatar name={post.name} size="sm" />
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-slate-800">{post.handle}</p>
        </div>
      </div>

      <PostMediaPreview
        type={post.type}
        title={post.title}
        gradient={post.gradient}
        mediaUrl={post.mediaUrl}
        thumbnailUrl={post.thumbnailUrl}
        permalink={post.permalink}
        typeIcon={typeIcons[post.type]}
      />

      <div className="flex items-center justify-between px-3 py-2 text-[10px] text-slate-500">
        <span className="flex items-center gap-1">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
          {formatNumber(post.likes)}
        </span>
        <span className="flex items-center gap-1">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.902-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
          </svg>
          {formatNumber(post.comments)}
        </span>
        <span className="flex items-center gap-1">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
          </svg>
          {formatNumber(post.shares)}
        </span>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 px-3 py-2 text-[10px]">
        <span className="font-semibold text-indigo-600">{post.engagementRate}% ER</span>
        <span className="text-slate-400">{post.postedAgo}</span>
      </div>
    </Card>
  );
}

interface TopPerformingPostsProps {
  groups: CompetitorPostsGroup[];
}

export function TopPerformingPosts({ groups }: TopPerformingPostsProps) {
  if (groups.length === 0) {
    return <p className="text-sm text-slate-500">No posts available.</p>;
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <section key={group.handle}>
          <div className="mb-3 flex items-center gap-2.5">
            <Avatar name={group.name} size="sm" />
            <div>
              <h4 className="text-sm font-semibold text-slate-800">{group.handle}</h4>
              <p className="text-xs text-slate-400">
                {group.posts.length} post{group.posts.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 [transform:translateZ(0)] [backface-visibility:hidden]">
            {group.posts.map((post) => (
              <SocialPostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
