import type { CompetitorDetailRow } from "@/types/competitors";
import { Avatar } from "@/components/ui/Avatar";
import { Card, CardHeader } from "@/components/ui/Card";
import { formatEngagementRate, formatNumber, formatPercent } from "@/lib/format";

interface CompetitorsDetailTableProps {
  competitors: CompetitorDetailRow[];
}

export function CompetitorsDetailTable({ competitors }: CompetitorsDetailTableProps) {
  return (
    <Card>
      <CardHeader title="Competitor Comparison" />
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-left">
              <th className="pb-3 pr-4 font-medium text-slate-400">Competitor</th>
              <th className="pb-3 px-2 font-medium text-slate-400">Followers</th>
              <th className="pb-3 px-2 font-medium text-slate-400">Posts</th>
              <th className="pb-3 px-2 font-medium text-slate-400">Avg. Engagement</th>
              <th className="pb-3 px-2 font-medium text-slate-400">Reels %</th>
              <th className="pb-3 px-2 font-medium text-slate-400">Carousel %</th>
              <th className="pb-3 px-2 font-medium text-slate-400">Image %</th>
              <th className="pb-3 px-2 font-medium text-slate-400">Top Theme</th>
              <th className="pb-3 px-2 font-medium text-slate-400">Primary Format</th>
              <th className="pb-3 pl-2 font-medium text-slate-400">Match</th>
            </tr>
          </thead>
          <tbody>
            {competitors.map((row) => (
              <tr
                key={row.username}
                className="border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50/60"
              >
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={row.name} imageUrl={row.imageUrl} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-800">{row.handle}</p>
                      <p className="truncate text-[10px] text-slate-400">{row.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-2 py-3 text-slate-600">{formatNumber(row.followers)}</td>
                <td className="px-2 py-3 text-slate-600">{row.posts}</td>
                <td className="px-2 py-3 font-medium text-slate-800">
                  {formatEngagementRate(row.avgEngagement)}
                </td>
                <td className="px-2 py-3 text-slate-600">{row.reelsPct}</td>
                <td className="px-2 py-3 text-slate-600">{row.carouselPct}</td>
                <td className="px-2 py-3 text-slate-600">{row.imagePct}</td>
                <td className="px-2 py-3 text-slate-600">{row.primaryTheme}</td>
                <td className="px-2 py-3 text-slate-600">{row.primaryFormat}</td>
                <td className="pl-2 py-3 font-medium text-indigo-600">
                  {formatPercent(row.matchScore, 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
