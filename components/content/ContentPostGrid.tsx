import type { ContentPost } from "@/types/content";
import { ContentPostCard } from "@/components/content/ContentPostCard";

interface ContentPostGridProps {
  posts: ContentPost[];
  viewMode: "grid" | "list";
}

export function ContentPostGrid({ posts, viewMode }: ContentPostGridProps) {
  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">
        <p className="text-sm text-slate-500">No posts match your filters.</p>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-3">
        {posts.map((post) => (
          <ContentPostCard key={post.id} post={post} viewMode="list" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {posts.map((post) => (
        <ContentPostCard key={post.id} post={post} viewMode="grid" />
      ))}
    </div>
  );
}
