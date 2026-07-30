import { Card } from "@/components/ui/Card";
import type { TrendWebSource } from "@/types/trends";

const categoryStyles: Record<TrendWebSource["category"], string> = {
  social_tool: "bg-violet-100 text-violet-700",
  platform: "bg-rose-100 text-rose-700",
  search: "bg-sky-100 text-sky-700",
  content: "bg-emerald-100 text-emerald-700",
  other: "bg-slate-100 text-slate-600",
};

const categoryLabels: Record<TrendWebSource["category"], string> = {
  social_tool: "Tool",
  platform: "Platform",
  search: "Search",
  content: "Content",
  other: "Other",
};

interface TrendSourcesPanelProps {
  sources: TrendWebSource[];
  sourceCount: number;
}

export function TrendSourcesPanel({ sources, sourceCount }: TrendSourcesPanelProps) {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Data Sources</h3>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
          {sourceCount} scanned
        </span>
      </div>
      <div className="flex max-h-64 flex-wrap gap-2 overflow-y-auto">
        {sources.map((source) => (
          <span
            key={source.name}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${categoryStyles[source.category]}`}
            title={source.name}
          >
            <span className="rounded bg-white/60 px-1 py-0.5 text-[10px] uppercase">
              {categoryLabels[source.category]}
            </span>
            <span className="max-w-[200px] truncate">{source.name}</span>
          </span>
        ))}
      </div>
    </Card>
  );
}
