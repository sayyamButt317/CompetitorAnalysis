import { Card } from "@/components/ui/Card";
import type { TrendCountryItem } from "@/types/trends";

interface TrendInsightsPanelProps {
  countries: TrendCountryItem[];
  insights: string[];
  recommendations: string[];
}

export function TrendInsightsPanel({
  countries,
  insights,
  recommendations,
}: TrendInsightsPanelProps) {
  return (
    <div className="space-y-4">
      <Card>
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Top Countries</h3>
        <ul className="space-y-2">
          {countries.map((country) => (
            <li
              key={country.name}
              className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-slate-100 text-[10px] font-bold text-slate-600">
                  {country.code.slice(0, 2).toUpperCase()}
                </span>
                <span className="text-sm text-slate-700">{country.name}</span>
              </div>
              <span className="text-xs font-medium text-slate-500">
                {country.trendCount} trends
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h3 className="mb-3 text-sm font-semibold text-slate-900">AI Trend Summary</h3>
        <ul className="space-y-2">
          {insights.map((insight) => (
            <li key={insight} className="flex gap-2 text-xs leading-relaxed text-slate-600">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
              {insight}
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Recommendations</h3>
        <ul className="space-y-3">
          {recommendations.map((rec) => (
            <li key={rec} className="flex gap-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
              </span>
              <p className="text-xs leading-relaxed text-slate-600">{rec}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
