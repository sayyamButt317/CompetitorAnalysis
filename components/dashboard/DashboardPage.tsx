"use client";

import { useState } from "react";
import { AnalysisSetupModal } from "@/components/dashboard/AnalysisSetupModal";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { mapApiResponseToDashboard } from "@/lib/map-api-to-dashboard";
import { CompetitorAnalysisApi } from "@/routes/route";
import type { CompetitorAnalysisRequest } from "@/types/api";
import type { DashboardData } from "@/types/dashboard";

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

  return (
    <>
      {!data && (
        <div className="flex min-h-screen items-center justify-center bg-slate-100">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
              Tr
            </div>
            <p className="text-sm text-slate-500">
              {loading ? "Running competitor analysis..." : "Configure your analysis to get started"}
            </p>
          </div>
        </div>
      )}

      {data && <DashboardView data={data} />}

      <AnalysisSetupModal
        open={!data}
        loading={loading}
        error={error}
        onSubmit={handleSubmit}
      />
    </>
  );
}
