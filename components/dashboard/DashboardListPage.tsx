"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { AnalysisSetupModal } from "@/components/dashboard/AnalysisSetupModal";
import { DashboardAnalysisCard } from "@/components/dashboard/DashboardAnalysisCard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { APP_COMPANY } from "@/lib/app-brand";
import {
  buildDashboardListStats,
  mapAnalysisToListCard,
} from "@/lib/map-analysis-list-card";
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

const PAGE_SIZE = 5;

type StatusFilter = "all" | "success" | "failed";
type SortOption = "newest" | "oldest" | "relevance";

function formatShortDate(iso?: string): string {
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

function MiniRing({
  value,
  max = 100,
  color,
  label,
}: {
  value: number;
  max?: number;
  color: string;
  label: string;
}) {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const safeValue = Number.isFinite(value) ? value : 0;
  const pct = Math.min(Math.max(safeValue / max, 0), 1);
  const dash = pct * circumference;

  return (
    <div className="relative h-11 w-11 shrink-0">
      <svg viewBox="0 0 40 40" className="h-11 w-11 -rotate-90">
        <circle cx="20" cy="20" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="4" />
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-800">
        {label}
      </span>
    </div>
  );
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

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);

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

  const cards = useMemo(() => results.map(mapAnalysisToListCard), [results]);
  const stats = useMemo(() => buildDashboardListStats(results), [results]);

  const filteredCards = useMemo(() => {
    const q = query.trim().toLowerCase();
    let next = cards.filter((card) => {
      if (statusFilter !== "all" && card.status !== statusFilter) return false;
      if (!q) return true;
      return (
        card.companyName.toLowerCase().includes(q) ||
        card.location.toLowerCase().includes(q) ||
        card.summary.toLowerCase().includes(q) ||
        (card.id ?? "").toLowerCase().includes(q)
      );
    });

    next = [...next].sort((a, b) => {
      if (sortBy === "relevance") {
        return (b.relevanceScore ?? -1) - (a.relevanceScore ?? -1);
      }
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return sortBy === "oldest" ? aTime - bTime : bTime - aTime;
    });

    return next;
  }, [cards, query, statusFilter, sortBy]);

  const pageCount = Math.max(1, Math.ceil(filteredCards.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pagedCards = filteredCards.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  useEffect(() => {
    setPage(1);
  }, [query, statusFilter, sortBy]);

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
      setResults((prev) => prev.filter((item) => item.meta?.analysis_id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete analysis");
    } finally {
      setDeletingId(null);
    }
  };

  const showingFrom = filteredCards.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(currentPage * PAGE_SIZE, filteredCards.length);

  return (
    <DashboardLayout navItems={getNavItems("dashboard")} company={defaultCompany}>
      <div className="min-h-full bg-slate-50/80">
        <div className="border-b border-slate-200/80 bg-white px-6 py-5 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {total} saved analysis{total === 1 ? "" : "es"}
              </span>
            </div>
            <Button
              type="button"
              variant="primary"
              disabled={analyzing}
              className="bg-indigo-600 shadow-md hover:bg-indigo-700"
              onClick={() => {
                setAnalysisError(null);
                setModalOpen(true);
              }}
            >
              + Start New Analysis
            </Button>
          </div>
          {analyzing && jobStatus && (
            <p className="mt-2 text-xs text-indigo-600">{jobStatus}</p>
          )}
        </div>

        <div className="space-y-5 p-6 lg:p-8">
          {!loading && !error && (
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-6">
              <StatCard
                label="Total Analyses"
                value={String(stats.total)}
                hint="Saved runs"
                icon={<DocIcon />}
              />
              <StatCard
                label="Success Rate"
                value={`${stats.successRate}%`}
                hint={`${stats.successCount} Successful`}
                ring={
                  <MiniRing
                    value={stats.successRate}
                    color="#10b981"
                    label={`${stats.successRate}%`}
                  />
                }
              />
              <StatCard
                label="Avg. Relevance Score"
                value={stats.avgRelevance != null ? stats.avgRelevance.toFixed(2) : "—"}
                hint="Across all analyses"
                ring={
                  <MiniRing
                    value={(stats.avgRelevance ?? 0) * 100}
                    color="#7c3aed"
                    label={stats.avgRelevance != null ? stats.avgRelevance.toFixed(2) : "—"}
                  />
                }
              />
              <StatCard
                label="Content Analysis"
                value={String(stats.postsAnalyzed)}
                hint="Posts analyzed"
                icon={<UsersIcon />}
              />
              <StatCard
                label="Competitors Matched"
                value={String(stats.competitorsMatched)}
                hint="Total competitors"
                icon={<TeamIcon />}
              />
              <StatCard
                label="Last Analysis"
                value={formatShortDate(stats.lastAnalysisAt)}
                hint="Most recent run"
                icon={<CalendarIcon />}
                compactValue
              />
            </div>
          )}

          {!loading && !error && (
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm lg:flex-row lg:items-center lg:justify-between">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <SearchIcon />
                </span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search analyses..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-3 pl-9 text-sm text-slate-800 outline-none ring-indigo-200 placeholder:text-slate-400 focus:ring-2"
                />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-200"
                >
                  <option value="all">All Status</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as SortOption)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-200"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="relevance">Highest Relevance</option>
                </select>
              </div>
            </div>
          )}

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

          {!loading && !error && filteredCards.length === 0 && (
            <div className="flex min-h-[30vh] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white text-center">
              <CompanyLogo variant="full" theme="light" name={APP_COMPANY.name} />
              <p className="mt-4 mb-4 text-sm text-slate-500">
                {cards.length === 0
                  ? "No saved analyses yet. Start a new competitor analysis."
                  : "No analyses match your search or filters."}
              </p>
              {cards.length === 0 && (
                <Button variant="primary" onClick={() => setModalOpen(true)}>
                  + Start New Analysis
                </Button>
              )}
            </div>
          )}

          {!loading && !error && pagedCards.length > 0 && (
            <div className="space-y-4">
              {pagedCards.map((card) => (
                <DashboardAnalysisCard
                  key={card.id ?? card.companyName}
                  card={card}
                  deleting={card.id !== null && deletingId === card.id}
                  onDelete={(id) => void handleDelete(id)}
                />
              ))}
            </div>
          )}

          {!loading && !error && filteredCards.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  Previous
                </button>
                {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    className={`h-8 w-8 rounded-lg text-sm font-medium ${
                      pageNumber === currentPage
                        ? "bg-indigo-600 text-white"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={currentPage >= pageCount}
                  onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
              <p className="text-xs text-slate-500">
                Showing {showingFrom} to {showingTo} of {filteredCards.length} analyses
              </p>
            </div>
          )}
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

function StatCard({
  label,
  value,
  hint,
  icon,
  ring,
  compactValue = false,
}: {
  label: string;
  value: string;
  hint: string;
  icon?: ReactNode;
  ring?: ReactNode;
  compactValue?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p
            className={`font-bold text-slate-900 ${
              compactValue ? "truncate text-sm leading-snug" : "text-2xl"
            }`}
          >
            {value}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500">{hint}</p>
        </div>
        {ring ?? (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

function DocIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="3" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a3 3 0 0 1 0 5.74" />
    </svg>
  );
}

function TeamIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="9" cy="7" r="3" />
      <circle cx="17" cy="7" r="3" />
      <path d="M2 21v-2a4 4 0 0 1 4-4h2" />
      <path d="M14 15h2a4 4 0 0 1 4 4v2" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3-3" />
    </svg>
  );
}
