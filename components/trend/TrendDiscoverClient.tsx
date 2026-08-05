"use client";

import { useCallback, useState } from "react";
import { APP_COMPANY } from "@/lib/app-brand";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TrendDiscoverForm } from "@/components/trend/TrendDiscoverForm";
import { TrendSubNavBar } from "@/components/trend/TrendPageShell";
import { TrendView } from "@/components/trend/TrendView";
import { Card, CardHeader } from "@/components/ui/Card";
import { mapGlobalTrendsToPage } from "@/lib/map-global-trends";
import { getNavItems } from "@/lib/nav-items";
import { fetchCompanyBasedTrends } from "@/routes/route";
import type { CompanyBasedTrendsRequest, GlobalTrendsResponse, TrendsPageData } from "@/types/trends";

type ResultView = "dashboard" | "raw";

export function TrendDiscoverClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<GlobalTrendsResponse | null>(null);
  const [mappedData, setMappedData] = useState<TrendsPageData | null>(null);
  const [resultView, setResultView] = useState<ResultView>("dashboard");

  const handleSubmit = useCallback(async (payload: CompanyBasedTrendsRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchCompanyBasedTrends(payload);

      if (!response.success && !response.trending_hashtags?.length && !response.source_breakdown?.length) {
        throw new Error(response.error ?? "No trend data returned");
      }

      setRawResponse(response);
      setMappedData(mapGlobalTrendsToPage(response));
      setResultView("dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setRawResponse(null);
      setMappedData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCopyJson = () => {
    if (!rawResponse) return;
    void navigator.clipboard.writeText(JSON.stringify(rawResponse, null, 2));
  };

  if (mappedData && resultView === "dashboard") {
    return (
      <div>
        <TrendSubNavBar />
        <div className="border-b border-slate-200 bg-white px-6 py-3 lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setMappedData(null);
                setRawResponse(null);
              }}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              New Search
            </button>
            <button
              type="button"
              onClick={() => setResultView("raw")}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              View Raw JSON
            </button>
          </div>
        </div>
        <TrendView data={mappedData} navActiveId="trend-discover" />
      </div>
    );
  }

  if (rawResponse && resultView === "raw") {
    return (
      <DashboardLayout
        navItems={getNavItems("trend-discover")}
        company={{ name: APP_COMPANY.name, logoInitials: APP_COMPANY.logoInitials }}
      >
        <div className="space-y-5 p-6 lg:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setResultView("dashboard")}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              View Dashboard
            </button>
            <button
              type="button"
              onClick={() => {
                setMappedData(null);
                setRawResponse(null);
              }}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              New Search
            </button>
            <button
              type="button"
              onClick={handleCopyJson}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Copy JSON
            </button>
          </div>

          <Card>
            <CardHeader
              title="API Response"
              subtitle={
                rawResponse.success
                  ? `Mode: ${rawResponse.mode ?? "—"} · ${rawResponse.competitor_count ?? 0} sources`
                  : `Error: ${rawResponse.error ?? "Unknown"}`
              }
            />
            <pre className="max-h-[70vh] overflow-auto rounded-lg bg-slate-900 p-4 text-xs leading-relaxed text-slate-100">
              {JSON.stringify(rawResponse, null, 2)}
            </pre>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      navItems={getNavItems("trend-discover")}
      company={{ name: APP_COMPANY.name, logoInitials: APP_COMPANY.logoInitials }}
    >
      <TrendSubNavBar />
      <div className="mx-auto max-w-3xl space-y-5 p-6 lg:p-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Trend Discover</h1>
          <p className="mt-1 text-sm text-slate-500">
            Enter your company and social profiles to get a personalized trend analysis response.
          </p>
        </div>
        <TrendDiscoverForm loading={loading} error={error} onSubmit={handleSubmit} />
      </div>
    </DashboardLayout>
  );
}
