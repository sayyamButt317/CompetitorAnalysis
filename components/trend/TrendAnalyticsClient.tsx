"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  TrendErrorState,
  TrendLoadingState,
  TrendPageShell,
  formatDuration,
  formatTrendDate,
  truncateText,
} from "@/components/trend/TrendPageShell";
import { Card } from "@/components/ui/Card";
import { fetchTrendAnalytics } from "@/routes/route";
import type { TrendAnalyticsResponse, TrendGroupItem, TrendViralPost } from "@/types/trends";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="text-center">
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{label}</p>
    </Card>
  );
}

function ScoresTable({ items }: { items: TrendGroupItem[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-xs text-slate-500">
            <th className="pb-2 pr-4 font-medium">#</th>
            <th className="pb-2 pr-4 font-medium">Trend</th>
            <th className="pb-2 pr-4 font-medium">Type</th>
            <th className="pb-2 font-medium text-right">Score</th>
          </tr>
        </thead>
        <tbody>
          {items.slice(0, 15).map((item, index) => (
            <tr key={`${item.group_type}-${item.key}-${index}`} className="border-b border-slate-50">
              <td className="py-2.5 pr-4 text-xs text-slate-400">{index + 1}</td>
              <td className="max-w-xs py-2.5 pr-4 font-medium text-slate-900">{item.key}</td>
              <td className="py-2.5 pr-4 text-xs capitalize text-slate-500">
                {item.group_type?.replace("_", " ") ?? "—"}
              </td>
              <td className="py-2.5 text-right font-semibold text-indigo-600">
                {item.trend_score ?? item.post_count ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ViralPreview({ posts }: { posts: TrendViralPost[] }) {
  return (
    <ul className="divide-y divide-slate-100">
      {posts.slice(0, 5).map((post) => (
        <li key={post.id ?? post.permalink} className="flex gap-3 py-3">
          {post.thumbnail_url ? (
            <img
              src={post.thumbnail_url}
              alt=""
              className="h-16 w-16 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
              Reel
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-900">@{post.username ?? post.name}</p>
            <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{post.caption ?? "—"}</p>
            <p className="mt-1 text-xs text-slate-400">
              {(post.likes ?? post.like_count ?? 0).toLocaleString()} likes ·{" "}
              {(post.comments ?? post.comments_count ?? 0).toLocaleString()} comments
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function TrendAnalyticsClient() {
  const [data, setData] = useState<TrendAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchTrendAnalytics();
      if (!response.success && !response.overview) {
        throw new Error("No analytics data available");
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

  if (loading) {
    return (
      <TrendPageShell title="Trend Analytics" description="Consolidated overview from saved trend runs.">
        <TrendLoadingState message="Loading trend analytics..." />
      </TrendPageShell>
    );
  }

  if (error || !data) {
    return (
      <TrendPageShell title="Trend Analytics">
        <TrendErrorState message={error ?? "Failed to load analytics"} onRetry={() => void load()} />
      </TrendPageShell>
    );
  }

  const overview = data.overview;

  return (
    <TrendPageShell
      title="Trend Analytics"
      description="Overview, top scores, and viral posts from the latest saved trend run."
      action={
        data.trend_id ? (
          <Link
            href={`/trend/runs/${data.trend_id}`}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            View full run
          </Link>
        ) : undefined
      }
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Trend scores" value={data.trend_scores?.length ?? 0} />
        <StatCard label="Viral posts" value={data.viral_posts?.length ?? overview?.viral_post_count ?? 0} />
        <StatCard label="Duration" value={formatDuration(overview?.duration_sec)} />
        <StatCard label="Platform" value={overview?.platform ?? "instagram"} />
      </div>

      {overview?.summary && (
        <Card>
          <h3 className="mb-2 text-sm font-semibold text-slate-900">Summary</h3>
          <p className="text-sm leading-relaxed text-slate-600">{overview.summary}</p>
          <p className="mt-3 text-xs text-slate-400">
            Run ID: {data.trend_id ?? "—"} · {formatTrendDate(overview.created_at)}
          </p>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Top Trend Scores</h3>
            <Link href="/trend/scores" className="text-xs font-medium text-indigo-600 hover:underline">
              View all
            </Link>
          </div>
          <ScoresTable items={data.trend_scores ?? []} />
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Recent Viral Posts</h3>
            <Link href="/trend/viral-posts" className="text-xs font-medium text-indigo-600 hover:underline">
              View all
            </Link>
          </div>
          <ViralPreview posts={data.viral_posts ?? []} />
        </Card>
      </div>

      {(data.recent_runs?.length ?? 0) > 0 && (
        <Card>
          <h3 className="mb-4 text-sm font-semibold text-slate-900">Recent Runs</h3>
          <ul className="divide-y divide-slate-100">
            {data.recent_runs!.slice(0, 5).map((run) => (
              <li key={run.trend_id} className="flex items-start justify-between gap-4 py-3">
                <div className="min-w-0">
                  <Link
                    href={`/trend/runs/${run.trend_id}`}
                    className="font-mono text-xs text-indigo-600 hover:underline"
                  >
                    {run.trend_id}
                  </Link>
                  <p className="mt-1 text-sm text-slate-600">{truncateText(run.summary, 160)}</p>
                </div>
                <span className="shrink-0 text-xs text-slate-400">
                  {formatDuration(run.duration_sec)}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </TrendPageShell>
  );
}
