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

function SourceChip({ source }: { source: TrendWebSource }) {
  const className = `inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${categoryStyles[source.category]}`;

  const inner = (
    <>
      <span className="rounded bg-white/60 px-1 py-0.5 text-[10px] uppercase">
        {categoryLabels[source.category]}
      </span>
      <span className="max-w-[200px] truncate">{source.name}</span>
      {source.url && (
        <svg className="h-3 w-3 shrink-0 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
      )}
    </>
  );

  if (source.url) {
    return (
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${className} transition-opacity hover:opacity-80`}
        title={`Open ${source.name}`}
      >
        {inner}
      </a>
    );
  }

  return (
    <span className={className} title={source.name}>
      {inner}
    </span>
  );
}

export function TrendSourcesPanel({ sources, sourceCount }: TrendSourcesPanelProps) {
  const withLinks = sources.filter((s) => s.url).length;

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Data Sources</h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Click a source to open and verify · {withLinks} with links
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
          {sourceCount} scanned
        </span>
      </div>
      <div className="flex max-h-64 flex-wrap gap-2 overflow-y-auto">
        {sources.map((source) => (
          <SourceChip key={source.name} source={source} />
        ))}
      </div>
    </Card>
  );
}
