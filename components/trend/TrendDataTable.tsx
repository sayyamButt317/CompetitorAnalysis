import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";
import { PlatformIcon, SourceLink } from "@/components/trend/PlatformIcon";
import type { PlatformId, TrendTableRow } from "@/types/trends";

interface TrendDataTableProps {
  rows: TrendTableRow[];
}

export function TrendDataTable({ rows }: TrendDataTableProps) {
  return (
    <Card padding="sm" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-medium uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Trend</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Platform</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Region</th>
              <th className="px-4 py-3 text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-slate-50 transition-colors hover:bg-slate-50/60"
              >
                <td className="px-4 py-3 text-xs font-semibold text-slate-400">
                  {row.rank}
                </td>
                <td className="max-w-[240px] px-4 py-3">
                  {row.url ? (
                    <a
                      href={row.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-slate-900 hover:text-indigo-600"
                    >
                      {row.title}
                    </a>
                  ) : (
                    <span className="font-medium text-slate-900">{row.title}</span>
                  )}
                  <p className="mt-0.5 text-xs text-slate-400">{row.metric}</p>
                </td>
                <td className="px-4 py-3">
                  <Badge>{row.typeLabel}</Badge>
                </td>
                <td className="px-4 py-3">
                  <PlatformIcon platform={row.platformId} showLabel />
                </td>
                <td className="max-w-[200px] px-4 py-3">
                  <SourceLink label={row.source} url={row.sourceUrl} />
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {row.country ?? "—"}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-indigo-600">
                  {row.score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && (
        <p className="py-10 text-center text-sm text-slate-400">No trends found.</p>
      )}
    </Card>
  );
}

interface TrendGoogleTableProps {
  rows: import("@/types/trends").GoogleTrendRow[];
}

export function TrendGoogleTable({ rows }: TrendGoogleTableProps) {
  return (
    <Card>
      <CardHeader
        title="Google Trends"
        subtitle="Search trends by region with latest news"
        action={<PlatformIcon platform="google" size="md" />}
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-medium text-slate-500">
              <th className="pb-2 pr-4">#</th>
              <th className="pb-2 pr-4">Query</th>
              <th className="pb-2 pr-4">Country</th>
              <th className="pb-2 pr-4">Traffic</th>
              <th className="pb-2">Latest News</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.title}-${row.rank}`} className="border-b border-slate-50">
                <td className="py-3 pr-4 text-xs text-slate-400">{row.rank}</td>
                <td className="py-3 pr-4 font-medium text-slate-900">
                  {row.exploreUrl ? (
                    <a
                      href={row.exploreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-indigo-600 hover:underline"
                    >
                      {row.title}
                    </a>
                  ) : (
                    row.title
                  )}
                </td>
                <td className="py-3 pr-4 text-slate-600">
                  {row.countryCode} · {row.country}
                </td>
                <td className="py-3 pr-4 text-slate-600">{row.traffic}</td>
                <td className="py-3">
                  {row.newsUrl ? (
                    <a
                      href={row.newsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="line-clamp-2 text-xs text-indigo-600 hover:underline"
                    >
                      {row.newsTitle}
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                  {row.newsSource && (
                    <SourceLink
                      label={row.newsSource}
                      url={row.newsUrl}
                      className="mt-0.5"
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

interface TrendReelListProps {
  items: import("@/types/trends").ReelFormatRow[];
}

export function TrendReelList({ items }: TrendReelListProps) {
  return (
    <Card>
      <CardHeader
        title="Reel Formats"
        subtitle="Trending content formats from web blogs and social sources"
      />
      <ul className="divide-y divide-slate-100">
        {items.map((item) => (
          <li key={`${item.name}-${item.rank}`} className="flex items-center justify-between gap-3 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-indigo-100 text-xs font-bold text-indigo-700">
                {item.rank}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900">{item.name}</p>
                <div className="mt-0.5 flex flex-wrap items-center gap-2">
                  <PlatformIcon platform={item.platformId} />
                  <SourceLink label={item.source} url={item.sourceUrl} />
                </div>
              </div>
            </div>
            <span className="shrink-0 text-sm font-semibold text-slate-600">{item.score}</span>
          </li>
        ))}
      </ul>
      {items.length === 0 && (
        <p className="py-6 text-center text-sm text-slate-400">No reel formats found.</p>
      )}
    </Card>
  );
}

interface TrendPlatformListProps {
  stats: import("@/types/trends").PlatformStatRow[];
}

export function TrendPlatformList({ stats }: TrendPlatformListProps) {
  return (
    <Card>
      <CardHeader title="By Platform" subtitle="Signal volume from source_breakdown" />
      <ul className="space-y-3">
        {stats.map((stat) => (
          <li key={stat.id}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <PlatformIcon platform={stat.id as PlatformId} showLabel />
              <span className="text-right text-xs text-slate-500">
                {stat.sourceCount} sources
                <br />
                {stat.count.toLocaleString()} signals · {stat.percentage}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full"
                style={{ width: `${stat.percentage}%`, backgroundColor: stat.color }}
              />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
