import { Card, CardHeader } from "@/components/ui/Card";
import type { SwotView } from "@/types/dashboard";

interface SwotGridProps {
  swot: SwotView;
}

const quadrants: {
  key: keyof SwotView;
  title: string;
  className: string;
  bullet: string;
}[] = [
  {
    key: "strengths",
    title: "Strengths",
    className: "border-emerald-100 bg-emerald-50/50",
    bullet: "bg-emerald-500",
  },
  {
    key: "weaknesses",
    title: "Weaknesses",
    className: "border-rose-100 bg-rose-50/50",
    bullet: "bg-rose-500",
  },
  {
    key: "opportunities",
    title: "Opportunities",
    className: "border-sky-100 bg-sky-50/50",
    bullet: "bg-sky-500",
  },
  {
    key: "threats",
    title: "Threats",
    className: "border-amber-100 bg-amber-50/50",
    bullet: "bg-amber-500",
  },
];

export function SwotGrid({ swot }: SwotGridProps) {
  return (
    <Card>
      <CardHeader title="SWOT Analysis" />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {quadrants.map((quadrant) => {
          const items = swot[quadrant.key];
          return (
            <div
              key={quadrant.key}
              className={`rounded-lg border p-3 ${quadrant.className}`}
            >
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                {quadrant.title}
              </p>
              {items.length === 0 ? (
                <p className="text-xs text-slate-400">None listed</p>
              ) : (
                <ul className="space-y-1.5">
                  {items.map((item) => (
                    <li key={item} className="flex gap-2 text-xs leading-relaxed text-slate-700">
                      <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${quadrant.bullet}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
