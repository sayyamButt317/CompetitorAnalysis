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

export function GapAnalysisCard({ gaps }: GapAnalysisCardProps) {
  return (
    <Card>
      <CardHeader title="Gap Analysis" subtitle={gaps.summary} />

      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <GapChips title="Service Gaps" items={gaps.serviceGaps} />
          <GapChips title="Technology Gaps" items={gaps.technologyGaps} />
          <GapChips title="Keyword Gaps" items={gaps.keywordGaps} />
        </div>

        {(gaps.formats.length > 0 || gaps.themes.length > 0 || gaps.categories.length > 0) && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
            {gaps.categories.length > 0 && (
              <ChartCard title="Competitor Categories" className="border-0 p-0 shadow-none">
                <DonutChart segments={gaps.categories} centerLabel="Categories" />
              </ChartCard>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
