import { HashtagSparkline } from "@/components/hashtag/HashtagSparkline";
import { SourceLink } from "@/components/trend/PlatformIcon";
import { Card } from "@/components/ui/Card";
import type { TrendRankedItem } from "@/types/trends";

const rankColors = [
  "bg-rose-500",
  "bg-violet-500",
  "bg-indigo-500",
  "bg-sky-500",
  "bg-emerald-500",
];

interface TrendRankedListProps {
  title: string;
  items: TrendRankedItem[];
  metricLabel?: string;
  showSparkline?: boolean;
  maxItems?: number;
}

export function TrendRankedList({
  title,
  items,
  metricLabel = "posts",
  showSparkline = true,
  maxItems = 8,
}: TrendRankedListProps) {
  return (
    <Card className="h-full">
      <h3 className="mb-4 text-sm font-semibold text-slate-900">{title}</h3>
      <ul className="max-h-80 space-y-3 overflow-y-auto">
        {items.slice(0, maxItems).map((item) => (
          <li key={item.label} className="flex items-start gap-3">
            <span
              className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold text-white ${
                rankColors[(item.rank - 1) % rankColors.length]
              }`}
            >
              {item.rank}
            </span>
            <div className="min-w-0 flex-1">
              {item.verifyUrl ? (
                <a
                  href={item.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="line-clamp-2 text-sm font-medium text-slate-900 hover:text-indigo-600"
                >
                  {item.displayLabel}
                </a>
              ) : (
                <p className="line-clamp-2 text-sm font-medium text-slate-900">
                  {item.displayLabel}
                </p>
              )}
              <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500">
                <span>
                  {item.metric} {metricLabel}
                </span>
                {item.sourceName && (
                  <>
                    <span className="text-slate-300">·</span>
                    <span className="inline-flex items-center gap-1">
                      <span className="text-slate-400">from</span>
                      <SourceLink
                        label={item.sourceName}
                        url={item.sourceUrl ?? item.verifyUrl}
                      />
                    </span>
                  </>
                )}
              </div>
            </div>
            {showSparkline && (
              <HashtagSparkline values={item.sparkline} color="#6366f1" />
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}
