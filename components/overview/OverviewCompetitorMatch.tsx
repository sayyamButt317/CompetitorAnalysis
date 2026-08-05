import type { ReactNode } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { formatEngagementRate, formatNumber } from "@/lib/format";
import type { OverviewComparisonRow, OverviewCompetitorDetail } from "@/types/overview";

interface OverviewCompetitorMatchProps {
  companyName: string;
  handles: string[];
  rows: OverviewComparisonRow[];
  competitors: OverviewCompetitorDetail[];
}

function SimilarityBar({ label, value }: { label: string; value: number }) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2 text-[11px]">
        <span className="text-slate-500">{label}</span>
        <span className="font-semibold text-slate-700">{pct}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-indigo-500" style={{ width: `${Math.max(pct, 3)}%` }} />
      </div>
    </div>
  );
}

export function OverviewCompetitorMatch({
  companyName,
  handles,
  rows,
  competitors,
}: OverviewCompetitorMatchProps) {
  if (competitors.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-2 text-sm font-semibold text-slate-800">You vs Competitors</h3>
        <p className="text-sm text-slate-500">No competitors available to compare.</p>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="text-sm font-semibold text-slate-800">You vs Competitors</h3>
          <p className="mt-0.5 text-xs text-slate-400">
            Side-by-side metrics matching {companyName} against discovered rivals
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-500">
                <th className="px-4 py-3 font-medium">Metric</th>
                <th className="px-4 py-3 font-semibold text-indigo-700">{companyName}</th>
                {handles.map((handle) => (
                  <th key={handle} className="px-4 py-3 font-medium">
                    {handle}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3 font-medium text-slate-600">{row.label}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{row.you}</td>
                  {row.competitors.map((value, index) => (
                    <td key={`${row.label}-${index}`} className="px-4 py-3 text-slate-700">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {competitors.map((competitor) => (
          <article
            key={competitor.id}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
          >
            <div className="mb-4 flex items-start gap-3">
              <Avatar name={competitor.name} imageUrl={competitor.imageUrl} size="md" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="truncate text-sm font-semibold text-slate-900">{competitor.name}</h4>
                  {competitor.matchScore != null && (
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                      {Math.round(competitor.matchScore * 100)}% match
                    </span>
                  )}
                </div>
                <p className="mt-0.5 truncate text-xs text-slate-400">
                  {competitor.username ? `@${competitor.username}` : "No Instagram handle"}
                  {competitor.primaryCategory ? ` · ${competitor.primaryCategory}` : ""}
                </p>
              </div>
            </div>

            {competitor.bio && (
              <p className="mb-4 line-clamp-3 text-xs leading-relaxed text-slate-600">{competitor.bio}</p>
            )}

            <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <MiniStat label="Followers" value={formatNumber(competitor.followers)} />
              <MiniStat label="Engagement" value={formatEngagementRate(competitor.avgEngagement)} />
              <MiniStat label="Employees" value={formatNumber(competitor.employeeCount)} />
              <MiniStat label="Posts" value={String(competitor.postCount)} />
            </div>

            <div className="mb-4 flex flex-wrap gap-1.5">
              {competitor.regionMatch && <Chip tone="emerald">Region match</Chip>}
              {competitor.nicheMatch && <Chip tone="sky">Niche match</Chip>}
              {competitor.authenticity && <Chip tone="slate">{competitor.authenticity}</Chip>}
              {competitor.isHiring && <Chip tone="amber">Hiring</Chip>}
              {competitor.bestFormat && <Chip tone="indigo">Best: {competitor.bestFormat}</Chip>}
            </div>

            {competitor.matchReasons.length > 0 && (
              <div className="mb-4">
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Match reasons
                </p>
                <ul className="space-y-1">
                  {competitor.matchReasons.slice(0, 3).map((reason) => (
                    <li key={reason} className="text-xs text-slate-600">
                      • {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mb-4 space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Similarity vs you
              </p>
              <SimilarityBar label="Overall" value={competitor.similarity.overall} />
              <SimilarityBar label="Services" value={competitor.similarity.services} />
              <SimilarityBar label="Technology" value={competitor.similarity.technology} />
              <SimilarityBar label="Content" value={competitor.similarity.content} />
              <SimilarityBar label="Marketing" value={competitor.similarity.marketing} />
              <SimilarityBar label="Location" value={competitor.similarity.location} />
              {competitor.similarity.explanation && (
                <p className="pt-1 text-[11px] leading-relaxed text-slate-500">
                  {competitor.similarity.explanation}
                </p>
              )}
            </div>

            {competitor.topHashtags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-1.5">
                {competitor.topHashtags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-pink-50 px-2 py-0.5 text-[10px] font-medium text-pink-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {competitor.contentThemes.length > 0 && (
              <div className="mb-4">
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Content themes
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {competitor.contentThemes.map((theme) => (
                    <span
                      key={theme}
                      className="rounded-md bg-violet-50 px-2 py-0.5 text-[10px] font-medium text-violet-700"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {competitor.captionStyle && (
              <div className="mb-4 grid grid-cols-2 gap-2">
                <MiniStat
                  label="Avg caption"
                  value={String(Math.round(competitor.captionStyle.avgLength ?? 0) || "—")}
                />
                <MiniStat label="Emoji %" value={`${competitor.captionStyle.emojiPct ?? 0}%`} />
                <MiniStat label="Question %" value={`${competitor.captionStyle.questionPct ?? 0}%`} />
                <MiniStat label="CTA %" value={`${competitor.captionStyle.ctaPct ?? 0}%`} />
              </div>
            )}

            {competitor.linkedinSamplePosts.length > 0 && (
              <div className="mb-4">
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  LinkedIn posts
                </p>
                <ul className="space-y-2">
                  {competitor.linkedinSamplePosts.map((post, index) => (
                    <li key={`${post.text.slice(0, 20)}-${index}`} className="rounded-lg bg-slate-50 p-2">
                      <p className="line-clamp-2 text-[11px] leading-relaxed text-slate-600">
                        {post.text}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {competitor.employees.length > 0 && (
              <div className="mb-4">
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  People sample
                </p>
                <ul className="space-y-1">
                  {competitor.employees.slice(0, 3).map((employee) => (
                    <li key={employee.name} className="truncate text-xs text-slate-600">
                      {employee.url ? (
                        <a
                          href={employee.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-sky-700 hover:text-sky-800"
                        >
                          {employee.name}
                        </a>
                      ) : (
                        <span className="font-medium text-slate-700">{employee.name}</span>
                      )}
                      {employee.designation ? ` · ${employee.designation.slice(0, 48)}` : ""}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap gap-3 text-xs font-medium">
              {competitor.profileUrl && (
                <a
                  href={competitor.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-pink-600 hover:text-pink-700"
                >
                  Instagram →
                </a>
              )}
              {competitor.linkedinUrl && (
                <a
                  href={competitor.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-700 hover:text-sky-800"
                >
                  LinkedIn →
                </a>
              )}
              {competitor.website && (
                <a
                  href={competitor.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  Website →
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function Chip({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "emerald" | "sky" | "slate" | "amber" | "indigo";
}) {
  const tones = {
    emerald: "bg-emerald-50 text-emerald-700",
    sky: "bg-sky-50 text-sky-700",
    slate: "bg-slate-100 text-slate-600",
    amber: "bg-amber-50 text-amber-700",
    indigo: "bg-indigo-50 text-indigo-700",
  };
  return (
    <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}
