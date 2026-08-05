import type { OverviewMetricCard } from "@/types/overview";

interface OverviewMetricCardsProps {
  metrics: OverviewMetricCard[];
}

const accentStyles = {
  indigo: "bg-indigo-50 text-indigo-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  sky: "bg-sky-50 text-sky-600",
};

export function OverviewMetricCards({ metrics }: OverviewMetricCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.id}
          className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm"
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">{metric.label}</p>
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                accentStyles[metric.accent ?? "indigo"]
              }`}
            >
              <MetricIcon id={metric.id} />
            </span>
          </div>
          <p className="text-2xl font-semibold text-slate-900">{metric.value}</p>
          {(metric.trend || metric.hint) && (
            <p
              className={`mt-1 text-xs ${
                metric.trendPositive === false
                  ? "text-rose-600"
                  : metric.trendPositive || metric.trend
                    ? "text-emerald-600"
                    : "text-slate-400"
              }`}
            >
              {metric.trend ?? metric.hint}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function MetricIcon({ id }: { id: string }) {
  if (id === "followers") {
    return (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.118a7.5 7.5 0 0 1 15 0" />
      </svg>
    );
  }
  if (id === "employees") {
    return (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.09 9.09 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.118 3.2A9.09 9.09 0 0 1 6 18.72m6.941-3.197a5.971 5.971 0 0 0-.941-3.197M12 12.75a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      </svg>
    );
  }
  if (id === "competitors") {
    return (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 0 3-3v-1.5a3 3 0 0 0-3-3h-9a3 3 0 0 0-3 3V15.75a3 3 0 0 0 3 3m9 0v-1.5a3 3 0 0 0-3-3h-3a3 3 0 0 0-3 3V18.75" />
      </svg>
    );
  }
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22" />
    </svg>
  );
}
