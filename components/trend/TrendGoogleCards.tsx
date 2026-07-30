import { Card } from "@/components/ui/Card";
import type { TrendGoogleCard } from "@/types/trends";

interface TrendGoogleCardsProps {
  items: TrendGoogleCard[];
}

export function TrendGoogleCards({ items }: TrendGoogleCardsProps) {
  if (items.length === 0) return null;

  return (
    <section>
      <h3 className="mb-3 text-sm font-semibold text-slate-900">Google Trends</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4">
        {items.map((item) => (
          <Card key={`${item.title}-${item.rank}`} className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-sky-100 text-xs font-bold text-sky-700">
                {item.rank}
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                {item.country}
              </span>
            </div>
            <div>
              <p className="line-clamp-2 text-sm font-semibold text-slate-900">{item.title}</p>
              <p className="mt-1 text-xs text-slate-500">
                {item.traffic} traffic · {item.timeAgo}
              </p>
            </div>
            {item.newsTitle && (
              <div className="mt-auto rounded-lg border border-slate-100 bg-slate-50 p-2.5">
                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                  Latest News
                </p>
                {item.newsUrl ? (
                  <a
                    href={item.newsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 line-clamp-2 text-xs text-indigo-600 hover:underline"
                  >
                    {item.newsTitle}
                  </a>
                ) : (
                  <p className="mt-1 line-clamp-2 text-xs text-slate-600">{item.newsTitle}</p>
                )}
                {item.newsSource && (
                  <p className="mt-1 text-[10px] text-slate-400">{item.newsSource}</p>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}
