"use client";

import { useCallback, useEffect, useState } from "react";
import { CompetitorsView } from "@/components/competitors/CompetitorsView";
import { mapCompetitorsListToPage } from "@/lib/map-competitors-list";
import { fetchCompetitorsList } from "@/routes/route";
import type { CompetitorsPageData } from "@/types/competitors";

export function CompetitorsPageClient() {
  const [data, setData] = useState<CompetitorsPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCompetitors = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchCompetitorsList();
      if (!response.success && !response.competitors?.length) {
        throw new Error(response.error ?? "No competitor data available");
      }
      setData(mapCompetitorsListToPage(response));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCompetitors();
  }, [loadCompetitors]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-slate-500">Loading competitor analysis...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100 p-6">
        <div className="max-w-md rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm text-red-600">{error ?? "Failed to load data"}</p>
          <button
            type="button"
            onClick={() => void loadCompetitors()}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <CompetitorsView data={data} onRefresh={() => void loadCompetitors()} />;
}
