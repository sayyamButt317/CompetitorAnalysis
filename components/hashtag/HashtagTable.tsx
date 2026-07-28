"use client";

import { useMemo, useState } from "react";
import { HashtagSparkline } from "@/components/hashtag/HashtagSparkline";
import { ContentPagination } from "@/components/content/ContentPagination";
import { Avatar } from "@/components/ui/Avatar";
import { Card, CardHeader } from "@/components/ui/Card";
import { filterHashtagRows, paginateItems } from "@/lib/hashtag-filters";
import type { HashtagRow, HashtagSortOption } from "@/types/hashtag";

interface HashtagTableProps {
  rows: HashtagRow[];
}

export function HashtagTable({ rows }: HashtagTableProps) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<HashtagSortOption>("frequency-desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const filteredRows = useMemo(
    () => filterHashtagRows(rows, search, sort),
    [rows, search, sort],
  );

  const paginatedRows = useMemo(
    () => paginateItems(filteredRows, page, pageSize),
    [filteredRows, page, pageSize],
  );

  const maxFrequency = filteredRows[0]?.frequency ?? 1;

  return (
    <Card className="overflow-hidden">
      <CardHeader
        title="Top Hashtags"
        subtitle={`Showing ${paginatedRows.length > 0 ? (page - 1) * pageSize + 1 : 0} to ${Math.min(page * pageSize, filteredRows.length)} of ${filteredRows.length}`}
      />

      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search hashtag..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <select
            value={sort}
            onChange={(event) => {
              setSort(event.target.value as HashtagSortOption);
              setPage(1);
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
          >
            <option value="frequency-desc">Sort by: Frequency (High to Low)</option>
            <option value="frequency-asc">Sort by: Frequency (Low to High)</option>
            <option value="alpha">Sort by: Alphabetical</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="px-5 py-3 text-left text-xs font-medium text-slate-400">#</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-slate-400">Hashtag</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-slate-400">Frequency</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-slate-400">% of Total</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-slate-400">Usage Trend</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-slate-400">Top Competitors</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-500">
                  No hashtags match your search.
                </td>
              </tr>
            ) : (
              paginatedRows.map((row) => (
                <tr key={row.tag} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-5 py-4 font-semibold text-slate-400">{row.rank}</td>
                  <td className="px-5 py-4 font-medium text-indigo-600">{row.displayTag}</td>
                  <td className="px-5 py-4 text-slate-700">{row.frequency}</td>
                  <td className="px-5 py-4">
                    <div className="flex min-w-[120px] items-center gap-2">
                      <span className="w-10 text-slate-700">{row.percentOfTotal.toFixed(1)}%</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-indigo-500"
                          style={{
                            width: `${(row.frequency / maxFrequency) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <HashtagSparkline values={row.trend} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center">
                      {row.topCompetitors.slice(0, 3).map((competitor, index) => (
                        <Avatar
                          key={competitor.username}
                          name={competitor.name}
                          imageUrl={competitor.imageUrl}
                          size="sm"
                          className={index > 0 ? "-ml-2 ring-2 ring-white" : ""}
                        />
                      ))}
                      {row.topCompetitors.length > 3 && (
                        <span className="ml-2 text-xs font-medium text-slate-500">
                          +{row.topCompetitors.length - 3}
                        </span>
                      )}
                      {row.topCompetitors.length === 0 && (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-5 pb-5">
        <ContentPagination
          page={page}
          pageSize={pageSize}
          totalItems={filteredRows.length}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
          pageSizes={[20, 40, 60]}
        />
      </div>
    </Card>
  );
}
