import type { OverviewCompetitorCard } from "@/types/overview";
import type { SwotView } from "@/types/dashboard";

interface AiSummarySwotProps {
  summary?: string;
  swot?: SwotView;
}

const swotBlocks: {
  key: keyof SwotView;
  title: string;
  className: string;
  bullet: string;
}[] = [
  {
    key: "strengths",
    title: "Strengths",
    className: "border-emerald-100 bg-emerald-50/70",
    bullet: "bg-emerald-500",
  },
  {
    key: "weaknesses",
    title: "Weaknesses",
    className: "border-rose-100 bg-rose-50/70",
    bullet: "bg-rose-500",
  },
  {
    key: "opportunities",
    title: "Opportunities",
    className: "border-sky-100 bg-sky-50/70",
    bullet: "bg-sky-500",
  },
  {
    key: "threats",
    title: "Threats",
    className: "border-amber-100 bg-amber-50/70",
    bullet: "bg-amber-500",
  },
];

export function AiSummarySwot({ summary, swot }: AiSummarySwotProps) {
  if (!summary && !swot) return null;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-slate-800">AI Executive Summary</h3>
      {summary && (
        <p className="mb-5 text-sm leading-relaxed text-slate-600">
          {summary.length > 420 ? `${summary.slice(0, 417)}...` : summary}
        </p>
      )}

      {swot && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {swotBlocks.map((block) => {
            const items = swot[block.key];
            return (
              <div key={block.key} className={`rounded-xl border p-3 ${block.className}`}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                  {block.title}
                </p>
                {items.length === 0 ? (
                  <p className="text-xs text-slate-400">None listed</p>
                ) : (
                  <ul className="space-y-1.5">
                    {items.slice(0, 4).map((item) => (
                      <li key={item} className="flex gap-2 text-xs leading-relaxed text-slate-700">
                        <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${block.bullet}`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface TopCompetitorsStripProps {
  competitors: OverviewCompetitorCard[];
}

export function TopCompetitorsStrip({ competitors }: TopCompetitorsStripProps) {
  if (competitors.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <h3 className="mb-2 text-sm font-semibold text-slate-800">Top Competitors</h3>
        <p className="text-sm text-slate-500">
          No matched competitors in this run. Start a new analysis or broaden the region.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-slate-800">Top Competitors</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {competitors.map((competitor) => (
          <div
            key={competitor.id}
            className="rounded-xl border border-slate-100 bg-slate-50/80 p-3"
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-xs font-bold text-indigo-700">
                {competitor.initials}
              </div>
              {competitor.matchPct != null && (
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                  {competitor.matchPct}% Match
                </span>
              )}
            </div>
            <p className="truncate text-sm font-semibold text-slate-800">{competitor.name}</p>
            <p className="mt-1 truncate text-[11px] text-slate-400">
              {[competitor.industry, competitor.region].filter(Boolean).join(" · ") || "Competitor"}
            </p>
            {competitor.href ? (
              <a
                href={competitor.href}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-xs font-medium text-indigo-600 hover:text-indigo-700"
              >
                View Analysis →
              </a>
            ) : (
              <p className="mt-3 text-xs text-slate-400">Analysis pending</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
