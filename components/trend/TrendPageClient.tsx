"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageStatusShell } from "@/components/layout/PageStatusShell";
import { TrendSubNavBar } from "@/components/trend/TrendPageShell";
import { TrendView } from "@/components/trend/TrendView";
import { mapGlobalTrendsToPage } from "@/lib/map-global-trends";
import { fetchGlobalTrends } from "@/routes/route";
import type { GlobalTrendsResponse, TrendsPageData } from "@/types/trends";

function hasTrendPayload(response: GlobalTrendsResponse): boolean {
  return Boolean(
    response.success ||
      response.trending_hashtags?.length ||
      response.source_breakdown?.length ||
      response.web_trends?.source_breakdown?.length ||
      response.trend_scores?.length,
  );
}

export function TrendPageClient() {
  const searchParams = useSearchParams();
  const trendId = searchParams.get("trend_id") ?? undefined;
  const [data, setData] = useState<TrendsPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Loading trending intelligence...");
  const [error, setError] = useState<string | null>(null);

  const loadTrends = useCallback(async () => {
    setLoading(true);
    setError(null);
    setLoadingMessage(
      trendId
        ? "Loading saved trend run..."
        : "Loading trends and social platform data (Reddit, X, LinkedIn)...",
    );

    try {
      const response = await fetchGlobalTrends({ trendId });
      if (!hasTrendPayload(response)) {
        throw new Error(response.error ?? "No trend data available");
      }
      setData(mapGlobalTrendsToPage(response));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [trendId]);

  useEffect(() => {
    void loadTrends();
  }, [loadTrends]);

  if (loading) {
    return (
      <PageStatusShell activeId="trends">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-slate-500">{loadingMessage}</p>
        </div>
      </PageStatusShell>
    );
  }

  if (error || !data) {
    return (
      <PageStatusShell activeId="trends">
        <div className="max-w-md rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm text-red-600">{error ?? "Failed to load data"}</p>
          <button
            type="button"
            onClick={() => void loadTrends()}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </PageStatusShell>
    );
  }

  return (
    <div>
      <TrendSubNavBar />
      <TrendView data={data} onRefresh={() => void loadTrends()} />
    </div>
  );
}
