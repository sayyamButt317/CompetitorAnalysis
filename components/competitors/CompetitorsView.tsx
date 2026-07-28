import { AIInsightsCard } from "@/components/dashboard/AIInsightsCard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TopCompetitorsTable } from "@/components/dashboard/TopCompetitorsTable";
import { CompetitorsDetailTable } from "@/components/competitors/CompetitorsDetailTable";
import { ChartCard } from "@/components/charts/ChartCard";
import { DonutChart } from "@/components/charts/DonutChart";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HashtagList } from "@/components/lists/HashtagList";
import { TrendingTopics } from "@/components/lists/TrendingTopics";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCardGrid } from "@/components/ui/StatCard";
import { getNavItems } from "@/lib/nav-items";
import type { CompetitorsPageData } from "@/types/competitors";

interface CompetitorsViewProps {
  data: CompetitorsPageData;
  onRefresh?: () => void;
}

export function CompetitorsView({ data, onRefresh }: CompetitorsViewProps) {
  return (
    <DashboardLayout navItems={getNavItems("competitors")} company={data.company}>
      <DashboardHeader
        title="Competitor Analysis"
        subtitle={data.company.subtitle}
        lastUpdated={data.lastUpdated}
      />

      <div className="space-y-5 p-6 lg:p-8">
        <StatCardGrid metrics={data.stats} />

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <TopCompetitorsTable competitors={data.topCompetitors} />
          </div>
          <AIInsightsCard insights={data.aiInsights} />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <ChartCard title="Content Type Distribution">
            <DonutChart segments={data.contentTypes} centerLabel="Content Mix" />
          </ChartCard>
          <ChartCard title="Content Theme Distribution">
            <DonutChart segments={data.contentThemes} centerLabel="Themes" />
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader title="Top Hashtags" />
            <HashtagList items={data.hashtags} />
          </Card>
          <Card>
            <CardHeader title="Trending Topics" />
            <TrendingTopics topics={data.trendingTopics} />
          </Card>
        </div>

        <CompetitorsDetailTable competitors={data.competitorDetails} />

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
