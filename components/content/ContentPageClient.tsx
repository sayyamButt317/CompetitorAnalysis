"use client";

import { useCallback, useEffect, useState } from "react";
import { ContentView } from "@/components/content/ContentView";
import { PageStatusShell } from "@/components/layout/PageStatusShell";
import { mapContentListToPage } from "@/lib/map-content-list";
import { fetchContentList } from "@/routes/route";
import type { ContentPageData } from "@/types/content";

export function ContentPageClient() {
  const [data, setData] = useState<ContentPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContent = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchContentList();
      if (!response.success && !response.content?.length) {
        throw new Error(response.error ?? "No content data available");
      }
      setData(mapContentListToPage(response));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadContent();
  }, [loadContent]);

  if (loading) {
    return (
      <PageStatusShell activeId="content">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-slate-500">Loading content...</p>
        </div>
      </PageStatusShell>
    );
  }

  if (error || !data) {
    return (
      <PageStatusShell activeId="content">
        <div className="max-w-md rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm text-red-600">{error ?? "Failed to load data"}</p>
          <button
            type="button"
            onClick={() => void loadContent()}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </PageStatusShell>
    );
  }

  return <ContentView data={data} onRefresh={() => void loadContent()} />;
}
