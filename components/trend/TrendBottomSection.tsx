import { Card } from "@/components/ui/Card";
import type { TrendNewsEntry, TrendPlatformShare } from "@/types/trends";

interface TrendNewsTimelineProps {
  entries: TrendNewsEntry[];
}

export function TrendNewsTimeline({ entries }: TrendNewsTimelineProps) {
  return (
    <Card className="h-full">
      <h3 className="mb-4 text-sm font-semibold text-slate-900">Trending News Timeline</h3>
      <ul className="space-y-4">
        {entries.map((entry) => (
          <li key={entry.id} className="relative flex gap-3 pl-4">
            <span className="absolute left-0 top-1.5 h-full w-px bg-slate-200" />
            <span className="absolute left-[-3px] top-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-slate-400">{entry.time}</span>
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                  {entry.platform}
                </span>
              </div>
              {entry.url ? (
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 line-clamp-2 text-sm font-medium text-slate-800 hover:text-indigo-600"
                >
                  {entry.title}
                </a>
              ) : (
                <p className="mt-1 line-clamp-2 text-sm font-medium text-slate-800">
                  {entry.title}
                </p>
              )}
              <p className="mt-0.5 text-xs text-slate-500">{entry.traffic} traffic</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

interface TrendPlatformBreakdownProps {
  platforms: TrendPlatformShare[];
}

export function TrendPlatformBreakdown({ platforms }: TrendPlatformBreakdownProps) {
  return (
    <Card className="h-full">
      <h3 className="mb-4 text-sm font-semibold text-slate-900">Platform Breakdown</h3>
      <ul className="space-y-4">
        {platforms.map((platform) => (
          <li key={platform.platform}>
            <div className="mb-1.5 flex items-center justify-between gap-2">
              {platform.url ? (
                <a
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-sm font-medium text-indigo-600 hover:underline"
                >
                  {platform.platform}
                </a>
              ) : (
                <span className="truncate text-sm font-medium text-slate-700">
                  {platform.platform}
                </span>
              )}
              <span className="shrink-0 text-xs font-semibold text-slate-500">
                {platform.percentage}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${platform.percentage}%`,
                  backgroundColor: platform.color,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

interface TrendCountryHeatmapProps {
  countries: { name: string; trendCount: number }[];
}

export function TrendCountryHeatmap({ countries }: TrendCountryHeatmapProps) {
  const max = Math.max(...countries.map((c) => c.trendCount), 1);

  return (
    <Card className="h-full">
      <h3 className="mb-4 text-sm font-semibold text-slate-900">Trend Activity by Region</h3>
      <div className="space-y-2">
        {countries.map((country) => (
          <div key={country.name} className="flex items-center gap-3">
            <span className="w-28 truncate text-xs text-slate-600">{country.name}</span>
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-rose-400"
                style={{ width: `${(country.trendCount / max) * 100}%` }}
              />
            </div>
            <span className="w-8 text-right text-xs font-medium text-slate-500">
              {country.trendCount}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
