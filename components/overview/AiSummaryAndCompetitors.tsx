import { displayText } from "@/lib/format";
import { Avatar } from "@/components/ui/Avatar";
import type {
  OverviewCompetitorCard,
  OverviewExecutiveBrief,
  OverviewExecutiveCompetitorHighlight,
} from "@/types/overview";
import type { SwotView } from "@/types/dashboard";

interface AiSummarySwotProps {
  brief?: OverviewExecutiveBrief;
  executiveSummary?: string;
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

export function AiSummarySwot({ brief, executiveSummary, swot }: AiSummarySwotProps) {
  if (!brief && !swot && !executiveSummary) return null;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-slate-800">AI Executive Summary</h3>

      {executiveSummary && (
        <p className="mb-5 text-sm leading-relaxed text-slate-600">{executiveSummary}</p>
      )}

      {brief && <ExecutiveBriefPanel brief={brief} />}

      {swot && (
        <div className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${brief ? "mt-5" : ""}`}>
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
                    {items.slice(0, 4).map((item, index) => (
                      <li
                        key={`${displayText(item)}-${index}`}
                        className="flex gap-2 text-xs leading-relaxed text-slate-700"
                      >
                        <span
                          className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${block.bullet}`}
                        />
                        {displayText(item)}
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

function ExecutiveBriefPanel({ brief }: { brief: OverviewExecutiveBrief }) {
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-white p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
          Analysis overview
        </p>
        <h4 className="mt-1 text-lg font-semibold text-slate-900">{brief.companyName}</h4>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Smart-matched{" "}
          <span className="font-semibold text-slate-800">{brief.competitorCount}</span> competitor
          {brief.competitorCount === 1 ? "" : "s"} and analyzed{" "}
          <span className="font-semibold text-slate-800">{brief.postCount}</span> post
          {brief.postCount === 1 ? "" : "s"}
          {brief.matchingMode ? ` using ${brief.matchingMode} matching` : ""}.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <BriefStat label="Industry" value={displayText(brief.industry)} />
        <BriefStat label="Region focus" value={displayText(brief.region)} />
        <BriefStat label="Competitors" value={String(brief.competitorCount)} accent="indigo" />
        <BriefStat label="Posts analyzed" value={String(brief.postCount)} accent="emerald" />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Competitor relevance & content mix
          </p>
          <span className="text-[11px] text-slate-400">
            {brief.competitors.length} account{brief.competitors.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="space-y-3">
          {brief.competitors.map((competitor, index) => (
            <CompetitorHighlightRow
              key={competitor.id}
              competitor={competitor}
              rank={index + 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CompetitorHighlightRow({
  competitor,
  rank,
}: {
  competitor: OverviewExecutiveCompetitorHighlight;
  rank: number;
}) {
  const handle = competitor.username ? `@${competitor.username}` : competitor.name;
  const relevancePct = formatRelevance(competitor.relevanceScore);

  return (
    <article className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-bold text-slate-400 ring-1 ring-slate-200">
            {rank}
          </span>
          <Avatar name={competitor.name} imageUrl={competitor.imageUrl} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{competitor.name}</p>
            <p className="truncate text-xs text-slate-500">{handle}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700">
            {relevancePct}% relevance
          </span>
          {/* <span className="text-[10px] text-slate-400">score {competitor.relevanceScore.toFixed(3)}</span> */}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <ContentMetric
          label="Format"
          value={competitor.primaryFormat}
          share={competitor.formatShare}
          tone="indigo"
        />
        <ContentMetric
          label="Theme"
          value={competitor.topTheme}
          share={competitor.themeShare}
          tone="violet"
        />
        <ContentMetric
          label="Content focus"
          value={competitor.contentCategory}
          share={competitor.categoryShare}
          tone="emerald"
        />
      </div>

      {competitor.profileUrl && (
        <a
          href={competitor.profileUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block text-[11px] font-medium text-indigo-600 hover:text-indigo-700"
        >
          View Instagram profile →
        </a>
      )}
    </article>
  );
}

function BriefStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "indigo" | "emerald";
}) {
  const accentClass =
    accent === "indigo"
      ? "border-indigo-100 bg-indigo-50/50 text-indigo-700"
      : accent === "emerald"
        ? "border-emerald-100 bg-emerald-50/50 text-emerald-700"
        : "border-slate-100 bg-white text-slate-800";

  return (
    <div className={`rounded-xl border px-3 py-2.5 ${accentClass}`}>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 truncate text-sm font-semibold">{value}</p>
    </div>
  );
}

function ContentMetric({
  label,
  value,
  share,
  tone,
}: {
  label: string;
  value?: string;
  share?: number;
  tone: "indigo" | "violet" | "emerald";
}) {
  const toneClasses = {
    indigo: "bg-indigo-50 text-indigo-700",
    violet: "bg-violet-50 text-violet-700",
    emerald: "bg-emerald-50 text-emerald-700",
  }[tone];

  if (!value) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 bg-white px-3 py-2">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        <p className="mt-0.5 text-xs text-slate-400">No data</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white px-3 py-2 ring-1 ring-slate-100">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <div className="mt-1 flex flex-wrap items-center gap-1.5">
        <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${toneClasses}`}>
          {displayText(value, "")}
        </span>
        {share != null && (
          <span className="text-[11px] font-semibold text-slate-600">{share.toFixed(1)}%</span>
        )}
      </div>
    </div>
  );
}

function formatRelevance(score: number): string {
  return (Math.max(0, Math.min(1, score)) * 100).toFixed(1);
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
              <Avatar name={competitor.name} imageUrl={competitor.imageUrl} size="md" />
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
                View Profile →
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
