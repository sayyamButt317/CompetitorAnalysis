import { HashtagSparkline } from "@/components/hashtag/HashtagSparkline";
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
  linkLabel?: string;
  maxItems?: number;
}

export function TrendRankedList({
  title,
  items,
  metricLabel = "posts",
  showSparkline = true,
  linkLabel,
  maxItems = 8,
}: TrendRankedListProps) {
  return (
    <Card className="h-full">
      <h3 className="mb-4 text-sm font-semibold text-slate-900">{title}</h3>
      <ul className="max-h-80 space-y-3 overflow-y-auto">
        {items.slice(0, maxItems).map((item) => (
          <li key={item.label} className="flex items-center gap-3">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold text-white ${
                rankColors[(item.rank - 1) % rankColors.length]
              }`}
            >
              {item.rank}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900">
                {item.displayLabel}
              </p>
              <p className="text-xs text-slate-500">
                {item.metric} {metricLabel}
                {item.sublabel ? ` · ${item.sublabel}` : ""}
              </p>
            </div>
            {showSparkline && (
              <HashtagSparkline values={item.sparkline} color="#6366f1" />
            )}
          </li>
        ))}
      </ul>
      {linkLabel && (
        <button
          type="button"
          className="mt-4 text-xs font-medium text-indigo-600 hover:text-indigo-700"
        >
          {linkLabel} →
        </button>
      )}
    </Card>
  );
}
