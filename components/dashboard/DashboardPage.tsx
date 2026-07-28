"use client";

import { useState } from "react";
import { AnalysisSetupModal } from "@/components/dashboard/AnalysisSetupModal";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { mapApiResponseToDashboard } from "@/lib/map-api-to-dashboard";
import { getNavItems } from "@/lib/nav-items";
import { CompetitorAnalysisApi } from "@/routes/route";
import type { CompetitorAnalysisRequest } from "@/types/api";
import type { DashboardData } from "@/types/dashboard";

const defaultCompany = {
  name: "Techtimize LLC",
  logoInitials: "Tr",
};

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (payload: CompetitorAnalysisRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await CompetitorAnalysisApi(payload);

      if (response.error && !response.competitors?.length) {
        throw new Error(response.error);
      }

      setData(mapApiResponseToDashboard(response, payload));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const company = data?.company ?? defaultCompany;

  return (
    <DashboardLayout navItems={getNavItems("overview")} company={company}>
      <div className="relative min-h-full">
        {!data && (
          <div className="flex min-h-[calc(100vh-0px)] items-center justify-center bg-slate-100 p-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
                {company.logoInitials}
              </div>
              <p className="text-sm text-slate-500">
                {loading ? "Running competitor analysis..." : "Configure your analysis to get started"}
              </p>
            </div>
          </div>
        )}

        {data && <DashboardView data={data} embedded />}

        {!data && (
          <AnalysisSetupModal
            open
            loading={loading}
            error={error}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
