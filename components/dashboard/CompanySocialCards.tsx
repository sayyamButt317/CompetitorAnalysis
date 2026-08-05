import { ChartCard } from "@/components/charts/ChartCard";
import { DonutChart } from "@/components/charts/DonutChart";
import { Card, CardHeader } from "@/components/ui/Card";
import { formatEngagementRate, formatNumber } from "@/lib/format";
import type { CompanyInstagramView, CompanyLinkedInView } from "@/types/dashboard";

interface CompanySocialCardsProps {
  instagram?: CompanyInstagramView;
  linkedin?: CompanyLinkedInView;
}

export function CompanySocialCards({ instagram, linkedin }: CompanySocialCardsProps) {
  if (!instagram && !linkedin) return null;

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {instagram && (
        <Card>
          <CardHeader
            title="Your Instagram"
            subtitle={instagram.username ? `@${instagram.username}` : undefined}
          />
          <div className="space-y-4">
            {instagram.bio && (
              <p className="whitespace-pre-line text-sm text-slate-600">{instagram.bio}</p>
            )}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Metric label="Followers" value={formatNumber(instagram.followers)} />
              <Metric label="Posts" value={String(instagram.postCount)} />
              <Metric label="Avg ER" value={formatEngagementRate(instagram.avgEngagement)} />
              <Metric label="Format" value={instagram.primaryFormat ?? "—"} />
            </div>

            {instagram.niche && (
              <p className="text-xs text-slate-500">
                <span className="font-semibold text-slate-600">Niche: </span>
                {instagram.niche}
              </p>
            )}

            {instagram.topHashtags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {instagram.topHashtags.slice(0, 8).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-pink-50 px-2 py-0.5 text-xs font-medium text-pink-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {instagram.mediaMix.length > 0 && (
              <ChartCard title="Media Mix" className="border-0 p-0 shadow-none">
                <DonutChart segments={instagram.mediaMix} centerLabel="Media Mix" />
              </ChartCard>
            )}
          </div>
        </Card>
      )}

      {linkedin && (
        <Card>
          <CardHeader
            title="Your LinkedIn"
            subtitle={
              linkedin.skipped
                ? "Partial LinkedIn intelligence"
                : linkedin.isHiring
                  ? "Hiring signals detected"
                  : linkedin.industry ?? "Company presence"
            }
            action={
              linkedin.url ? (
                <a
                  href={linkedin.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Open →
                </a>
              ) : undefined
            }
          />
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {linkedin.followers != null && linkedin.followers > 0 && (
                <Metric label="Followers" value={formatNumber(linkedin.followers)} />
              )}
              <Metric label="Employees" value={String(linkedin.employeeCount)} />
              <Metric label="Posts" value={String(linkedin.postCount)} />
              <Metric
                label="Thought Leadership"
                value={String(linkedin.thoughtLeadershipScore)}
              />
              <Metric label="Hiring" value={linkedin.isHiring ? "Yes" : "No"} />
            </div>

            {linkedin.specialties.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold text-slate-500">Specialties</p>
                <div className="flex flex-wrap gap-1.5">
                  {linkedin.specialties.map((item) => (
                    <span
                      key={item}
                      className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {linkedin.businessSignals.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold text-slate-500">Business Signals</p>
                <div className="flex flex-wrap gap-1.5">
                  {linkedin.businessSignals.map((signal) => (
                    <span
                      key={signal}
                      className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700"
                    >
                      {signal}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {linkedin.themes.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold text-slate-500">Content Themes</p>
                <div className="flex flex-wrap gap-1.5">
                  {linkedin.themes.map((theme) => (
                    <span
                      key={theme.theme}
                      className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
                    >
                      {theme.theme} ({theme.count})
                    </span>
                  ))}
                </div>
              </div>
            )}

            {linkedin.employees.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold text-slate-500">Team Snapshot</p>
                <ul className="space-y-1.5">
                  {linkedin.employees.map((employee) => (
                    <li
                      key={`${employee.name}-${employee.designation}`}
                      className="flex items-center justify-between gap-2 text-xs"
                    >
                      {employee.url ? (
                        <a
                          href={employee.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-indigo-600 hover:text-indigo-700"
                        >
                          {employee.name}
                        </a>
                      ) : (
                        <span className="font-medium text-slate-700">{employee.name}</span>
                      )}
                      <span className="truncate text-slate-400">{employee.designation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {linkedin.warnings.length > 0 && (
              <ul className="space-y-1">
                {linkedin.warnings.map((warning) => (
                  <li key={warning} className="text-xs text-amber-700">
                    {warning}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}
