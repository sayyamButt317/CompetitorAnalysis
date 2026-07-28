import type { CompetitorRow } from "@/types/dashboard";
import { Avatar } from "@/components/ui/Avatar";
import { Card, CardHeader } from "@/components/ui/Card";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { formatNumber, formatPercent } from "@/lib/format";

const columns: Column<CompetitorRow>[] = [
  {
    key: "rank",
    header: "Rank",
    className: "w-12",
    render: (row) => (
      <span className="font-semibold text-slate-400">#{row.rank}</span>
    ),
  },
  {
    key: "account",
    header: "Account",
    render: (row) => (
      <div className="flex items-center gap-2.5">
        <Avatar name={row.name} imageUrl={row.imageUrl} size="sm" />
        <span className="font-medium text-slate-800">{row.handle}</span>
      </div>
    ),
  },
  {
    key: "followers",
    header: "Followers",
    render: (row) => (
      <span className="text-slate-600">{formatNumber(row.followers)}</span>
    ),
  },
  {
    key: "engagement",
    header: "Avg. Engagement",
    render: (row) => (
      <span className="font-medium text-slate-800">
        {formatPercent(row.avgEngagement, 2)}
      </span>
    ),
  },
  {
    key: "posts",
    header: "Posts",
    render: (row) => <span className="text-slate-600">{row.posts}</span>,
  },
  {
    key: "growth",
    header: "vs Avg",
    render: (row) => {
      const positive = row.growth >= 0;
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium ${
            positive ? "text-emerald-600" : "text-red-500"
          }`}
        >
          <svg
            className={`h-3.5 w-3.5 ${positive ? "" : "rotate-180"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5 15 9m0 0h-5.25M15 9v5.25" />
          </svg>
          {formatPercent(Math.abs(row.growth), 1)}
        </span>
      );
    },
  },
];

interface TopCompetitorsTableProps {
  competitors: CompetitorRow[];
}

export function TopCompetitorsTable({ competitors }: TopCompetitorsTableProps) {
  return (
    <Card>
      <CardHeader title="Top Competitors by Engagement Rate" />
      <DataTable
        columns={columns}
        data={competitors}
        footer={
          <button type="button" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
            View all →
          </button>
        }
      />
    </Card>
  );
}
