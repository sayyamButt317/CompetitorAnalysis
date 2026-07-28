"use client";

import { useCallback, useEffect, useState } from "react";
import { HashtagView } from "@/components/hashtag/HashtagView";
import { PageStatusShell } from "@/components/layout/PageStatusShell";
import { mapHashtagListToPage } from "@/lib/map-hashtag-list";
import { fetchContentList, fetchHashtagList } from "@/routes/route";
import type { HashtagPageData } from "@/types/hashtag";

export function HashtagPageClient() {
  const [data, setData] = useState<HashtagPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHashtags = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [hashtagResponse, contentResponse] = await Promise.all([
        fetchHashtagList(),
        fetchContentList().catch(() => null),
      ]);

      if (!hashtagResponse.success && !hashtagResponse.hashtags?.length) {
        throw new Error(hashtagResponse.error ?? "No hashtag data available");
      }

      setData(
        mapHashtagListToPage(
          hashtagResponse,
          contentResponse ?? undefined,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHashtags();
  }, [loadHashtags]);

  if (loading) {
    return (
      <PageStatusShell activeId="hashtags">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-slate-500">Loading hashtags...</p>
        </div>
      </PageStatusShell>
    );
  }

  if (error || !data) {
    return (
      <PageStatusShell activeId="hashtags">
        <div className="max-w-md rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm text-red-600">{error ?? "Failed to load data"}</p>
          <button
            type="button"
            onClick={() => void loadHashtags()}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </PageStatusShell>
    );
  }

  return <HashtagView data={data} onRefresh={() => void loadHashtags()} />;
}
