"use client";

import { useCallback, useEffect, useState } from "react";
import { TrendView } from "@/components/trend/TrendView";
import {
  TrendErrorState,
  TrendLoadingState,
  TrendPageShell,
  TrendSubNavBar,
} from "@/components/trend/TrendPageShell";
import { mapGlobalTrendsToPage } from "@/lib/map-global-trends";
import { fetchTrendById } from "@/routes/route";
import type { GlobalTrendsResponse, TrendsPageData } from "@/types/trends";

interface TrendRunDetailClientProps {
  trendId: string;
}

function hasTrendPayload(response: GlobalTrendsResponse): boolean {
  return Boolean(
    response.success ||
      response.trending_hashtags?.length ||
      response.source_breakdown?.length ||
      response.web_trends?.source_breakdown?.length ||
      response.trend_scores?.length,
  );
}

export function TrendRunDetailClient({ trendId }: TrendRunDetailClientProps) {
  const [data, setData] = useState<TrendsPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchTrendById(trendId);
      if (!hasTrendPayload(response)) {
        throw new Error("No data found for this trend run");
      }
      setData(mapGlobalTrendsToPage(response));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [trendId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <TrendPageShell
        title="Trend Run Detail"
        description={`Loading run ${trendId}…`}
      >
        <TrendLoadingState message="Loading full trend run (Reddit, X, LinkedIn)..." />
      </TrendPageShell>
    );
  }

  if (error || !data) {
    return (
      <TrendPageShell title="Trend Run Detail">
        <TrendErrorState message={error ?? "Failed to load run"} onRetry={() => void load()} />
      </TrendPageShell>
    );
  }

  return (
    <div>
      <TrendSubNavBar />
      <div className="border-b border-slate-200 bg-white px-6 py-3 lg:px-8">
        <p className="text-xs text-slate-500">
          Run ID: <code className="text-indigo-600">{trendId}</code>
          {data.savedTrendId && data.savedTrendId !== trendId && (
            <>
              {" "}
              · Saved as <code>{data.savedTrendId}</code>
            </>
          )}
        </p>
      </div>
      <TrendView data={data} onRefresh={() => void load()} />
    </div>
  );
}
