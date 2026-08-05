"use client";

import { useState } from "react";
import { AnalysisSetupModal } from "@/components/dashboard/AnalysisSetupModal";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { APP_COMPANY } from "@/lib/app-brand";
import { mapApiResponseToDashboard } from "@/lib/map-api-to-dashboard";
import { getNavItems } from "@/lib/nav-items";
import { CompetitorAnalysisApi } from "@/routes/route";
import type { CompetitorAnalysisRequest } from "@/types/api";
import type { DashboardData } from "@/types/dashboard";

const defaultCompany = {
  name: APP_COMPANY.name,
  logoInitials: APP_COMPANY.logoInitials,
};

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
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
      setModalOpen(false);
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
              <div className="mx-auto mb-4 flex justify-center">
                <CompanyLogo variant="full" theme="light" name={APP_COMPANY.name} />
              </div>
              <p className="mb-6 text-sm text-slate-500">
                {loading
                  ? "Running competitor analysis..."
                  : "Configure your analysis to get started"}
              </p>
              {!loading && (
                <Button variant="primary" onClick={() => setModalOpen(true)}>
                  Start Analysis
                </Button>
              )}
            </div>
          </div>
        )}

        {data && (
          <>
            <div className="flex justify-end px-6 pt-4">
              <Button variant="outline" onClick={() => setModalOpen(true)}>
                New Analysis
              </Button>
            </div>
            <DashboardView data={data} embedded />
          </>
        )}

        <AnalysisSetupModal
          open={modalOpen}
          loading={loading}
          error={error}
          onClose={() => {
            if (!loading) setModalOpen(false);
          }}
          onSubmit={handleSubmit}
        />
      </div>
    </DashboardLayout>
  );
}
