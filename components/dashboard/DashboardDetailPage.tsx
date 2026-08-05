"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { APP_COMPANY } from "@/lib/app-brand";
import { mapApiResponseToDashboard } from "@/lib/map-api-to-dashboard";
import { getNavItems } from "@/lib/nav-items";
import { fetchCompetitorAnalysisResultsById } from "@/routes/route";
import type { DashboardData } from "@/types/dashboard";

const defaultCompany = {
  name: APP_COMPANY.name,
  logoInitials: APP_COMPANY.logoInitials,
};

interface DashboardDetailPageProps {
  analysisId: string;
}

export function DashboardDetailPage({ analysisId }: DashboardDetailPageProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadResult = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchCompetitorAnalysisResultsById(analysisId);

      const hasUsableData = Boolean(
        response.company_profile?.name ||
          response.company?.name ||
          response.company_analysis?.name ||
          response.company_social_analysis ||
          response.competitors?.length ||
          response.analysis?.swot,
      );

      if (!hasUsableData) {
        throw new Error(
          typeof response.error === "string" && response.error
            ? response.error
            : "Failed to load analysis",
        );
      }

      const region = response.filters_applied?.region ?? "Global";
      setData(
        mapApiResponseToDashboard(response, {
          company_data:
            response.company_profile?.description ??
            response.company_profile?.profile ??
            response.summary ??
            "",
          region,
        }),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analysis");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [analysisId]);

  useEffect(() => {
    void loadResult();
  }, [loadResult]);

  const company = data?.company ?? defaultCompany;

  return (
    <DashboardLayout navItems={getNavItems("dashboard")} company={company}>
      <div className="min-h-full">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Link
                href="/dashboard"
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
              >
                ← Dashboard
              </Link>
            </div>
            <h1 className="text-lg font-semibold text-slate-900">
              {data?.company.name ?? "Analysis detail"}
            </h1>
            <p className="text-xs text-slate-500">
              {loading
                ? "Loading analysis..."
                : data
                  ? `Last updated ${data.lastUpdated}`
                  : `ID ${analysisId}`}
            </p>
          </div>
          <Button variant="outline" onClick={() => void loadResult()} disabled={loading}>
            Refresh
          </Button>
        </div>

        {loading && (
          <div className="flex min-h-[60vh] items-center justify-center p-6">
            <div className="text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
              <p className="text-sm text-slate-500">Fetching analysis by ID...</p>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
            <CompanyLogo variant="full" theme="light" name={APP_COMPANY.name} />
            <p className="mt-4 text-sm font-medium text-slate-800">Couldn’t load this analysis</p>
            <p className="mt-1 mb-4 max-w-md text-sm text-slate-500">{error}</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => void loadResult()}>
                Retry
              </Button>
              <Link href="/dashboard">
                <Button variant="primary">Back to Dashboard</Button>
              </Link>
            </div>
          </div>
        )}

        {!loading && data && <DashboardView data={data} embedded />}
      </div>
    </DashboardLayout>
  );
}
