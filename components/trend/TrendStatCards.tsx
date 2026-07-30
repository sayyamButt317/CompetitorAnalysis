import { HashtagSparkline } from "@/components/hashtag/HashtagSparkline";
import { Card } from "@/components/ui/Card";
import type { TrendStatMetric } from "@/types/trends";

const iconConfig = {
  hashtags: {
    bg: "bg-violet-100",
    color: "text-violet-600",
    stroke: "#7c3aed",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5" />
      </svg>
    ),
  },
  topics: {
    bg: "bg-emerald-100",
    color: "text-emerald-600",
    stroke: "#059669",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
  },
  reels: {
    bg: "bg-amber-100",
    color: "text-amber-600",
    stroke: "#d97706",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
  },
  google: {
    bg: "bg-sky-100",
    color: "text-sky-600",
    stroke: "#0284c7",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    ),
  },
};

interface TrendStatCardsProps {
  metrics: TrendStatMetric[];
}

export function TrendStatCards({ metrics }: TrendStatCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const config = iconConfig[metric.icon];
        return (
          <Card key={metric.id} className="overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500">{metric.label}</p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                  {metric.value}
                </p>
                <p className="mt-0.5 text-xs text-emerald-600">{metric.change}</p>
              </div>
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${config.bg} ${config.color}`}
              >
                {config.icon}
              </div>
            </div>
            <div className="mt-3 border-t border-slate-100 pt-3">
              <HashtagSparkline values={metric.sparkline} color={config.stroke} />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
