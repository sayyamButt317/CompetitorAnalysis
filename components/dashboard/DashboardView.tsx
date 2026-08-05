import { AIInsightsCard } from "@/components/dashboard/AIInsightsCard";
import { CompanyProfileCard } from "@/components/dashboard/CompanyProfileCard";
import { CompanySocialCards } from "@/components/dashboard/CompanySocialCards";
import { CompetitorComparisonTable } from "@/components/dashboard/CompetitorComparisonTable";
import { CompetitorLinkedInTable } from "@/components/dashboard/CompetitorLinkedInTable";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { GapAnalysisCard } from "@/components/dashboard/GapAnalysisCard";
import { RecommendationsCard } from "@/components/dashboard/RecommendationsCard";
import { SearchIntelligenceCard } from "@/components/dashboard/SearchIntelligenceCard";
import { SimilarityScoresTable } from "@/components/dashboard/SimilarityScoresTable";
import { TopPerformingPosts } from "@/components/dashboard/SocialPostCard";
import { SwotGrid } from "@/components/dashboard/SwotGrid";
import { TopCompetitorsTable } from "@/components/dashboard/TopCompetitorsTable";
import { BarChart } from "@/components/charts/BarChart";
import { ChartCard } from "@/components/charts/ChartCard";
import { DonutChart } from "@/components/charts/DonutChart";
import { LineChart } from "@/components/charts/LineChart";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HashtagList } from "@/components/lists/HashtagList";
import { TrendingTopics } from "@/components/lists/TrendingTopics";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCardGrid } from "@/components/ui/StatCard";
import { getNavItems } from "@/lib/nav-items";
import type { DashboardData } from "@/types/dashboard";

interface DashboardViewProps {
  data: DashboardData;
  embedded?: boolean;
}

export function DashboardView({ data, embedded = false }: DashboardViewProps) {
  const content = (
    <>
      <DashboardHeader
        title="Competitor Analysis"
        subtitle={data.company.subtitle}
        lastUpdated={data.lastUpdated}
      />

      <div className="space-y-5 p-6 lg:p-8">
        {(data.analysisError || data.discoveryWarnings.length > 0) && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            {!data.analysisSuccess && data.analysisError && (
              <p className="text-sm font-medium text-amber-900">{data.analysisError}</p>
            )}
            {data.discoveryWarnings.length > 0 && (
              <ul className="mt-1 space-y-1">
                {data.discoveryWarnings.map((warning) => (
                  <li key={warning} className="text-xs text-amber-800">
                    {warning}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <StatCardGrid metrics={data.stats} />

        {data.companyProfile && (
          <CompanyProfileCard
            profile={data.companyProfile}
            discoveryReasoning={data.discoveryReasoning}
          />
        )}

        <CompanySocialCards
          instagram={data.companyInstagram}
          linkedin={data.companyLinkedIn}
        />

        {data.searchIntelligence && (
          <SearchIntelligenceCard data={data.searchIntelligence} />
        )}

        <CompetitorLinkedInTable rows={data.competitorLinkedIn} />

        {(data.recommendations.length > 0 || data.swot) && (
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <RecommendationsCard items={data.recommendations} />
            {data.swot && <SwotGrid swot={data.swot} />}
          </div>
        )}

        {data.gapAnalysis && <GapAnalysisCard gaps={data.gapAnalysis} />}

        <SimilarityScoresTable rows={data.similarityScores} />

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <TopCompetitorsTable competitors={data.topCompetitors} />

          <ChartCard title="Engagement Share of Competitors">
            <DonutChart
              segments={data.engagementShare}
              centerLabel="Total Engagement"
              centerValue="100%"
            />
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          <ChartCard title="Content Type Distribution">
            <DonutChart segments={data.contentTypes} centerLabel="Content Mix" />
          </ChartCard>
          <ChartCard title="Content Theme Distribution">
            <DonutChart segments={data.contentThemes} centerLabel="Themes" />
          </ChartCard>
          {data.contentCategories.length > 0 && (
            <ChartCard title="Content Categories">
              <DonutChart segments={data.contentCategories} centerLabel="Categories" />
            </ChartCard>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <ChartCard title="Posting Activity (by Day)" className="lg:col-span-1">
            <BarChart data={data.postingActivity} />
          </ChartCard>

          <Card className="lg:col-span-1">
            <CardHeader title="Top Hashtags" />
            <HashtagList items={data.hashtags} />
          </Card>

          <Card className="lg:col-span-1">
            <CardHeader title="Trending Topics" />
            <TrendingTopics topics={data.trendingTopics} />
          </Card>
        </div>

        <ChartCard title="Engagement Trend (Overall)">
          <div className="h-44 w-full">
            <LineChart data={data.engagementTrend} />
          </div>
        </ChartCard>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <CompetitorComparisonTable
              competitors={data.comparisonCompetitors}
              metrics={data.comparisonMetrics}
            />
          </div>
          <AIInsightsCard insights={data.aiInsights} />
        </div>

        <Card>
          <CardHeader title="Posts by Competitor" />
          <TopPerformingPosts groups={data.competitorPosts} />
        </Card>
      </div>
    </>
  );

  if (embedded) {
    return content;
  }

  return (
    <DashboardLayout navItems={getNavItems("overview")} company={data.company}>
      {content}
    </DashboardLayout>
  );
}
