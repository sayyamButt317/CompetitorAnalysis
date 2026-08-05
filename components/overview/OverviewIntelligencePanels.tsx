import { GapAnalysisCard } from "@/components/dashboard/GapAnalysisCard";
import { RecommendationsCard } from "@/components/dashboard/RecommendationsCard";
import { SimilarityScoresTable } from "@/components/dashboard/SimilarityScoresTable";
import { DonutChart } from "@/components/charts/DonutChart";
import type { GapAnalysisView, RecommendationItem, SimilarityRow } from "@/types/dashboard";
import type { OverviewMarketInsights } from "@/types/overview";
import type { SearchIntelligenceView } from "@/types/dashboard";

interface OverviewIntelligencePanelsProps {
  gapAnalysis?: GapAnalysisView;
  recommendations: RecommendationItem[];
  similarityScores: SimilarityRow[];
  marketInsights?: OverviewMarketInsights;
  searchIntelligence?: SearchIntelligenceView;
  companyKeywords: string[];
  companyProducts: string[];
  companyFeatures: string[];
}

export function OverviewIntelligencePanels({
  gapAnalysis,
  recommendations,
  similarityScores,
  marketInsights,
  searchIntelligence,
  companyKeywords,
  companyProducts,
  companyFeatures,
}: OverviewIntelligencePanelsProps) {
  return (
    <div className="space-y-5">
      {(companyKeywords.length > 0 ||
        companyProducts.length > 0 ||
        companyFeatures.length > 0) && (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">Company Signals</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <TagBlock title="Keywords" items={companyKeywords} />
            <TagBlock title="Products" items={companyProducts} />
            <TagBlock title="Features" items={companyFeatures} />
          </div>
        </section>
      )}

      {similarityScores.length > 0 && <SimilarityScoresTable rows={similarityScores} />}

      {(gapAnalysis || recommendations.length > 0) && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {recommendations.length > 0 && <RecommendationsCard items={recommendations} />}
          {gapAnalysis && <GapAnalysisCard gaps={gapAnalysis} />}
        </div>
      )}

      {marketInsights && (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h3 className="mb-1 text-sm font-semibold text-slate-800">Market Insights</h3>
          {marketInsights.contentSummary && (
            <p className="mb-4 text-sm leading-relaxed text-slate-600">
              {marketInsights.contentSummary}
            </p>
          )}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {marketInsights.dominantFormats.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold text-slate-500">Dominant Formats</p>
                <DonutChart segments={marketInsights.dominantFormats} centerLabel="Formats" size={130} />
              </div>
            )}
            {marketInsights.dominantThemes.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold text-slate-500">Dominant Themes</p>
                <DonutChart segments={marketInsights.dominantThemes} centerLabel="Themes" size={130} />
              </div>
            )}
            {marketInsights.dominantCategories.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold text-slate-500">Categories</p>
                <DonutChart
                  segments={marketInsights.dominantCategories}
                  centerLabel="Categories"
                  size={130}
                />
              </div>
            )}
          </div>
          {marketInsights.topics.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold text-slate-500">Topics</p>
              <div className="flex flex-wrap gap-1.5">
                {marketInsights.topics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-medium text-violet-700"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}
          {marketInsights.topHashtags.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold text-slate-500">Market Hashtags</p>
              <div className="flex flex-wrap gap-1.5">
                {marketInsights.topHashtags.map((item) => (
                  <span
                    key={item.tag}
                    className="rounded-full bg-pink-50 px-2.5 py-1 text-[11px] font-medium text-pink-700"
                  >
                    {item.tag} ({item.count})
                  </span>
                ))}
              </div>
            </div>
          )}
          {marketInsights.insights.length > 0 && (
            <ul className="mt-4 space-y-1.5">
              {marketInsights.insights.map((insight) => (
                <li key={insight} className="text-xs leading-relaxed text-slate-600">
                  • {insight}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {searchIntelligence && (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-800">Search Intelligence</h3>
            {searchIntelligence.confidence != null && (
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                {Math.round(searchIntelligence.confidence * 100)}% confidence
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <TagBlock title="Search keywords" items={searchIntelligence.searchKeywords} />
            <TagBlock title="Industry terms" items={searchIntelligence.industryTerms} />
            <TagBlock title="Product terms" items={searchIntelligence.productTerms} />
            <TagBlock title="Audience terms" items={searchIntelligence.audienceTerms} />
            <TagBlock title="Competitor patterns" items={searchIntelligence.competitorPatterns} />
            <TagBlock title="Queries" items={searchIntelligence.searchQueries} />
            <TagBlock title="Alternative names" items={searchIntelligence.alternativeNames} />
            <TagBlock title="Excluded terms" items={searchIntelligence.excludedTerms} />
          </div>
        </section>
      )}
    </div>
  );
}

function TagBlock({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-slate-500">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.slice(0, 16).map((item) => (
          <span
            key={item}
            className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
