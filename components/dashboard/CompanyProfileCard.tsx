import { Card, CardHeader } from "@/components/ui/Card";
import type { CompanyProfileView } from "@/types/dashboard";

interface CompanyProfileCardProps {
  profile: CompanyProfileView;
  discoveryReasoning?: string;
}

function TagList({ items }: { items: string[] }) {
  if (items.length === 0) return <p className="text-xs text-slate-400">None listed</p>;

  return (
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
  );
}

export function CompanyProfileCard({ profile, discoveryReasoning }: CompanyProfileCardProps) {
  return (
    <Card>
      <CardHeader
        title="Company Profile"
        subtitle={profile.industry ? `${profile.industry}${profile.niche ? ` · ${profile.niche}` : ""}` : undefined}
      />

      <div className="space-y-4">
        {profile.description && (
          <p className="text-sm leading-relaxed text-slate-600">{profile.description}</p>
        )}

        {(profile.positioning || profile.valueProposition) && (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {profile.positioning && (
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Positioning
                </p>
                <p className="text-sm text-slate-700">{profile.positioning}</p>
              </div>
            )}
            {profile.valueProposition && (
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Value Proposition
                </p>
                <p className="text-sm text-slate-700">{profile.valueProposition}</p>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold text-slate-500">Services</p>
            <TagList items={profile.services} />
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold text-slate-500">Technologies</p>
            <TagList items={profile.technologies} />
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold text-slate-500">Keywords</p>
            <TagList items={profile.keywords} />
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold text-slate-500">Target Audience</p>
            <TagList items={profile.targetAudience} />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 text-xs">
          {profile.instagramUrl && (
            <a
              href={profile.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              Instagram →
            </a>
          )}
          {profile.linkedinUrl && (
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              LinkedIn →
            </a>
          )}
          {profile.website && profile.website !== "unknown" && (
            <a
              href={profile.website}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              Website →
            </a>
          )}
          {profile.region && (
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-600">
              Region: {profile.region}
            </span>
          )}
        </div>

        {discoveryReasoning && (
          <p className="rounded-lg border border-amber-100 bg-amber-50/60 px-3 py-2 text-xs leading-relaxed text-amber-900">
            <span className="font-semibold">Discovery: </span>
            {discoveryReasoning}
          </p>
        )}
      </div>
    </Card>
  );
}
