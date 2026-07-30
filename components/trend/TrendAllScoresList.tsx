import { Card } from "@/components/ui/Card";
import type { TrendRankedItem, TrendPlatformShare } from "@/types/trends";

interface TrendAllScoresListProps {
  items: TrendRankedItem[];
}

export function TrendAllScoresList({ items }: TrendAllScoresListProps) {
  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold text-slate-900">
        Top Trend Scores (All Categories)
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs text-slate-500">
              <th className="pb-2 pr-4 font-medium">#</th>
              <th className="pb-2 pr-4 font-medium">Trend</th>
              <th className="pb-2 pr-4 font-medium">Source</th>
              <th className="pb-2 font-medium text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.label} className="border-b border-slate-50 last:border-0">
                <td className="py-2.5 pr-4 text-xs font-semibold text-slate-400">
                  {item.rank}
                </td>
                <td className="max-w-[220px] truncate py-2.5 pr-4 font-medium text-slate-900">
                  {item.displayLabel}
                </td>
                <td className="py-2.5 pr-4 text-xs text-slate-500">
                  {item.sublabel ?? "—"}
                </td>
                <td className="py-2.5 text-right font-semibold text-indigo-600">
                  {item.metric}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

interface TrendSourceBreakdownProps {
  sources: TrendPlatformShare[];
}

export function TrendSourceBreakdown({ sources }: TrendSourceBreakdownProps) {
  return (
    <Card className="h-full">
      <h3 className="mb-4 text-sm font-semibold text-slate-900">
        Trend Attribution by Source
      </h3>
      <ul className="space-y-4">
        {sources.map((source) => (
          <li key={source.platform}>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">{source.platform}</span>
              <span className="text-xs font-semibold text-slate-500">
                {source.percentage}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${source.percentage}%`,
                  backgroundColor: source.color,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
