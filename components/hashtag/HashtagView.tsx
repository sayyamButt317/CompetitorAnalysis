"use client";

import { HashtagHeader } from "@/components/hashtag/HashtagHeader";
import { HashtagOverview } from "@/components/hashtag/HashtagOverview";
import { HashtagStatCards } from "@/components/hashtag/HashtagStatCards";
import { HashtagTable } from "@/components/hashtag/HashtagTable";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { exportHashtagsToCsv } from "@/lib/hashtag-filters";
import { getNavItems } from "@/lib/nav-items";
import type { HashtagPageData } from "@/types/hashtag";

interface HashtagViewProps {
  data: HashtagPageData;
  onRefresh?: () => void;
}

export function HashtagView({ data, onRefresh }: HashtagViewProps) {
  return (
    <DashboardLayout navItems={getNavItems("hashtags")} company={data.company}>
      <HashtagHeader
        dateRange={data.dateRange}
        onExport={() => exportHashtagsToCsv(data.rows)}
      />

      <div className="space-y-5 p-6 lg:p-8">
        <HashtagStatCards metrics={data.stats} />

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="xl:col-span-1">
            <HashtagOverview
              segments={data.overviewSegments}
              centerValue={data.overviewCenterValue}
              cloudTags={data.cloudTags}
            />
          </div>
          <div className="xl:col-span-2">
            <HashtagTable rows={data.rows} />
          </div>
        </div>

        {onRefresh && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onRefresh}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Refresh data
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
