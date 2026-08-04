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
import { TrendPlatformSections } from "@/components/trend/TrendPlatformSections";
import { TrendRankedList } from "@/components/trend/TrendRankedList";
import { TrendStatCards } from "@/components/trend/TrendStatCards";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { exportTrendsToCsv } from "@/lib/trend-export";
import { getNavItems } from "@/lib/nav-items";
import type { PlatformId, TrendsPageData } from "@/types/trends";

const SOCIAL_PLATFORMS: PlatformId[] = ["reddit", "x", "facebook", "linkedin"];

interface TrendViewProps {
  data: TrendsPageData;
  onRefresh?: () => void;
  navActiveId?: string;
}

export function TrendView({ data, onRefresh, navActiveId = "trends" }: TrendViewProps) {
  const socialSections = data.platformSections.filter((section) =>
    SOCIAL_PLATFORMS.includes(section.id),
  );

  return (
    <DashboardLayout navItems={getNavItems(navActiveId)} company={data.company}>
      <TrendHeader
        lastUpdated={data.lastUpdated}
        sourceCount={data.sourceCount}
        onRefresh={onRefresh}
        onExport={() => exportTrendsToCsv(data)}
      />

      <div className="space-y-5 p-6 lg:p-8">
        <TrendStatCards metrics={data.stats} />

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

        <TrendPlatformSections sections={socialSections} />

        <TrendGoogleCards items={data.googleTrends} />

        <TrendAllScoresList items={data.allTrendScores} />

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <TrendCountryHeatmap countries={data.topCountries} />
          <TrendNewsTimeline entries={data.newsTimeline} />
          <TrendSourceBreakdown sources={data.sourceBreakdown} />
        </div>

        <TrendPlatformBreakdown platforms={data.platformBreakdown} />
      </div>
    </DashboardLayout>
  );
}
