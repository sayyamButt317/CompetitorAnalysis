"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnalysisSetupModal } from "@/components/dashboard/AnalysisSetupModal";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { APP_COMPANY } from "@/lib/app-brand";
import { getNavItems } from "@/lib/nav-items";
import {
  CompetitorAnalysisApi,
  deleteCompetitorAnalysisResultsById,
  fetchCompetitorAnalysisResultsAll,
} from "@/routes/route";
import type { CompetitorAnalysisRequest, CompetitorAnalysisResponse } from "@/types/api";

const defaultCompany = {
  name: APP_COMPANY.name,
  logoInitials: APP_COMPANY.logoInitials,
};

function TrashIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

function formatDate(iso?: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

function getAnalysisId(item: CompetitorAnalysisResponse): string | null {
  return item.meta?.analysis_id ?? null;
}

function getCompanyName(item: CompetitorAnalysisResponse): string {
  return (
    item.company_profile?.name ??
    item.company?.name ??
    item.company_analysis?.name ??
    item.company?.extracted_signals?.name ??
    "Untitled analysis"
  );
}

function getRegion(item: CompetitorAnalysisResponse): string {
  return (
    item.company_profile?.city ??
    item.company_profile?.region ??
    item.filters_applied?.region ??
    item.company_analysis?.region ??
    "—"
  );
}

function statusTone(item: CompetitorAnalysisResponse): {
  label: string;
  className: string;
} {
  const status = (item.meta?.status ?? (item.success ? "success" : "failed")).toLowerCase();
  if (item.success || status === "success" || status === "completed" || status === "succeeded") {
    return {
      label: "SUCCEEDED",
      className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
    };
  }
  if (status === "failed" || status === "error" || item.error) {
    return {
      label: "FAILED",
      className: "bg-rose-50 text-rose-700 ring-1 ring-rose-100",
    };
  }
  return {
    label: (status || "UNKNOWN").toUpperCase(),
    className: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
  };
}

function buildCompanySummary(item: CompetitorAnalysisResponse): string {
  if (item.error) return item.error;

  const companyName = getCompanyName(item);
  const industry =
    item.company_profile?.industry ??
    item.company_analysis?.industry ??
    item.analysis?.company?.industry;
  const region =
    item.filters_applied?.region ??
    item.company_profile?.region ??
    item.company_analysis?.region;
  const competitorCount = item.competitor_count ?? item.competitors?.length ?? 0;
  const postCount =
    item.post_count ??
    item.company_social_analysis?.user_instagram?.analysis?.post_count ??
    0;
  const niche =
    item.company_profile?.niche ??
    item.company_social_analysis?.detected_niche ??
    item.company_analysis?.detected_niche;
  const positioning =
    item.company_profile?.positioning ??
    item.company_social_analysis?.company_dna?.positioning ??
    item.company_analysis?.positioning;

  const ig = item.company_social_analysis?.user_instagram?.analysis;
  const mediaMix = (ig?.media_mix ?? [])
    .slice(0, 3)
    .map((entry) => {
      const label = entry.type ?? entry.format ?? "Content";
      const share =
        entry.share_pct != null
          ? `${Math.round(entry.share_pct)}%`
          : entry.count != null
            ? String(entry.count)
            : null;
      return share ? `${label} ${share}` : label;
    })
    .join(", ");

  const categories = (ig?.content_categories ?? [])
    .slice(0, 3)
    .map((entry) => entry.category)
    .filter(Boolean)
    .join(", ");

  const themes = (
    item.market_insights?.dominant_themes ??
    item.company_social_analysis?.user_linkedin?.content_themes ??
    []
  )
    .slice(0, 3)
    .map((entry) => (typeof entry === "string" ? entry : entry.theme))
    .filter(Boolean)
    .join(", ");

  const topMatches = (item.competitors ?? [])
    .slice()
    .sort((a, b) => (b.match_score ?? 0) - (a.match_score ?? 0))
    .slice(0, 2)
    .map((competitor) => {
      const handle = competitor.username ? `@${competitor.username}` : competitor.name;
      const score =
        competitor.match_score != null
          ? `relevance score ${competitor.match_score.toFixed(3)}`
          : null;
      return [handle, score].filter(Boolean).join(": ");
    })
    .filter(Boolean)
    .join(". ");

  const serviceGaps = (item.gap_analysis?.service_gaps ?? []).slice(0, 3).join(", ");
  const techGaps = (item.gap_analysis?.technology_gaps ?? []).slice(0, 3).join(", ");

  const parts: string[] = [];

  parts.push(
    [
      `Competitor analysis for ${companyName}.`,
      industry ? `Industry: ${industry}.` : null,
      region ? `Region focus: ${region}.` : null,
      `Smart-matched ${competitorCount} competitor account(s) and analyzed ${postCount} posts.`,
    ]
      .filter(Boolean)
      .join(" "),
  );

  if (topMatches) parts.push(topMatches + ".");
  if (niche) parts.push(`Detected niche: ${niche}.`);
  if (positioning) parts.push(`Positioning: ${positioning}.`);

  if (ig) {
    const eng = ig.avg_engagement_rate != null ? `${ig.avg_engagement_rate.toFixed(2)}% ER` : null;
    const format = ig.primary_format ? `primary format ${ig.primary_format}` : null;
    const mix = mediaMix ? `content mix ${mediaMix}` : null;
    const cats = categories ? `themes ${categories}` : null;
    const igLine = [eng, format, mix, cats].filter(Boolean).join("; ");
    if (igLine) parts.push(`Instagram: ${igLine}.`);
  }

  if (themes) parts.push(`Market themes: ${themes}.`);
  if (serviceGaps) parts.push(`Service gaps: ${serviceGaps}.`);
  if (techGaps) parts.push(`Technology gaps: ${techGaps}.`);

  if (parts.length <= 1 && item.summary) return item.summary;
  return parts.join(" ");
}

export function DashboardListPage() {
  const [results, setResults] = useState<CompetitorAnalysisResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadResults = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchCompetitorAnalysisResultsAll();
      setResults(response.results ?? []);
      setTotal(response.total ?? response.count ?? response.results?.length ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analyses");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadResults();
  }, [loadResults]);

  const handleSubmit = async (payload: CompetitorAnalysisRequest) => {
    setAnalyzing(true);
    setAnalysisError(null);
    setJobStatus("Starting analysis...");

    try {
      await CompetitorAnalysisApi(payload, {
        onJobStarted: (job) => setJobStatus(`Job started (${job.job_id})`),
        onPoll: (job) => setJobStatus(`Job ${job.job_id ?? ""} · ${job.status ?? "running"}`),
      });
      setModalOpen(false);
      setJobStatus(null);
      await loadResults();
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setDeleteError(null);
    try {
      await deleteCompetitorAnalysisResultsById(id);
      setResults((prev) => prev.filter((item) => getAnalysisId(item) !== id));
      setTotal((prev) => Math.max(0, prev - 1));
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete analysis");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <DashboardLayout navItems={getNavItems("dashboard")} company={defaultCompany}>
      <div className="min-h-full bg-slate-50/80">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200/80 bg-white px-6 py-5 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">
              {analyzing && jobStatus
                ? jobStatus
                : loading
                  ? "Loading analyses..."
                  : `${total} total analysis${total === 1 ? "" : "es"}`}
            </p>
          </div>
          <Button
            type="button"
            variant="primary"
            disabled={analyzing}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 shadow-md hover:from-indigo-700 hover:to-violet-700"
            onClick={() => {
              setAnalysisError(null);
              setModalOpen(true);
            }}
          >
            Start Analysis
          </Button>
        </div>

        <div className="space-y-4 p-6 lg:p-8">
          {deleteError && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {deleteError}
            </div>
          )}

          {loading && (
            <div className="flex min-h-[40vh] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
                <p className="text-sm text-slate-500">Fetching all analysis results...</p>
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
              <CompanyLogo variant="full" theme="light" name={APP_COMPANY.name} />
              <p className="mt-4 text-sm font-medium text-slate-800">Couldn’t load analyses</p>
              <p className="mt-1 mb-4 text-sm text-slate-500">{error}</p>
              <Button variant="outline" onClick={() => void loadResults()}>
                Retry
              </Button>
            </div>
          )}

          {!loading && !error && results.length === 0 && (
            <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
              <CompanyLogo variant="full" theme="light" name={APP_COMPANY.name} />
              <p className="mt-4 mb-4 text-sm text-slate-500">
                No saved analyses yet. Start a new competitor analysis.
              </p>
              <Button variant="primary" onClick={() => setModalOpen(true)}>
                Start Analysis
              </Button>
            </div>
          )}

          {!loading &&
            results.map((item, index) => {
              const id = getAnalysisId(item);
              const tone = statusTone(item);
              const companyName = getCompanyName(item);
              const region = getRegion(item);
              const competitorCount = item.competitor_count ?? item.competitors?.length ?? 0;
              const postCount =
                item.post_count ??
                item.company_social_analysis?.user_instagram?.analysis?.post_count ??
                0;
              const summary = buildCompanySummary(item);
              const isDeleting = id !== null && deletingId === id;
              const createdAt = formatDate(item.meta?.created_at ?? item.meta?.timestamp);

              return (
                <article
                  key={id ?? `${companyName}-${item.meta?.timestamp ?? index}`}
                  className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-colors hover:border-indigo-200 hover:shadow-md lg:p-6"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2.5">
                        <h2 className="text-base font-semibold text-slate-900">{companyName}</h2>
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${tone.className}`}
                        >
                          {tone.label}
                        </span>
                      </div>

                      <p className="text-sm text-slate-500">
                        {region} · {competitorCount} competitors · {postCount} posts
                      </p>

                      <p
                        className={`mt-3 text-sm leading-relaxed ${
                          item.error ? "text-rose-600" : "text-slate-600"
                        }`}
                      >
                        {summary}
                      </p>

                      <p className="mt-4 text-xs text-slate-400">
                        {createdAt}
                        {id ? ` · ${id.slice(0, 8)}…` : ""}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 self-start">
                      {id ? (
                        <Link
                          href={`/dashboard/${id}`}
                          className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                        >
                          View Detail
                        </Link>
                      ) : (
                        <span className="inline-flex cursor-not-allowed items-center justify-center rounded-lg border border-slate-100 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-400">
                          View Detail
                        </span>
                      )}
                      <button
                        type="button"
                        disabled={!id || isDeleting}
                        title="Delete analysis"
                        aria-label={`Delete analysis for ${companyName}`}
                        onClick={() => {
                          if (id) void handleDelete(id);
                        }}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-rose-200 bg-white text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isDeleting ? (
                          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-rose-200 border-t-rose-600" />
                        ) : (
                          <TrashIcon />
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
        </div>

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
