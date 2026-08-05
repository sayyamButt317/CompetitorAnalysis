import { Card, CardHeader } from "@/components/ui/Card";
import type { SearchIntelligenceView } from "@/types/dashboard";

interface SearchIntelligenceCardProps {
  data: SearchIntelligenceView;
}

function TermGroup({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;

  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-slate-500">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SearchIntelligenceCard({ data }: SearchIntelligenceCardProps) {
  return (
    <Card>
      <CardHeader
        title="Search Intelligence"
        subtitle={
          data.companyName
            ? `${data.companyName}${
                data.confidence != null
                  ? ` · confidence ${(data.confidence * 100).toFixed(0)}%`
                  : ""
              }`
            : undefined
        }
      />

      <div className="space-y-4">
        <TermGroup title="Search Keywords" items={data.searchKeywords} />
        <TermGroup title="Industry Terms" items={data.industryTerms} />
        <TermGroup title="Product Terms" items={data.productTerms} />
        <TermGroup title="Audience Terms" items={data.audienceTerms} />
        <TermGroup title="Competitor Patterns" items={data.competitorPatterns} />
        <TermGroup title="Alternative Names" items={data.alternativeNames} />
        <TermGroup title="Excluded Terms" items={data.excludedTerms} />

        {data.searchQueries.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold text-slate-500">Search Queries</p>
            <ul className="space-y-1.5">
              {data.searchQueries.slice(0, 8).map((query) => (
                <li key={query} className="text-xs leading-relaxed text-slate-600">
                  • {query}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}
