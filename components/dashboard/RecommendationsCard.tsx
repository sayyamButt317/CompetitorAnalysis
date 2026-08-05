import { Card, CardHeader } from "@/components/ui/Card";
import type { RecommendationItem } from "@/types/dashboard";

interface RecommendationsCardProps {
  items: RecommendationItem[];
}

const priorityStyles: Record<RecommendationItem["priority"], string> = {
  high: "bg-red-50 text-red-700 border-red-100",
  medium: "bg-amber-50 text-amber-700 border-amber-100",
  low: "bg-slate-50 text-slate-600 border-slate-100",
};

export function RecommendationsCard({ items }: RecommendationsCardProps) {
  if (items.length === 0) return null;

  return (
    <Card>
      <CardHeader title="Recommendations" subtitle={`${items.length} action items`} />
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li
            key={`${item.title}-${index}`}
            className="rounded-lg border border-slate-100 bg-white p-3"
          >
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${priorityStyles[item.priority]}`}
              >
                {item.priority}
              </span>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                {item.type}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-800">{item.title}</p>
            {item.detail && (
              <p className="mt-1 text-xs leading-relaxed text-slate-500">{item.detail}</p>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}
