"use client";

import { useCallback, useEffect, useState } from "react";
import { AnalysisSetupModal } from "@/components/dashboard/AnalysisSetupModal";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { APP_COMPANY } from "@/lib/app-brand";
import { mapApiResponseToDashboard } from "@/lib/map-api-to-dashboard";
import { getNavItems } from "@/lib/nav-items";
import {
  CompetitorAnalysisApi,
  fetchCompetitorAnalysisResults,
} from "@/routes/route";
import type { CompetitorAnalysisRequest } from "@/types/api";
import type { DashboardData } from "@/types/dashboard";

const defaultCompany = {
  name: APP_COMPANY.name,
  logoInitials: APP_COMPANY.logoInitials,
};

export function DashboardResultsPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loadingResults, setLoadingResults] = useState(true);
  const [resultsError, setResultsError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<string | null>(null);

  const loadResults = useCallback(async () => {
    setLoadingResults(true);
    setResultsError(null);

    try {
      const response = await fetchCompetitorAnalysisResults();

      if (response.error && !response.competitors?.length && !response.success) {
        throw new Error(
          typeof response.error === "string" ? response.error : "Failed to load analysis results",
        );
      }

      const region = response.filters_applied?.region ?? "Global";
      setData(
        mapApiResponseToDashboard(response, {
          company_data: response.company_profile?.description ?? response.summary ?? "",
          region,
        }),
      );
    } catch (err) {
      setResultsError(err instanceof Error ? err.message : "Failed to load analysis results");
      setData(null);
    } finally {
      setLoadingResults(false);
    }
  }, []);

  useEffect(() => {
    void loadResults();
  }, [loadResults]);

  const handleSubmit = async (payload: CompetitorAnalysisRequest) => {
    setAnalyzing(true);
    setAnalysisError(null);
    setJobId(null);
    setJobStatus("Starting analysis...");

    try {
      const response = await CompetitorAnalysisApi(payload, {
        onJobStarted: (job) => {
          setJobId(job.job_id);
          setJobStatus(`Job started (${job.job_id})`);
        },
        onPoll: (job) => {
          const status = job.status ?? "running";
          setJobStatus(`Job ${job.job_id ?? jobId ?? ""} · ${status}`);
        },
      });

      if (response.error && !response.competitors?.length) {
        throw new Error(response.error);
      }

      setData(mapApiResponseToDashboard(response, payload));
      setModalOpen(false);
      setJobStatus(null);
      setJobId(null);

      void loadResults();
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setAnalyzing(false);
    }
  };

  const company = data?.company ?? defaultCompany;

  return (
    <DashboardLayout navItems={getNavItems("overview")} company={company}>
      <div className="relative min-h-full">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Dashboard</h1>
            <p className="text-xs text-slate-500">
              {analyzing && jobStatus
                ? jobStatus
                : loadingResults
                  ? "Loading latest analysis..."
                  : data
                    ? `Last updated ${data.lastUpdated}`
                    : "No saved analysis yet"}
            </p>
          </div>
          <Button
            type="button"
            variant="primary"
            onClick={() => {
              setAnalysisError(null);
              setModalOpen(true);
            }}
            disabled={analyzing}
          >
            Start Analysis
          </Button>
        </div>

        {loadingResults && (
          <div className="flex min-h-[60vh] items-center justify-center p-6">
            <div className="text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
              <p className="text-sm text-slate-500">Fetching competitor analysis results...</p>
            </div>
          </div>
        )}

        {!loadingResults && resultsError && !data && (
          <div className="flex min-h-[60vh] items-center justify-center p-6">
            <div className="max-w-md text-center">
              <div className="mx-auto mb-4 flex justify-center">
                <CompanyLogo variant="full" theme="light" name={APP_COMPANY.name} />
              </div>
              <p className="mb-2 text-sm font-medium text-slate-800">Couldn’t load results</p>
              <p className="mb-5 text-sm text-slate-500">{resultsError}</p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={() => void loadResults()}>
                  Retry
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setAnalysisError(null);
                    setModalOpen(true);
                  }}
                >
                  Start Analysis
                </Button>
              </div>
            </div>
          </div>
        )}

        {!loadingResults && !resultsError && !data && (
          <div className="flex min-h-[60vh] items-center justify-center p-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex justify-center">
                <CompanyLogo variant="full" theme="light" name={APP_COMPANY.name} />
              </div>
              <p className="mb-5 text-sm text-slate-500">
                No analysis results yet. Start a new competitor analysis.
              </p>
              <Button
                variant="primary"
                onClick={() => {
                  setAnalysisError(null);
                  setModalOpen(true);
                }}
              >
                Start Analysis
              </Button>
            </div>
          </div>
        )}

        {!loadingResults && data && <DashboardView data={data} embedded />}

        <AnalysisSetupModal
          open={modalOpen}
          loading={analyzing}
          error={analysisError}
          onClose={() => {
            if (!analyzing) setModalOpen(false);
          }}
          onSubmit={handleSubmit}
        />
      </div>
    </DashboardLayout>
  );
}
