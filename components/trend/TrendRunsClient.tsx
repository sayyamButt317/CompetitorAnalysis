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
import { fetchTrendList } from "@/routes/route";
import type { TrendListResponse, TrendRunSummary } from "@/types/trends";

function RunBadge({ run }: { run: TrendRunSummary }) {
  const isFull =
    (run.duration_sec ?? 0) >= 30 && /Reddit \+ X/i.test(run.summary ?? "");

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
        isFull ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
      }`}
    >
      {isFull ? "Full crawl" : "Quick run"}
    </span>
  );
}

export function TrendRunsClient() {
  const [data, setData] = useState<TrendListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchTrendList();
      if (!response.success && !response.trends?.length) {
        throw new Error("No saved trend runs found");
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
      <TrendPageShell title="Saved Trend Runs" description="All trend discovery runs stored in the backend.">
        <TrendLoadingState message="Loading saved runs..." />
      </TrendPageShell>
    );
  }

  if (error || !data) {
    return (
      <TrendPageShell title="Saved Trend Runs">
        <TrendErrorState message={error ?? "Failed to load runs"} onRetry={() => void load()} />
      </TrendPageShell>
    );
  }

  return (
    <TrendPageShell
      title="Saved Trend Runs"
      description={`${data.count} saved runs. Open a run to view the full Reddit, X, Facebook, and LinkedIn breakdown.`}
    >
      <Card padding="sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-500">
                <th className="px-3 pb-3 font-medium">Run ID</th>
                <th className="px-3 pb-3 font-medium">Created</th>
                <th className="px-3 pb-3 font-medium">Duration</th>
                <th className="px-3 pb-3 font-medium">Type</th>
                <th className="px-3 pb-3 font-medium">Summary</th>
                <th className="px-3 pb-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {data.trends.map((run) => (
                <tr key={run.trend_id} className="border-b border-slate-50 last:border-0">
                  <td className="px-3 py-3">
                    <code className="text-xs text-indigo-600">{run.trend_id.slice(0, 8)}…</code>
                  </td>
                  <td className="px-3 py-3 text-xs text-slate-500">
                    {formatTrendDate(run.created_at)}
                  </td>
                  <td className="px-3 py-3 text-xs text-slate-600">
                    {formatDuration(run.duration_sec)}
                  </td>
                  <td className="px-3 py-3">
                    <RunBadge run={run} />
                  </td>
                  <td className="max-w-md px-3 py-3 text-xs text-slate-600">
                    {truncateText(run.summary, 140)}
                  </td>
                  <td className="px-3 py-3 text-right">
                    <Link
                      href={`/trend/runs/${run.trend_id}`}
                      className="text-xs font-medium text-indigo-600 hover:underline"
                    >
                      Open
                    </Link>
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
