"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  TrendErrorState,
  TrendLoadingState,
  TrendPageShell,
} from "@/components/trend/TrendPageShell";
import { Card } from "@/components/ui/Card";
import { fetchViralPosts } from "@/routes/route";
import type { TrendViralPost, ViralPostsResponse } from "@/types/trends";

function ViralPostCard({ post }: { post: TrendViralPost }) {
  const likes = post.likes ?? post.like_count ?? 0;
  const comments = post.comments ?? post.comments_count ?? 0;

  return (
    <Card padding="sm" className="flex flex-col overflow-hidden">
      {post.thumbnail_url ? (
        <img
          src={post.thumbnail_url}
          alt=""
          className="mb-3 h-40 w-full rounded-lg object-cover"
        />
      ) : (
        <div className="mb-3 flex h-40 items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-400">
          {post.is_reel ? "Reel" : "Post"}
        </div>
      )}

      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-slate-900">
            @{post.username ?? post.name ?? "unknown"}
          </p>
          {post.engagement_rate != null && (
            <span className="shrink-0 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
              {post.engagement_rate.toFixed(1)}% ER
            </span>
          )}
        </div>

        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-600">
          {post.caption ?? "No caption"}
        </p>

        <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
          <span>{likes.toLocaleString()} likes</span>
          <span>{comments.toLocaleString()} comments</span>
          {post.growth_rate != null && <span>{post.growth_rate.toFixed(1)}% growth</span>}
        </div>
      </div>

      {post.permalink && (
        <a
          href={post.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex text-xs font-medium text-indigo-600 hover:underline"
        >
          Open on Instagram
        </a>
      )}
    </Card>
  );
}

export function TrendViralPostsClient() {
  const [data, setData] = useState<ViralPostsResponse | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchViralPosts();
      if (!response.success && !response.viral_posts?.length) {
        throw new Error("No viral posts available");
      }
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const items = data?.viral_posts ?? [];
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (post) =>
        post.username?.toLowerCase().includes(q) ||
        post.caption?.toLowerCase().includes(q) ||
        post.name?.toLowerCase().includes(q),
    );
  }, [data?.viral_posts, query]);

  if (loading) {
    return (
      <TrendPageShell title="Viral Posts" description="Top viral Instagram posts from saved trend runs.">
        <TrendLoadingState message="Loading viral posts..." />
      </TrendPageShell>
    );
  }

  if (error || !data) {
    return (
      <TrendPageShell title="Viral Posts">
        <TrendErrorState message={error ?? "Failed to load viral posts"} onRetry={() => void load()} />
      </TrendPageShell>
    );
  }

  return (
    <TrendPageShell
      title="Viral Posts"
      description={`${data.count?.toLocaleString() ?? filtered.length} viral posts across ${data.run_count ?? 0} runs.`}
    >
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by username or caption..."
        className="w-full max-w-md rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.slice(0, 60).map((post) => (
          <ViralPostCard key={post.id ?? post.permalink ?? post.username} post={post} />
        ))}
      </div>
    </TrendPageShell>
  );
}
