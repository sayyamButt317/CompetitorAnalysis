"use client";

import { useCallback, useEffect, useState } from "react";
import { AnalysisSetupModal } from "@/components/dashboard/AnalysisSetupModal";
import { OverviewView } from "@/components/overview/OverviewView";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { APP_COMPANY } from "@/lib/app-brand";
import { mapApiResponseToOverview } from "@/lib/map-api-to-overview";
import { getNavItems } from "@/lib/nav-items";
import {
  CompetitorAnalysisApi,
  fetchCompetitorAnalysisResults,
} from "@/routes/route";
import type { CompetitorAnalysisRequest } from "@/types/api";
import type { OverviewPageData } from "@/types/overview";

const defaultCompany = {
  name: APP_COMPANY.name,
  logoInitials: APP_COMPANY.logoInitials,
};

export function OverviewResultPage() {
  const [data, setData] = useState<OverviewPageData | null>(null);
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
            : "Failed to load analysis results",
        );
      }

      setData(mapApiResponseToOverview(response));
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

      setData(mapApiResponseToOverview(response));
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

  const company = data
    ? { name: data.hero.name, logoInitials: data.hero.initials }
    : defaultCompany;

  return (
    <DashboardLayout navItems={getNavItems("overview")} company={company}>
      <div className="relative min-h-full bg-slate-50">
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs text-slate-400">Overview › Company Overview</p>
            <h1 className="text-lg font-semibold text-slate-900">Company Overview</h1>
            <p className="text-xs text-slate-500">
              {analyzing && jobStatus
                ? jobStatus
                : loadingResults
                  ? "Loading latest analysis..."
                  : data
                    ? `Last updated ${formatHeaderDate(data.lastUpdated)}`
                    : "No saved analysis yet"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" type="button" disabled>
              Export Report
            </Button>
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

        {!loadingResults && data && <OverviewView data={data} />}

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

function formatHeaderDate(value: string): string {
  try {
    return new Date(value).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}
