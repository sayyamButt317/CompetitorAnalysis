import { DonutChart } from "@/components/charts/DonutChart";
import { LineChart } from "@/components/charts/LineChart";
import { formatEngagementRate, formatNumber } from "@/lib/format";
import type { OverviewInstagramSection } from "@/types/overview";

interface InstagramOverviewCardProps {
  data: OverviewInstagramSection;
}

export function InstagramOverviewCard({ data }: InstagramOverviewCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Instagram Overview</h3>
          <p className="text-xs text-slate-400">
            {data.username ? `@${data.username}` : "Instagram"}
            {data.niche ? ` · ${data.niche.split(".")[0]}` : ""}
          </p>
        </div>
        <span className="rounded-lg bg-pink-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-pink-600">
          Instagram
        </span>
      </div>

      {data.bio && (
        <p className="mb-4 line-clamp-3 text-xs leading-relaxed text-slate-600">{data.bio}</p>
      )}

      <div className="mb-4 grid grid-cols-2 gap-2">
        <MiniStat label="Followers" value={formatNumber(data.followers)} />
        <MiniStat label="Posts" value={String(data.postCount)} />
        <MiniStat label="Eng. Rate" value={formatEngagementRate(data.avgEngagement)} />
        <MiniStat label="Interactions" value={formatNumber(data.totalInteractions)} />
        <MiniStat label="Top Format" value={data.primaryFormat ?? "—"} />
        <MiniStat label="Best Format" value={data.bestFormat ?? "—"} />
        {data.primaryCategory && (
          <MiniStat label="Category" value={data.primaryCategory} />
        )}
        {data.bestFormatEngagement != null && (
          <MiniStat
            label="Best format ER"
            value={formatEngagementRate(data.bestFormatEngagement)}
          />
        )}
      </div>

      {data.postingFrequency && (
        <div className="mb-4 grid grid-cols-2 gap-2">
          {data.postingFrequency.postsPerWeek != null && (
            <MiniStat
              label="Posts / week"
              value={String(data.postingFrequency.postsPerWeek)}
            />
          )}
          {data.postingFrequency.avgDaysBetween != null && (
            <MiniStat
              label="Avg days between"
              value={String(data.postingFrequency.avgDaysBetween)}
            />
          )}
        </div>
      )}

      {data.website && (
        <p className="mb-4 truncate text-xs text-slate-500">
          <span className="font-semibold">Website:</span>{" "}
          <a href={data.website} target="_blank" rel="noreferrer" className="text-sky-700 hover:text-sky-800">
            {data.website}
          </a>
        </p>
      )}

      {data.contentFocus && (
        <p className="mb-4 text-xs leading-relaxed text-slate-500">{data.contentFocus}</p>
      )}

      {data.engagementTrend.length > 1 && (
        <div className="mb-4">
          <p className="mb-2 text-xs font-semibold text-slate-500">Engagement Rate Trend</p>
          <div className="h-28">
            <LineChart data={data.engagementTrend} height={112} />
          </div>
        </div>
      )}

      {data.mediaMix.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-xs font-semibold text-slate-500">Media Mix</p>
          <DonutChart segments={data.mediaMix} centerLabel="Mix" size={120} />
        </div>
      )}

      {data.contentCategories.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-xs font-semibold text-slate-500">Content Categories</p>
          <div className="space-y-1.5">
            {data.contentCategories.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-2 text-xs">
                <span className="truncate text-slate-600">{item.label}</span>
                <span className="font-medium text-slate-700">{item.share}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.captionStyle && (
        <div className="mb-4 grid grid-cols-2 gap-2">
          <MiniStat label="Avg caption" value={String(data.captionStyle.avgLength ?? "—")} />
          <MiniStat label="Emoji posts" value={`${data.captionStyle.emojiPct ?? 0}%`} />
          <MiniStat label="Questions" value={`${data.captionStyle.questionPct ?? 0}%`} />
          <MiniStat label="CTA posts" value={`${data.captionStyle.ctaPct ?? 0}%`} />
        </div>
      )}

      {data.topHashtags.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold text-slate-500">Top Hashtags</p>
          <div className="flex flex-wrap gap-1.5">
            {data.topHashtags.slice(0, 10).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.nicheKeywords.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold text-slate-500">Niche Keywords</p>
          <div className="flex flex-wrap gap-1.5">
            {data.nicheKeywords.slice(0, 10).map((keyword, index) => (
              <span
                key={`${keyword}-${index}`}
                className="rounded-full bg-pink-50 px-2.5 py-1 text-[11px] font-medium text-pink-700"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 truncate text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}
