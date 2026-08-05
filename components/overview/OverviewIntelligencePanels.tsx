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
          {(marketInsights.mostUsedFormat || marketInsights.mostUsedCategory) && (
            <div className="mb-4 flex flex-wrap gap-2">
              {marketInsights.mostUsedFormat && (
                <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-700">
                  Most used format: {marketInsights.mostUsedFormat}
                </span>
              )}
              {marketInsights.mostUsedCategory && (
                <span className="rounded-md bg-violet-50 px-2.5 py-1 text-[11px] font-medium text-violet-700">
                  Most used category: {marketInsights.mostUsedCategory}
                </span>
              )}
            </div>
          )}
          <div className="space-y-5">
            {(marketInsights.dominantFormats.length > 0 ||
              marketInsights.dominantThemes.length > 0) && (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {marketInsights.dominantFormats.length > 0 && (
                  <div className="min-w-0 overflow-hidden">
                    <p className="mb-2 text-xs font-semibold text-slate-500">Dominant Formats</p>
                    <DonutChart
                      segments={marketInsights.dominantFormats}
                      centerLabel="Formats"
                      size={130}
                    />
                  </div>
                )}
                {marketInsights.dominantThemes.length > 0 && (
                  <div className="min-w-0 overflow-hidden">
                    <p className="mb-2 text-xs font-semibold text-slate-500">Dominant Themes</p>
                    <DonutChart
                      segments={marketInsights.dominantThemes}
                      centerLabel="Themes"
                      size={130}
                    />
                  </div>
                )}
              </div>
            )}
            {marketInsights.dominantCategories.length > 0 && (
              <div className="w-full min-w-0 overflow-hidden">
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
                    key={topic.topic}
                    className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-medium text-violet-700"
                  >
                    {topic.topic}
                    {topic.postCount != null ? ` · ${topic.postCount} posts` : ""}
                    {topic.creatorCount != null ? ` · ${topic.creatorCount} creators` : ""}
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
          {marketInsights.hashtagSummary.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold text-slate-500">Hashtag Summary</p>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400">
                      <th className="px-2 py-1.5 font-semibold">Hashtag</th>
                      <th className="px-2 py-1.5 font-semibold">Posts</th>
                      <th className="px-2 py-1.5 font-semibold">Creators</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marketInsights.hashtagSummary.slice(0, 20).map((item) => (
                      <tr key={item.tag} className="border-b border-slate-50 text-slate-700">
                        <td className="px-2 py-1.5 font-medium text-pink-700">{item.tag}</td>
                        <td className="px-2 py-1.5">{item.postCount}</td>
                        <td className="px-2 py-1.5">{item.creatorCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
        {items.slice(0, 16).map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
