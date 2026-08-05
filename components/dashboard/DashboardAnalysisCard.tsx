import Link from "next/link";
import type { AnalysisListCardModel } from "@/lib/map-analysis-list-card";

interface DashboardAnalysisCardProps {
  card: AnalysisListCardModel;
  deleting?: boolean;
  onDelete: (id: string) => void;
}

const mixToneClass: Record<AnalysisListCardModel["contentMix"][number]["tone"], string> = {
  blue: "bg-sky-50 text-sky-700 ring-sky-100",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  purple: "bg-violet-50 text-violet-700 ring-violet-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  slate: "bg-slate-100 text-slate-600 ring-slate-200",
};

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

function TrashIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

export function DashboardAnalysisCard({
  card,
  deleting = false,
  onDelete,
}: DashboardAnalysisCardProps) {
  const relevancePct =
    card.relevanceScore != null ? Math.round(Math.min(Math.max(card.relevanceScore, 0), 1) * 100) : 0;
  const relevanceColor =
    card.relevanceLabel === "High"
      ? "bg-emerald-500"
      : card.relevanceLabel === "Medium"
        ? "bg-amber-500"
        : card.relevanceLabel === "Low"
          ? "bg-rose-500"
          : "bg-slate-300";
  const relevanceText =
    card.relevanceLabel === "High"
      ? "text-emerald-600"
      : card.relevanceLabel === "Medium"
        ? "text-amber-600"
        : card.relevanceLabel === "Low"
          ? "text-rose-600"
          : "text-slate-400";

  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md lg:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
        <div className="flex min-w-[180px] items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
            {card.initials}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-slate-900">{card.companyName}</h2>
            <span
              className={`mt-1.5 inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                card.status === "success"
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                  : card.status === "failed"
                    ? "bg-rose-50 text-rose-700 ring-1 ring-rose-100"
                    : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
              }`}
            >
              {card.statusLabel}
            </span>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <PinIcon />
              {card.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <UsersIcon />
              {card.competitorCount} competitors
            </span>
            <span className="inline-flex items-center gap-1.5">
              <PostsIcon />
              {card.postCount} posts
            </span>
          </div>

          <p className="mt-2 text-sm leading-relaxed text-slate-600">{card.summary}</p>

          {card.status === "failed" || card.errorMessage ? (
            <div className="mt-3 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {card.errorMessage ||
                "No content mix could be computed from competitor posts."}
            </div>
          ) : card.contentMix.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {card.contentMix.map((item) => (
                <span
                  key={item.label}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${mixToneClass[item.tone]}`}
                >
                  {item.label} {item.share.toFixed(item.share % 1 === 0 ? 0 : 1)}%
                </span>
              ))}
            </div>
          ) : null}

          {(card.topTheme || card.contentGaps.length > 0 || card.techGaps.length > 0) && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {card.topTheme && (
                <span className="rounded-md bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700">
                  Top Theme · {card.topTheme}
                </span>
              )}
              {card.contentGaps.map((gap) => (
                <span
                  key={`content-${gap}`}
                  className="rounded-md bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700"
                >
                  Content Gaps · {gap}
                </span>
              ))}
              {card.techGaps.map((gap) => (
                <span
                  key={`tech-${gap}`}
                  className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700"
                >
                  Tech Gaps · {gap}
                </span>
              ))}
            </div>
          )}

          <p className="mt-3 text-xs text-slate-400">
            {formatDate(card.createdAt)}
            {card.id ? ` · ${card.id.slice(0, 12)}` : ""}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-stretch gap-3 sm:flex-row sm:items-center xl:w-48 xl:flex-col xl:items-end">
          <div className="w-full min-w-[140px] xl:text-right">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Relevance Score
            </p>
            <div className="mt-1 flex items-end justify-between gap-2 xl:justify-end">
              <p className="text-xl font-bold text-slate-900">
                {card.relevanceScore != null ? card.relevanceScore.toFixed(3) : "—"}
              </p>
              <span className={`pb-0.5 text-xs font-semibold ${relevanceText}`}>
                {card.relevanceLabel}
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${relevanceColor}`}
                style={{ width: `${relevancePct}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {card.id ? (
              <Link
                href={`/dashboard/${card.id}`}
                className="inline-flex items-center justify-center rounded-lg border border-indigo-200 bg-white px-3.5 py-2 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-50"
              >
                View Details
              </Link>
            ) : (
              <span className="inline-flex cursor-not-allowed items-center justify-center rounded-lg border border-slate-100 bg-slate-50 px-3.5 py-2 text-sm font-medium text-slate-400">
                View Details
              </span>
            )}
            <button
              type="button"
              disabled={!card.id || deleting}
              title="Delete analysis"
              aria-label={`Delete analysis for ${card.companyName}`}
              onClick={() => {
                if (card.id) onDelete(card.id);
              }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-rose-200 bg-white text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting ? (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-rose-200 border-t-rose-600" />
              ) : (
                <TrashIcon />
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function PinIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="3" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a3 3 0 0 1 0 5.74" />
    </svg>
  );
}

function PostsIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </svg>
  );
}
