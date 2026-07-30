"use client";

import {
  TrendCountryHeatmap,
  TrendNewsTimeline,
  TrendPlatformBreakdown,
} from "@/components/trend/TrendBottomSection";
import {
  TrendAllScoresList,
  TrendSourceBreakdown,
} from "@/components/trend/TrendAllScoresList";
import { TrendGoogleCards } from "@/components/trend/TrendGoogleCards";
import { TrendHeader } from "@/components/trend/TrendHeader";
import { TrendInsightsPanel } from "@/components/trend/TrendInsightsPanel";
import { TrendRankedList } from "@/components/trend/TrendRankedList";
import { TrendSourcesPanel } from "@/components/trend/TrendSourcesPanel";
import { TrendStatCards } from "@/components/trend/TrendStatCards";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { exportTrendsToCsv } from "@/lib/trend-export";
import { getNavItems } from "@/lib/nav-items";
import type { TrendsPageData } from "@/types/trends";

interface TrendViewProps {
  data: TrendsPageData;
  onRefresh?: () => void;
}

export function TrendView({ data, onRefresh }: TrendViewProps) {
  return (
    <DashboardLayout navItems={getNavItems("trends")} company={data.company}>
      <TrendHeader
        lastUpdated={data.lastUpdated}
        sourceCount={data.sourceCount}
        onExport={() => exportTrendsToCsv(data)}
      />

      <div className="space-y-5 p-6 lg:p-8">
        <TrendStatCards metrics={data.stats} />

        <TrendSourcesPanel sources={data.webSources} sourceCount={data.sourceCount} />

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-4">
          <TrendRankedList
            title="Trending Hashtags"
            items={data.hashtags}
            metricLabel="posts"
          />
          <TrendRankedList
            title="Trending Topics"
            items={data.topics}
            metricLabel="score"
            showSparkline={false}
            linkLabel="View Insights"
          />
          <TrendRankedList
            title="Trending Reel Formats"
            items={data.reelFormats}
            metricLabel="score"
            showSparkline={false}
          />
          <TrendInsightsPanel
            countries={data.topCountries}
            insights={data.insights}
            recommendations={data.recommendations}
          />
        </div>

        <TrendGoogleCards items={data.googleTrends} />

        <TrendAllScoresList items={data.allTrendScores} />

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <TrendCountryHeatmap countries={data.topCountries} />
          <TrendNewsTimeline entries={data.newsTimeline} />
          <TrendSourceBreakdown sources={data.sourceBreakdown} />
        </div>

        <TrendPlatformBreakdown platforms={data.platformBreakdown} />

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
