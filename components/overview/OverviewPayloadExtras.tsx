import { displayText } from "@/lib/format";
import type {
  OverviewLinkedInMarketRow,
  OverviewReportExtras,
  OverviewRunMeta,
  OverviewWebsiteSection,
} from "@/types/overview";

interface OverviewPayloadExtrasProps {
  website: OverviewWebsiteSection;
  runMeta: OverviewRunMeta;
  linkedInMarket?: OverviewLinkedInMarketRow[];
  reportExtras: OverviewReportExtras;
}

export function OverviewPayloadExtras({
  website,
  runMeta,
  linkedInMarket,
  reportExtras,
}: OverviewPayloadExtrasProps) {
  const hasSeo =
    website.seoKeywords.length > 0 ||
    website.seoKeywordGaps.length > 0 ||
    website.seoIndustryTerms.length > 0 ||
    website.seoProductTerms.length > 0 ||
    website.seoAudienceTerms.length > 0 ||
    website.seoCompetitorPatterns.length > 0 ||
    website.seoSearchQueries.length > 0;

  const hasMarket = Boolean(linkedInMarket && linkedInMarket.length > 0);
  const hasReport =
    Boolean(reportExtras.intelligenceSummary) ||
    reportExtras.webCrawlKeys.length > 0 ||
    reportExtras.competitorIntelligencePresent ||
    runMeta.selectedCompetitors.length > 0;

  if (!hasSeo && !hasMarket && !hasReport && !website.url) return null;

  return (
    <div className="space-y-5">
      {(hasSeo || website.url || website.webCrawlAvailable) && (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">SEO & Web Crawl</h3>
          <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-4">
            <Meta label="Website" value={displayText(website.url)} />
            <Meta label="Web crawl" value={website.webCrawlAvailable ? "Available" : "Empty"} />
            <Meta label="SEO keywords" value={String(website.seoKeywords.length || "—")} />
            <Meta label="Keyword gaps" value={String(website.seoKeywordGaps.length || "—")} />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <TagBlock title="SEO keywords" items={website.seoKeywords} />
            <TagBlock title="Keyword gaps" items={website.seoKeywordGaps} />
            <TagBlock title="Industry terms" items={website.seoIndustryTerms} />
            <TagBlock title="Product terms" items={website.seoProductTerms} />
            <TagBlock title="Audience terms" items={website.seoAudienceTerms} />
            <TagBlock title="Competitor patterns" items={website.seoCompetitorPatterns} />
            <TagBlock title="Search queries" items={website.seoSearchQueries} />
            <TagBlock title="Web crawl keys" items={reportExtras.webCrawlKeys} />
          </div>
        </section>
      )}

      {runMeta.selectedCompetitors.length > 0 && (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">Filters Applied</h3>
          <div className="mb-3 grid grid-cols-2 gap-2 md:grid-cols-4">
            <Meta label="Mode" value={displayText(runMeta.matchingMode)} />
            <Meta label="Region" value={displayText(runMeta.region)} />
            <Meta label="Source" value={displayText(runMeta.discoverySource)} />
            <Meta label="Limit" value={String(runMeta.competitorLimit ?? "—")} />
          </div>
          <TagBlock title="Selected competitors" items={runMeta.selectedCompetitors} />
        </section>
      )}

      {reportExtras.intelligenceSummary && (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h3 className="mb-2 text-sm font-semibold text-slate-800">
            Competitor Intelligence Summary
          </h3>
          <p className="text-sm leading-relaxed text-slate-600">
            {reportExtras.intelligenceSummary}
          </p>
        </section>
      )}

      {reportExtras.competitorIntelligencePresent && reportExtras.competitorIntelligencePreview && (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h3 className="mb-2 text-sm font-semibold text-slate-800">Competitor Intelligence Payload</h3>
          <pre className="max-h-48 overflow-auto rounded-xl bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-600">
            {reportExtras.competitorIntelligencePreview}
          </pre>
        </section>
      )}

      {hasMarket && (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">
            LinkedIn Competitor Profiles ({linkedInMarket!.length})
          </h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {linkedInMarket!.map((row) => (
              <article
                key={`${row.name}-${row.url ?? "x"}`}
                className="rounded-xl border border-slate-100 bg-slate-50/80 p-3"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  {row.url ? (
                    <a
                      href={row.url}
                      target="_blank"
                      rel="noreferrer"
                      className="truncate text-sm font-semibold text-sky-700 hover:text-sky-800"
                    >
                      {row.name}
                    </a>
                  ) : (
                    <p className="truncate text-sm font-semibold text-slate-800">{row.name}</p>
                  )}
                  {row.isHiring && (
                    <span className="shrink-0 rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                      Hiring
                    </span>
                  )}
                </div>
                <p className="mb-2 text-[11px] text-slate-500">
                  {displayText(row.industry, "Industry n/a")} · {row.employeeCount} employees
                  {row.followers != null ? ` · ${row.followers} followers` : ""}
                  {row.thoughtLeadershipScore
                    ? ` · TL ${Math.round(row.thoughtLeadershipScore)}`
                    : ""}
                </p>
                {row.specialties.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1">
                    {row.specialties.slice(0, 4).map((item, index) => (
                      <span
                        key={`${displayText(item)}-${index}`}
                        className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-600"
                      >
                        {displayText(item)}
                      </span>
                    ))}
                  </div>
                )}
                {row.signals.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {row.signals.slice(0, 6).map((signal, index) => (
                      <span
                        key={`${displayText(signal)}-${index}`}
                        className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700"
                      >
                        {displayText(signal)}
                      </span>
                    ))}
                  </div>
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
      <p className="mt-0.5 truncate text-sm font-semibold text-slate-800" title={value}>
        {value}
      </p>
    </div>
  );
}

function TagBlock({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-slate-500">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.slice(0, 24).map((item, index) => (
          <span
            key={`${displayText(item)}-${index}`}
            className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
          >
            {displayText(item)}
          </span>
        ))}
      </div>
    </div>
  );
}
