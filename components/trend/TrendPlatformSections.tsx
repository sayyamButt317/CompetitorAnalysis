import { Card, CardHeader } from "@/components/ui/Card";
import { PlatformIcon, SourceLink } from "@/components/trend/PlatformIcon";
import type { PlatformSection } from "@/types/trends";

interface TrendPlatformSectionsProps {
  sections: PlatformSection[];
}

export function TrendPlatformSections({ sections }: TrendPlatformSectionsProps) {
  if (sections.length === 0) return null;

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Social Platform Trends</h2>
        <p className="mt-0.5 text-sm text-slate-500">
          Each item links to its source page so you can verify the trend, reel format, or topic
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {sections.map((section) => (
          <Card key={section.id}>
            <CardHeader
              title={section.label}
              subtitle={`${section.sourceCount} sources · ${section.totalSignals} signals`}
              action={<PlatformIcon platform={section.id} size="md" />}
            />

            {section.items.length > 0 ? (
              <ul className="divide-y divide-slate-100">
                {section.items.map((item) => (
                  <li key={item.id} className="flex items-start justify-between gap-3 py-2.5">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium uppercase text-slate-500">
                          {item.type}
                        </span>
                        {item.metric && (
                          <span className="text-[10px] text-slate-400">{item.metric}</span>
                        )}
                      </div>
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="line-clamp-2 text-sm font-medium text-slate-900 hover:text-indigo-600"
                        >
                          {item.title}
                        </a>
                      ) : (
                        <p className="line-clamp-2 text-sm font-medium text-slate-900">
                          {item.title}
                        </p>
                      )}
                      <SourceLink label={item.source} url={item.url} className="mt-1" />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">
                {section.emptyMessage ?? "No data available."}
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
