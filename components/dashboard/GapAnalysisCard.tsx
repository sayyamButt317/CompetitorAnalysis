import { ChartCard } from "@/components/charts/ChartCard";
import { DonutChart } from "@/components/charts/DonutChart";
import { Card, CardHeader } from "@/components/ui/Card";
import type { GapAnalysisView } from "@/types/dashboard";

interface GapAnalysisCardProps {
  gaps: GapAnalysisView;
}

function GapChips({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-slate-500">{title}</p>
      {items.length === 0 ? (
        <p className="text-xs text-slate-400">No gaps detected</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item) => (
            <span
              key={item}
              className="rounded-md border border-rose-100 bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700"
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function MetaStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}

export function GapAnalysisCard({ gaps }: GapAnalysisCardProps) {
  return (
    <Card>
      <CardHeader title="Gap Analysis" subtitle={gaps.summary} />

      <div className="space-y-5">
        {(gaps.competitorCount != null ||
          gaps.contentProfilesAnalyzed != null ||
          gaps.websitesAnalyzed != null) && (
          <div className="grid grid-cols-3 gap-2">
            <MetaStat label="Competitors" value={String(gaps.competitorCount ?? "—")} />
            <MetaStat
              label="Profiles"
              value={String(gaps.contentProfilesAnalyzed ?? "—")}
            />
            <MetaStat label="Websites" value={String(gaps.websitesAnalyzed ?? "—")} />
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <GapChips title="Service Gaps" items={gaps.serviceGaps} />
          <GapChips title="Technology Gaps" items={gaps.technologyGaps} />
          <GapChips title="Keyword Gaps" items={gaps.keywordGaps} />
        </div>

        {(gaps.formats.length > 0 || gaps.themes.length > 0 || gaps.categories.length > 0) && (
          <div className="space-y-4">
            {(gaps.formats.length > 0 || gaps.themes.length > 0) && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {gaps.formats.length > 0 && (
                  <ChartCard title="Competitor Formats" className="border-0 p-0 shadow-none">
                    <DonutChart segments={gaps.formats} centerLabel="Formats" />
                  </ChartCard>
                )}
                {gaps.themes.length > 0 && (
                  <ChartCard title="Competitor Themes" className="border-0 p-0 shadow-none">
                    <DonutChart segments={gaps.themes} centerLabel="Themes" />
                  </ChartCard>
                )}
              </div>
            )}

            {gaps.categories.length > 0 && (
              <div className="w-full min-w-0 overflow-hidden">
                <ChartCard title="Competitor Categories" className="border-0 p-0 shadow-none">
                  <DonutChart segments={gaps.categories} centerLabel="Categories" />
                </ChartCard>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
