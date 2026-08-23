import { AiSummarySwot, TopCompetitorsStrip } from "@/components/overview/AiSummaryAndCompetitors";
import { CompanyDnaGrid } from "@/components/overview/CompanyDnaGrid";
import { OverviewCompanyCatalog } from "@/components/overview/OverviewCompanyCatalog";
import { InstagramOverviewCard } from "@/components/overview/InstagramOverviewCard";
import { LinkedInOverviewCard } from "@/components/overview/LinkedInOverviewCard";
import { OverviewCompetitorMatch } from "@/components/overview/OverviewCompetitorMatch";
import { OverviewDeepCoverage } from "@/components/overview/OverviewDeepCoverage";
import { OverviewHero } from "@/components/overview/OverviewHero";
import { OverviewIntelligencePanels } from "@/components/overview/OverviewIntelligencePanels";
import { OverviewMediaRail } from "@/components/overview/OverviewMediaRail";
import { OverviewMetricCards } from "@/components/overview/OverviewMetricCards";
import { OverviewPayloadExtras } from "@/components/overview/OverviewPayloadExtras";
import { WebsiteIntelligenceCard } from "@/components/overview/WebsiteIntelligenceCard";
import type { OverviewPageData } from "@/types/overview";

interface OverviewViewProps {
  data: OverviewPageData;
}

export function OverviewView({ data }: OverviewViewProps) {
  const companyPosts = data.instagram?.posts ?? [];
  const companyVideos = companyPosts.filter((post) => post.isVideo);
  const competitorPosts = data.competitors.flatMap((competitor) => competitor.posts);
  const competitorVideos = competitorPosts.filter((post) => post.isVideo);

  return (
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

      <OverviewHero data={data.hero} extras={data.companyExtras} />
      <OverviewMetricCards metrics={data.metrics} />
      <CompanyDnaGrid columns={data.dna} />

      <OverviewCompanyCatalog
        keywords={data.companyKeywords}
        products={data.companyProducts}
        features={data.companyFeatures}
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {data.instagram ? (
          <InstagramOverviewCard data={data.instagram} />
        ) : (
          <EmptyPanel title="Instagram Overview" body="No Instagram analysis in this run." />
        )}
        {data.linkedin ? (
          <LinkedInOverviewCard data={data.linkedin} />
        ) : (
          <EmptyPanel title="LinkedIn Overview" body="No LinkedIn analysis in this run." />
        )}
        <WebsiteIntelligenceCard data={data.website} />
      </div>

      <OverviewMediaRail
        title="Your Instagram Media"
        subtitle={`${companyPosts.length} posts mapped · ${companyVideos.length} video/reel`}
        posts={companyPosts}
        emptyLabel="No company Instagram posts found in this analysis payload."
      />

      <OverviewMediaRail
        title="Competitor Instagram Videos & Posts"
        subtitle={`${competitorVideos.length} reels/videos · ${competitorPosts.length} total competitor posts`}
        posts={[...competitorVideos, ...competitorPosts.filter((post) => !post.isVideo)]}
        emptyLabel="No competitor Instagram media available yet."
      />

      <AiSummarySwot
        brief={data.executiveBrief}
        executiveSummary={data.executiveSummary}
        swot={data.swot}
      />
      <TopCompetitorsStrip competitors={data.topCompetitors} />

      <OverviewCompetitorMatch
        companyName={data.hero.name}
        handles={data.comparisonHandles}
        rows={data.comparisonRows}
        competitors={data.competitors}
      />

      <OverviewIntelligencePanels
        gapAnalysis={data.gapAnalysis}
        recommendations={data.recommendations}
        similarityScores={data.similarityScores}
        marketInsights={data.marketInsights}
        searchIntelligence={data.searchIntelligence}
      />

      <OverviewDeepCoverage
        runMeta={data.runMeta}
        companyExtras={data.companyExtras}
        pipelineStatus={data.pipelineStatus}
        averageSimilarity={data.averageSimilarity}
        priorityGaps={data.priorityGaps}
        businessSignals={data.businessSignals}
        reviewIntel={data.reviewIntel}
        technologyIntel={data.technologyIntel}
        marketingIntel={data.marketingIntel}
        contentStrategyIntel={data.contentStrategyIntel}
        competitorGaps={data.competitorGaps}
        competitorWebsiteIntel={data.competitorWebsiteIntel}
      />

      <OverviewPayloadExtras
        website={data.website}
        runMeta={data.runMeta}
        linkedInMarket={data.linkedInMarket}
        reportExtras={data.reportExtras}
      />

      <p className="pb-2 text-center text-xs text-slate-400">
        Data refreshed on {formatFooterDate(data.lastUpdated)}. Competra AI analyzes public data
        across social and web sources.
      </p>
    </div>
  );
}

function EmptyPanel({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500">{body}</p>
    </div>
  );
}

function formatFooterDate(value: string): string {
  try {
    return new Date(value).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return value;
  }
}
