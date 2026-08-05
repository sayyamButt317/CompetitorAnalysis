import { Card, CardHeader } from "@/components/ui/Card";
import type { SimilarityRow } from "@/types/dashboard";

interface SimilarityScoresTableProps {
  rows: SimilarityRow[];
}

function pct(value: number): string {
  return `${(value * 100).toFixed(0)}%`;
}

export function SimilarityScoresTable({ rows }: SimilarityScoresTableProps) {
  if (rows.length === 0) return null;

  return (
    <Card className="overflow-hidden" padding="sm">
      <div className="px-2 pt-2">
        <CardHeader title="Similarity Scores" subtitle="How closely rivals match your company" />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
              <th className="px-3 py-2 font-medium">Competitor</th>
              <th className="px-3 py-2 font-medium">Overall</th>
              <th className="px-3 py-2 font-medium">Services</th>
              <th className="px-3 py-2 font-medium">Tech</th>
              <th className="px-3 py-2 font-medium">Marketing</th>
              <th className="px-3 py-2 font-medium">Content</th>
              <th className="px-3 py-2 font-medium">Location</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row.name}-${row.username ?? ""}-${index}`} className="border-b border-slate-50">
                <td className="px-3 py-2.5">
                  <p className="font-medium text-slate-800">{row.name}</p>
                  {row.username && (
                    <p className="text-xs text-slate-400">@{row.username}</p>
                  )}
                </td>
                <td className="px-3 py-2.5 font-semibold text-indigo-600">{pct(row.overall)}</td>
                <td className="px-3 py-2.5 text-slate-600">{pct(row.services)}</td>
                <td className="px-3 py-2.5 text-slate-600">{pct(row.technology)}</td>
                <td className="px-3 py-2.5 text-slate-600">{pct(row.marketing)}</td>
                <td className="px-3 py-2.5 text-slate-600">{pct(row.content)}</td>
                <td className="px-3 py-2.5 text-slate-600">{pct(row.location)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
