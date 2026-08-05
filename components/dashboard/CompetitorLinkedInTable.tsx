import { Card, CardHeader } from "@/components/ui/Card";
import { formatNumber } from "@/lib/format";
import type { CompetitorLinkedInRow } from "@/types/dashboard";

interface CompetitorLinkedInTableProps {
  rows: CompetitorLinkedInRow[];
}

export function CompetitorLinkedInTable({ rows }: CompetitorLinkedInTableProps) {
  if (rows.length === 0) return null;

  return (
    <Card className="overflow-hidden" padding="sm">
      <div className="px-2 pt-2">
        <CardHeader
          title="Competitor LinkedIn"
          subtitle={`${rows.length} competitor profiles with LinkedIn intelligence`}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
              <th className="px-3 py-2 font-medium">Company</th>
              <th className="px-3 py-2 font-medium">Followers</th>
              <th className="px-3 py-2 font-medium">Employees</th>
              <th className="px-3 py-2 font-medium">Posts</th>
              <th className="px-3 py-2 font-medium">Hiring</th>
              <th className="px-3 py-2 font-medium">Signals</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.name}-${row.url ?? ""}`} className="border-b border-slate-50 align-top">
                <td className="px-3 py-2.5">
                  {row.url ? (
                    <a
                      href={row.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      {row.name}
                    </a>
                  ) : (
                    <p className="font-medium text-slate-800">{row.name}</p>
                  )}
                  {row.industry && (
                    <p className="text-xs text-slate-400">{row.industry}</p>
                  )}
                  {row.themes.length > 0 && (
                    <p className="mt-1 text-[11px] text-slate-400">
                      {row.themes.slice(0, 3).join(" · ")}
                    </p>
                  )}
                </td>
                <td className="px-3 py-2.5 text-slate-700">
                  {row.followers > 0 ? formatNumber(row.followers) : "—"}
                </td>
                <td className="px-3 py-2.5 text-slate-700">
                  {row.employeeCount > 0 ? row.employeeCount : "—"}
                </td>
                <td className="px-3 py-2.5 text-slate-700">
                  {row.postCount > 0 ? row.postCount : "—"}
                </td>
                <td className="px-3 py-2.5">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
                      row.isHiring
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {row.isHiring ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  {row.businessSignals.length === 0 ? (
                    <span className="text-xs text-slate-400">—</span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {row.businessSignals.slice(0, 4).map((signal) => (
                        <span
                          key={signal}
                          className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700"
                        >
                          {signal}
                        </span>
                      ))}
                    </div>
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
