import type {
  OverviewAverageSimilarity,
  OverviewBusinessSignals,
  OverviewCompanyExtras,
  OverviewCompetitorGaps,
  OverviewContentStrategyIntel,
  OverviewMarketingIntel,
  OverviewPriorityGap,
  OverviewReviewIntel,
  OverviewRunMeta,
  OverviewTechnologyIntel,
  OverviewWebsiteIntelCard,
} from "@/types/overview";
import { formatEngagementRate } from "@/lib/format";

interface OverviewDeepCoverageProps {
  runMeta: OverviewRunMeta;
  companyExtras: OverviewCompanyExtras;
  averageSimilarity?: OverviewAverageSimilarity;
  priorityGaps: OverviewPriorityGap[];
  businessSignals?: OverviewBusinessSignals;
  reviewIntel?: OverviewReviewIntel;
  technologyIntel?: OverviewTechnologyIntel;
  marketingIntel?: OverviewMarketingIntel;
  contentStrategyIntel?: OverviewContentStrategyIntel;
  competitorGaps?: OverviewCompetitorGaps;
  competitorWebsiteIntel: OverviewWebsiteIntelCard[];
}

export function OverviewDeepCoverage({
  runMeta,
  companyExtras,
  averageSimilarity,
  priorityGaps,
  businessSignals,
  reviewIntel,
  technologyIntel,
  marketingIntel,
  contentStrategyIntel,
  competitorGaps,
  competitorWebsiteIntel,
}: OverviewDeepCoverageProps) {
  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-slate-800">Run Metadata & API Usage</h3>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-6">
          <Meta label="Mode" value={runMeta.matchingMode ?? "—"} />
          <Meta label="Agent" value={runMeta.agentMode ?? "—"} />
          <Meta label="Status" value={runMeta.status ?? "—"} />
          <Meta label="Region" value={runMeta.region ?? "—"} />
          <Meta
            label="Duration"
            value={runMeta.durationSec != null ? `${Math.round(runMeta.durationSec)}s` : "—"}
          />
          <Meta label="Competitors" value={String(runMeta.competitorCount)} />
          <Meta label="Posts" value={String(runMeta.postCount)} />
          <Meta label="Post limit" value={String(runMeta.postLimit ?? "—")} />
          <Meta label="Pool" value={String(runMeta.candidatePoolSize ?? "—")} />
          <Meta label="Verified" value={String(runMeta.verifiedCount ?? "—")} />
          <Meta label="Limit" value={String(runMeta.competitorLimit ?? "—")} />
          <Meta label="Skip LI" value={runMeta.skipLinkedIn ? "Yes" : "No"} />
          <Meta label="Serverless" value={runMeta.serverless ? "Yes" : "No"} />
          <Meta label="Analysis ID" value={runMeta.analysisId ? `${runMeta.analysisId.slice(0, 8)}…` : "—"} />
          <Meta label="Prompt ID" value={runMeta.promptId ? `${runMeta.promptId.slice(0, 8)}…` : "—"} />
          <Meta label="Source" value={runMeta.discoverySource ?? "—"} />
          <Meta label="Timestamp" value={runMeta.timestamp ?? "—"} />
        </div>
        {runMeta.platforms.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {runMeta.platforms.map((platform) => (
              <Chip key={platform}>{platform}</Chip>
            ))}
          </div>
        )}
        {(runMeta.apiCalls.length > 0 || runMeta.callBreakdown.length > 0) && (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <CountList title="API calls" items={runMeta.apiCalls} />
            <CountList title="Call breakdown" items={runMeta.callBreakdown} />
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-slate-800">Company Model & Profile Extras</h3>
        <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-4">
          <Meta label="Business model" value={companyExtras.businessModel ?? "—"} />
          <Meta label="Pricing model" value={companyExtras.pricingModel ?? "—"} />
          <Meta
            label="Confidence"
            value={
              companyExtras.confidence != null
                ? `${Math.round(companyExtras.confidence * 100)}%`
                : "—"
            }
          />
          <Meta label="Countries" value={String(companyExtras.countries.length || "—")} />
          <Meta label="City" value={companyExtras.city ?? "—"} />
          <Meta label="Country" value={companyExtras.country ?? "—"} />
          <Meta label="Source" value={companyExtras.source ?? "—"} />
          <Meta label="LinkedIn user" value={companyExtras.linkedinUsername ?? "—"} />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <TagBlock title="Target industries" items={companyExtras.targetIndustries} />
          <TagBlock title="Competitors hint" items={companyExtras.competitorsHint} />
          <TagBlock title="Company signals" items={companyExtras.companySignals} />
          <TagBlock title="Extracted keywords" items={companyExtras.extractedKeywords} />
          <TagBlock title="Flagship services" items={companyExtras.flagshipServices} />
          <TagBlock title="Audience pain points" items={companyExtras.audiencePainPoints} />
          <TagBlock title="Services" items={companyExtras.services} />
          <TagBlock title="Technologies" items={companyExtras.technologies} />
          <TagBlock title="Countries" items={companyExtras.countries} />
        </div>
      </section>

      {averageSimilarity && (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">Average Similarity vs Market</h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            <SimilarityBar label="Overall" value={averageSimilarity.overall} />
            <SimilarityBar label="Services" value={averageSimilarity.services} />
            <SimilarityBar label="Technology" value={averageSimilarity.technology} />
            <SimilarityBar label="Marketing" value={averageSimilarity.marketing} />
            <SimilarityBar label="Content" value={averageSimilarity.content} />
            <SimilarityBar label="Location" value={averageSimilarity.location} />
            <SimilarityBar label="Industry" value={averageSimilarity.industry} />
            <SimilarityBar label="Pricing" value={averageSimilarity.pricing} />
            <SimilarityBar label="Audience" value={averageSimilarity.targetAudience} />
            {averageSimilarity.products != null && (
              <SimilarityBar label="Products" value={averageSimilarity.products} />
            )}
            {averageSimilarity.geography != null && (
              <SimilarityBar label="Geography" value={averageSimilarity.geography} />
            )}
            {averageSimilarity.socialStrategy != null && (
              <SimilarityBar label="Social strategy" value={averageSimilarity.socialStrategy} />
            )}
            {averageSimilarity.contentStrategy != null && (
              <SimilarityBar label="Content strategy" value={averageSimilarity.contentStrategy} />
            )}
            {averageSimilarity.businessModel != null && (
              <SimilarityBar label="Business model" value={averageSimilarity.businessModel} />
            )}
            {averageSimilarity.positioning != null && (
              <SimilarityBar label="Positioning" value={averageSimilarity.positioning} />
            )}
          </div>
        </section>
      )}

      {priorityGaps.length > 0 && (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">
            Priority Gaps ({priorityGaps.length})
          </h3>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
            {priorityGaps.map((gap, index) => (
              <div
                key={`${gap.type}-${gap.item}-${index}`}
                className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2"
              >
                <div className="mb-1 flex flex-wrap gap-1.5">
                  <span className="rounded-md bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-rose-700">
                    {gap.priority}
                  </span>
                  <span className="rounded-md bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-slate-600">
                    {gap.type}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-800">{gap.item}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {competitorGaps && (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h3 className="mb-1 text-sm font-semibold text-slate-800">Competitor Gaps Report</h3>
          {competitorGaps.summary && (
            <p className="mb-4 text-sm text-slate-600">{competitorGaps.summary}</p>
          )}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TagBlock title="Service gaps" items={competitorGaps.services} />
            <TagBlock title="Technology gaps" items={competitorGaps.technologies} />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <CountList
              title="Content types"
              items={competitorGaps.contentTypes.map((item) => ({
                label: item.type,
                count: item.competitorCount,
              }))}
            />
            <CountList
              title="Business signals"
              items={competitorGaps.businessSignals.map((item) => ({
                label: item.signal,
                count: item.competitorCount,
              }))}
            />
            <CountList
              title="Review platforms"
              items={competitorGaps.reviewPlatforms.map((item) => ({
                label: item.platform,
                count: item.competitorCount,
              }))}
            />
            <CountList
              title="Industries targeted"
              items={competitorGaps.industriesTargeted.map((item) => ({
                label: item.industry,
                count: item.competitorCount,
              }))}
            />
          </div>
        </section>
      )}

      {businessSignals && (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">Business Signals</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TagBlock title="Your active signals" items={businessSignals.yourSignals} />
            <TagBlock
              title="Competitor-only signals"
              items={businessSignals.competitorOnlySignals}
            />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <CountList
              title="Market prevalence"
              items={businessSignals.marketPrevalence.map((item) => ({
                label: item.signal,
                count: item.count,
              }))}
            />
            <div>
              <p className="mb-2 text-xs font-semibold text-slate-500">Competitor signals</p>
              <ul className="space-y-2">
                {businessSignals.competitors.map((competitor) => (
                  <li key={competitor.name} className="rounded-xl bg-slate-50 px-3 py-2">
                    <p className="text-xs font-semibold text-slate-800">{competitor.name}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {competitor.activeSignals.map((signal) => (
                        <Chip key={signal}>{signal}</Chip>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {reviewIntel && (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">Review Intelligence</h3>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Flag on={reviewIntel.hasReviews} label="You have reviews" />
            {reviewIntel.yourPlatforms.length === 0 ? (
              <span className="text-xs text-slate-500">Not present on review platforms</span>
            ) : (
              reviewIntel.yourPlatforms.map((platform) => <Chip key={platform}>{platform}</Chip>)
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <CountList
              title="Review gaps"
              items={reviewIntel.gaps.map((item) => ({
                label: item.platform,
                count: item.competitorCount,
              }))}
            />
            <CountList
              title="Market presence"
              items={reviewIntel.marketPresence.map((item) => ({
                label: item.platform,
                count: item.competitorCount,
              }))}
            />
          </div>
          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold text-slate-500">Competitor review platforms</p>
            <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {reviewIntel.competitors.map((competitor) => (
                <li key={competitor.name} className="rounded-xl border border-slate-100 px-3 py-2">
                  <p className="truncate text-xs font-semibold text-slate-800">{competitor.name}</p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {competitor.platforms.length > 0
                      ? competitor.platforms.join(", ")
                      : "No platforms detected"}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {technologyIntel && (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">Technology Intelligence</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TagBlock title="Your technologies" items={technologyIntel.yourTechnologies} />
            <TagBlock title="Technology gaps" items={technologyIntel.technologyGaps} />
            <TagBlock title="Mentioned technologies" items={technologyIntel.technologiesMentioned} />
            <TagBlock
              title="Competitor technologies"
              items={technologyIntel.competitorTechnologies}
            />
          </div>
        </section>
      )}

      {marketingIntel && (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">Marketing Strategy</h3>
          <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-4">
            <Meta
              label="Mkt similarity"
              value={
                marketingIntel.marketingSimilarityAvg != null
                  ? `${Math.round(marketingIntel.marketingSimilarityAvg * 100)}%`
                  : "—"
              }
            />
            <Meta
              label="Thought leadership"
              value={String(marketingIntel.thoughtLeadershipScore ?? "—")}
            />
            <Meta label="Channels" value={String(marketingIntel.channels.length)} />
            <Meta label="Audience terms" value={String(marketingIntel.audienceTerms.length)} />
          </div>
          {marketingIntel.positioning && (
            <p className="mb-2 text-sm text-slate-700">{marketingIntel.positioning}</p>
          )}
          {marketingIntel.valueProposition && (
            <p className="mb-4 text-sm text-indigo-700">{marketingIntel.valueProposition}</p>
          )}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <TagBlock title="Channels" items={marketingIntel.channels} />
            <TagBlock title="Target audience" items={marketingIntel.targetAudience} />
            <TagBlock title="Audience terms" items={marketingIntel.audienceTerms} />
            <TagBlock
              title="Market themes"
              items={marketingIntel.dominantThemes.map((item) => `${item.theme} (${item.count})`)}
            />
            <TagBlock
              title="Market hashtags"
              items={marketingIntel.dominantHashtags.map((item) => `${item.tag} (${item.count})`)}
            />
          </div>
        </section>
      )}

      {contentStrategyIntel && (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">Content Strategy Intelligence</h3>
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <TagBlock title="Your LinkedIn themes" items={contentStrategyIntel.yourThemes} />
            <TagBlock title="Your Instagram hashtags" items={contentStrategyIntel.yourHashtags} />
          </div>
          <CountList
            title="Content type gaps"
            items={contentStrategyIntel.contentTypeGaps.map((item) => ({
              label: item.type,
              count: item.competitorCount,
            }))}
          />
          {contentStrategyIntel.competitorProfiles.length > 0 && (
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {contentStrategyIntel.competitorProfiles.map((profile, index) => (
                <article
                  key={`${profile.username ?? "profile"}-${index}`}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-3"
                >
                  <p className="text-sm font-semibold text-slate-800">
                    {profile.username ? `@${profile.username}` : `Profile ${index + 1}`}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {[profile.primaryFormat, profile.primaryCategory].filter(Boolean).join(" · ") ||
                      "Content profile"}
                  </p>
                  <p className="mt-2 text-xs text-slate-600">
                    {profile.postCount} posts · {formatEngagementRate(profile.avgEngagement)} ER
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {profile.topHashtags.map((tag) => (
                      <Chip key={tag}>{tag}</Chip>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {competitorWebsiteIntel.length > 0 && (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">
            Competitor Website Intelligence ({competitorWebsiteIntel.length})
          </h3>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {competitorWebsiteIntel.map((site) => (
              <article
                key={site.id}
                className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="truncate text-sm font-semibold text-slate-900">{site.name}</h4>
                    {site.companyName && site.companyName !== site.name && (
                      <p className="truncate text-xs text-slate-500">{site.companyName}</p>
                    )}
                  </div>
                  {site.confidence != null && (
                    <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                      {Math.round(site.confidence * 100)}%
                    </span>
                  )}
                </div>
                {site.description && (
                  <p className="mb-3 line-clamp-3 text-xs leading-relaxed text-slate-600">
                    {site.description}
                  </p>
                )}
                <div className="mb-3 grid grid-cols-2 gap-2">
                  <Meta label="Business" value={site.businessModel ?? "—"} />
                  <Meta label="Pricing" value={site.pricingModel ?? "—"} />
                </div>
                {site.positioning && (
                  <p className="mb-3 text-xs font-medium text-indigo-700">{site.positioning}</p>
                )}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <TagBlock title="Services" items={site.services} />
                  <TagBlock title="Technologies" items={site.technologies} />
                  <TagBlock title="Products" items={site.products} />
                  <TagBlock title="Industries" items={site.industries} />
                  <TagBlock title="Audience" items={site.targetAudience} />
                  <TagBlock title="Keywords" items={site.keywords} />
                  <TagBlock title="Features" items={site.features} />
                  <TagBlock title="Social links" items={site.socialLinks} />
                </div>
                {site.website && (
                  <a
                    href={site.website}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex text-xs font-medium text-sky-700 hover:text-sky-800"
                  >
                    Visit website →
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 truncate text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function TagBlock({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-slate-500">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.slice(0, 20).map((item, index) => (
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

function CountList({ title, items }: { title: string; items: { label: string; count: number }[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-slate-500">{title}</p>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li
            key={`${item.label}-${item.count}`}
            className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs"
          >
            <span className="truncate text-slate-700">{item.label}</span>
            <span className="font-semibold text-slate-900">{item.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Chip({ children }: { children: string }) {
  return (
    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
      {children}
    </span>
  );
}

function Flag({ on, label }: { on: boolean; label: string }) {
  return (
    <span
      className={`rounded-md px-2 py-1 text-[11px] font-semibold ${
        on ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
      }`}
    >
      {on ? "✓" : "–"} {label}
    </span>
  );
}

function SimilarityBar({ label, value }: { label: string; value: number }) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2 text-[11px]">
        <span className="text-slate-500">{label}</span>
        <span className="font-semibold text-slate-700">{pct}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-violet-500" style={{ width: `${Math.max(pct, 3)}%` }} />
      </div>
    </div>
  );
}
