"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  TrendErrorState,
  TrendLoadingState,
  TrendPageShell,
} from "@/components/trend/TrendPageShell";
import { Card } from "@/components/ui/Card";
import { fetchListOfHashtags } from "@/routes/route";
import type { ListOfHashtagsResponse } from "@/types/trends";

export function TrendHashtagsClient() {
  const [data, setData] = useState<ListOfHashtagsResponse | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchListOfHashtags();
      if (!response.success && !response.hashtags?.length) {
        throw new Error("No hashtag data available");
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
    const items = data?.hashtags ?? [];
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((item) => item.tag.toLowerCase().includes(q));
  }, [data?.hashtags, query]);

  const maxCount = filtered[0]?.count ?? 1;

  if (loading) {
    return (
      <TrendPageShell title="Trend Hashtags" description="Aggregated hashtags from all saved trend runs.">
        <TrendLoadingState message="Loading trend hashtags..." />
      </TrendPageShell>
    );
  }

  if (error || !data) {
    return (
      <TrendPageShell title="Trend Hashtags">
        <TrendErrorState message={error ?? "Failed to load hashtags"} onRetry={() => void load()} />
      </TrendPageShell>
    );
  }

  return (
    <TrendPageShell
      title="Trend Hashtags"
      description={`${data.total_unique?.toLocaleString() ?? filtered.length} unique hashtags across ${data.run_count ?? 0} runs.`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter hashtags..."
          className="w-full max-w-sm rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
        <p className="text-xs text-slate-500">
          Showing {filtered.length.toLocaleString()} hashtags
        </p>
      </div>

      <Card>
        <ul className="max-h-[70vh] space-y-2 overflow-y-auto">
          {filtered.slice(0, 200).map((item, index) => (
            <li key={item.tag} className="flex items-center gap-3">
              <span className="w-8 shrink-0 text-xs font-semibold text-slate-400">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate text-sm font-medium text-slate-900">
                    #{item.tag}
                  </span>
                  <span className="shrink-0 text-xs font-semibold text-indigo-600">
                    {item.count.toLocaleString()}
                  </span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </TrendPageShell>
  );
}
