import type { ComparisonMetric } from "@/types/dashboard";
import { Avatar } from "@/components/ui/Avatar";
import { Card, CardHeader } from "@/components/ui/Card";

interface CompetitorComparisonTableProps {
  competitors: { handle: string; name: string }[];
  metrics: ComparisonMetric[];
}

export function CompetitorComparisonTable({
  competitors,
  metrics,
}: CompetitorComparisonTableProps) {
  return (
    <Card>
      <CardHeader title="Competitor Comparison" />
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="pb-3 pr-4 text-left font-medium text-slate-400">Metric</th>
              {competitors.map((c, index) => (
                <th key={`${c.handle}-${index}`} className="pb-3 px-2 text-center font-medium text-slate-400">
                  <div className="flex flex-col items-center gap-1.5">
                    <Avatar name={c.name} size="sm" />
                    <span className="truncate max-w-[72px]">{c.handle}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric) => (
              <tr key={metric.label} className="border-b border-slate-50 last:border-0">
                <td className="py-2.5 pr-4 font-medium text-slate-600">{metric.label}</td>
                {metric.values.map((value, i) => (
                  <td key={i} className="py-2.5 px-2 text-center text-slate-700">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
