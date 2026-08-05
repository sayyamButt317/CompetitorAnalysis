import type { OverviewCompanyExtras, OverviewHeroData } from "@/types/overview";

interface OverviewHeroProps {
  data: OverviewHeroData;
  extras?: OverviewCompanyExtras;
}

export function OverviewHero({ data, extras }: OverviewHeroProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm lg:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-lg font-bold text-white shadow-sm">
              {data.initials}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-semibold text-slate-900">{data.name}</h2>
                {data.badge && (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                    {data.badge}
                  </span>
                )}
                {extras?.businessModel && (
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                    {extras.businessModel}
                  </span>
                )}
                {extras?.confidence != null && (
                  <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-700">
                    {Math.round(extras.confidence * 100)}% confidence
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {[data.industry, data.niche].filter(Boolean).join(" · ")}
                {(data.region || data.foundedHint) && (
                  <>
                    {(data.industry || data.niche) && " · "}
                    {data.region}
                    {data.region && data.foundedHint ? " · " : ""}
                    {data.foundedHint}
                  </>
                )}
                {extras?.pricingModel ? ` · ${extras.pricingModel}` : ""}
              </p>
            </div>
          </div>

          {data.description && (
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600">
              {data.description.length > 280
                ? `${data.description.slice(0, 277)}...`
                : data.description}
            </p>
          )}

          {data.valueProposition && (
            <p className="mt-2 max-w-3xl text-sm font-medium leading-relaxed text-indigo-700">
              {data.valueProposition}
            </p>
          )}

          {data.socialLinks.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {data.socialLinks.map((link) => (
                <a
                  key={link.href + link.kind}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                    link.kind === "instagram"
                      ? "border-pink-200 bg-pink-50 text-pink-700 hover:bg-pink-100"
                      : link.kind === "linkedin"
                        ? "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100"
                        : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>

        {data.positioning && (
          <div className="w-full shrink-0 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 lg:max-w-xs">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </span>
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
                Positioning
              </p>
            </div>
            <p className="text-sm leading-relaxed text-slate-700">{data.positioning}</p>
          </div>
        )}
      </div>
    </div>
  );
}
