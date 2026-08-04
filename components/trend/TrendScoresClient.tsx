"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  TrendErrorState,
  TrendLoadingState,
  TrendPageShell,
} from "@/components/trend/TrendPageShell";
import { Card } from "@/components/ui/Card";
import { fetchTrendScores } from "@/routes/route";
import type { TrendGroupItem, TrendScoresResponse } from "@/types/trends";

const typeFilters = ["all", "hashtag", "topic", "reel_format", "google_trend"] as const;

function typeLabel(type?: string): string {
  switch (type) {
    case "hashtag":
      return "Hashtag";
    case "topic":
      return "Topic";
    case "reel_format":
      return "Reel Format";
    case "google_trend":
      return "Google Trend";
    default:
      return type ?? "Trend";
  }
}

export function TrendScoresClient() {
  const [data, setData] = useState<TrendScoresResponse | null>(null);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<(typeof typeFilters)[number]>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchTrendScores();
      if (!response.success && !response.trend_scores?.length) {
        throw new Error("No trend scores available");
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
    let items: TrendGroupItem[] = data?.trend_scores ?? [];
    if (typeFilter !== "all") {
      items = items.filter((item) => item.group_type === typeFilter);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter(
        (item) =>
          item.key.toLowerCase().includes(q) ||
          item.source?.toLowerCase().includes(q),
      );
    }
    return [...items].sort(
      (a, b) => (b.trend_score ?? b.post_count ?? 0) - (a.trend_score ?? a.post_count ?? 0),
    );
  }, [data?.trend_scores, query, typeFilter]);

  if (loading) {
    return (
      <TrendPageShell title="Trend Scores" description="Scored hashtags, topics, reel formats, and Google trends.">
        <TrendLoadingState message="Loading trend scores..." />
      </TrendPageShell>
    );
  }

  if (error || !data) {
    return (
      <TrendPageShell title="Trend Scores">
        <TrendErrorState message={error ?? "Failed to load scores"} onRetry={() => void load()} />
      </TrendPageShell>
    );
  }

  return (
    <TrendPageShell
      title="Trend Scores"
      description={`${data.count?.toLocaleString() ?? filtered.length} scored trends across ${data.run_count ?? 0} runs.`}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search trends..."
          className="w-full max-w-sm rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />

        <div className="flex flex-wrap gap-2">
          {typeFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setTypeFilter(filter)}
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                typeFilter === filter
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {filter.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <Card padding="sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-500">
                <th className="px-3 pb-3 font-medium">#</th>
                <th className="px-3 pb-3 font-medium">Trend</th>
                <th className="px-3 pb-3 font-medium">Type</th>
                <th className="px-3 pb-3 font-medium">Source</th>
                <th className="px-3 pb-3 font-medium text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 100).map((item, index) => (
                <tr key={`${item.group_type}-${item.key}-${index}`} className="border-b border-slate-50">
                  <td className="px-3 py-2.5 text-xs text-slate-400">{index + 1}</td>
                  <td className="max-w-xs px-3 py-2.5 font-medium text-slate-900">{item.key}</td>
                  <td className="px-3 py-2.5 text-xs text-slate-500">{typeLabel(item.group_type)}</td>
                  <td className="max-w-[180px] truncate px-3 py-2.5 text-xs text-slate-500">
                    {item.source ?? item.geo_label ?? "—"}
                  </td>
                  <td className="px-3 py-2.5 text-right font-semibold text-indigo-600">
                    {item.trend_score ?? item.post_count ?? item.traffic_score ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </TrendPageShell>
  );
}
