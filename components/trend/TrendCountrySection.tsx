"use client";

import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { PlatformIcon, SourceLink } from "@/components/trend/PlatformIcon";
import type { CountryTrendSection, GoogleTrendRow } from "@/types/trends";

interface TrendCountrySectionProps {
  sections: CountryTrendSection[];
}

function QueryList({ rows, emptyLabel }: { rows: GoogleTrendRow[]; emptyLabel: string }) {
  if (rows.length === 0) {
    return <p className="py-4 text-center text-xs text-slate-400">{emptyLabel}</p>;
  }

  return (
    <ul className="divide-y divide-slate-100">
      {rows.map((row) => (
        <li key={`${row.title}-${row.rank}`} className="flex items-start gap-3 py-2.5">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-blue-50 text-[10px] font-bold text-blue-600">
            {row.rank}
          </span>
          <div className="min-w-0 flex-1">
            {row.exploreUrl ? (
              <a
                href={row.exploreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="line-clamp-2 text-sm font-medium text-slate-900 hover:text-indigo-600"
              >
                {row.title}
              </a>
            ) : (
              <p className="line-clamp-2 text-sm font-medium text-slate-900">{row.title}</p>
            )}
            <p className="mt-0.5 text-xs text-slate-400">
              {row.traffic} · {row.queryType}
            </p>
            {row.newsUrl && (
              <SourceLink label={row.newsTitle ?? "News"} url={row.newsUrl} className="mt-1" />
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function TrendCountrySection({ sections }: TrendCountrySectionProps) {
  const [activeCode, setActiveCode] = useState(sections[0]?.countryCode ?? "");
  const active = sections.find((s) => s.countryCode === activeCode) ?? sections[0];

  if (sections.length === 0) return null;

  return (
    <Card>
      <CardHeader
        title="Google Trends by Country"
        subtitle="Top and rising queries per region"
        action={<PlatformIcon platform="google" size="md" />}
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {sections.map((section) => (
          <button
            key={section.countryCode}
            type="button"
            onClick={() => setActiveCode(section.countryCode)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              active?.countryCode === section.countryCode
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {section.country}
          </button>
        ))}
      </div>

      {active && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">Top Queries</h3>
              {active.exploreUrl && (
                <a
                  href={active.exploreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-indigo-600 hover:underline"
                >
                  Explore on Google
                </a>
              )}
            </div>
            <QueryList rows={active.topQueries} emptyLabel="No top queries for this region." />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">Rising Queries</h3>
              {active.trendingUrl && (
                <a
                  href={active.trendingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-indigo-600 hover:underline"
                >
                  View trending
                </a>
              )}
            </div>
            <QueryList rows={active.risingQueries} emptyLabel="No rising queries for this region." />
          </div>
        </div>
      )}
    </Card>
  );
}
