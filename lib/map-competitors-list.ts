import type {
  CompetitorDetailRow,
  CompetitorListItem,
  CompetitorsListResponse,
  CompetitorsPageData,
} from "@/types/competitors";
import type { ChartSegment, CompetitorRow, HashtagItem, StatMetric } from "@/types/dashboard";
import { APP_COMPANY } from "@/lib/app-brand";
import { formatEngagementRate, formatNumber } from "@/lib/format";

const CHART_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#a78bfa",
  "#c4b5fd",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#94a3b8",
];

function dedupeCompetitors(competitors: CompetitorListItem[]): CompetitorListItem[] {
  const map = new Map<string, CompetitorListItem>();

  for (const competitor of competitors) {
    const key = competitor.username ?? "";
    if (!key) continue;

    const existing = map.get(key);
    if (!existing) {
      map.set(key, competitor);
      continue;
    }

    const existingDate = new Date(existing.created_at ?? 0).getTime();
    const nextDate = new Date(competitor.created_at ?? 0).getTime();
    if (nextDate >= existingDate) {
      map.set(key, competitor);
    }
  }

  return Array.from(map.values());
}

function mediaShare(competitor: CompetitorListItem, type: string): string {
  const types = competitor.content_strategy?.media_types ?? [];
  const match = types.find((item) =>
    item.type.toLowerCase().includes(type.toLowerCase()),
  );
  if (match?.share_pct != null) return `${match.share_pct.toFixed(1)}%`;
  const total = types.reduce((sum, item) => sum + item.count, 0) || 1;
  return `${Math.round(((match?.count ?? 0) / total) * 100)}%`;
}

function toSegments(items: { label: string; value: number }[]): ChartSegment[] {
  return items.map((item, index) => ({
    ...item,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));
}

function buildHashtags(competitors: CompetitorListItem[]): HashtagItem[] {
  const counts = new Map<string, number>();

  for (const competitor of competitors) {
    for (const tag of competitor.content_strategy?.top_hashtags ?? []) {
      const normalized = tag.toLowerCase();
      counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
    }
  }

  const sorted = Array.from(counts.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const maxCount = sorted[0]?.[1] ?? 1;

  return sorted.map(([tag, count]) => ({
    tag: tag.startsWith("#") ? tag : `#${tag}`,
    count,
    maxCount,
  }));
}

function buildThemes(competitors: CompetitorListItem[]): ChartSegment[] {
  const totals = new Map<string, number>();

  for (const competitor of competitors) {
    for (const theme of competitor.content_strategy?.themes ?? []) {
      totals.set(theme.theme, (totals.get(theme.theme) ?? 0) + theme.count);
    }
  }

  return toSegments(
    Array.from(totals.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([label, value]) => ({ label, value })),
  );
}

function buildContentTypes(competitors: CompetitorListItem[]): ChartSegment[] {
  const totals = new Map<string, number>();

  for (const competitor of competitors) {
    for (const media of competitor.content_strategy?.media_types ?? []) {
      totals.set(media.type, (totals.get(media.type) ?? 0) + media.count);
    }
  }

  return toSegments(
    Array.from(totals.entries())
      .sort(([, a], [, b]) => b - a)
      .map(([label, value]) => ({ label, value })),
  );
}

function buildInsights(
  competitors: CompetitorListItem[],
  contentTypes: ChartSegment[],
): string[] {
  const insights: string[] = [];
  const sorted = [...competitors].sort(
    (a, b) =>
      (b.content_strategy?.avg_engagement_rate ?? 0) -
      (a.content_strategy?.avg_engagement_rate ?? 0),
  );

  const topFormat = contentTypes[0];
  if (topFormat) {
    insights.push(
      `${topFormat.label} is the most used content format across ${competitors.length} competitors.`,
    );
  }

  const top = sorted[0];
  if (top) {
    const leadLabel = top.username ? `@${top.username}` : (top.name ?? "Top competitor");
    insights.push(
      `${leadLabel} leads with ${formatEngagementRate(top.content_strategy?.avg_engagement_rate)} average engagement.`,
    );
  }

  const reelsUsers = competitors.filter((c) =>
    c.content_strategy?.media_types?.some((m) =>
      m.type.toLowerCase().includes("reel"),
    ),
  ).length;
  if (reelsUsers > 0) {
    insights.push(
      `${reelsUsers} of ${competitors.length} competitors actively publish Reels.`,
    );
  }

  const topCategory = new Map<string, number>();
  for (const c of competitors) {
    const cat = c.content_strategy?.primary_content_category;
    if (cat) topCategory.set(cat, (topCategory.get(cat) ?? 0) + 1);
  }
  const dominantCategory = Array.from(topCategory.entries()).sort(
    ([, a], [, b]) => b - a,
  )[0];
  if (dominantCategory) {
    insights.push(
      `"${dominantCategory[0]}" is the most common primary content category (${dominantCategory[1]} accounts).`,
    );
  }

  const totalPosts = competitors.reduce(
    (sum, c) => sum + (c.post_count ?? c.content_strategy?.post_count ?? 0),
    0,
  );
  insights.push(`Analysis covers ${totalPosts} posts across all competitor accounts.`);

  return insights.slice(0, 5);
}

function computeRelativeEngagement(rate: number, marketAvg: number): number {
  if (marketAvg <= 0) return 0;
  return ((rate - marketAvg) / marketAvg) * 100;
}

export function mapCompetitorsListToPage(
  response: CompetitorsListResponse,
): CompetitorsPageData {
  const unique = dedupeCompetitors(response.competitors ?? []);
  const companyName = unique[0]?.company_name ?? APP_COMPANY.name;

  const ranked = [...unique].sort(
    (a, b) =>
      (b.content_strategy?.avg_engagement_rate ?? 0) -
      (a.content_strategy?.avg_engagement_rate ?? 0),
  );

  const avgEngagement =
    ranked.reduce(
      (sum, c) => sum + (c.content_strategy?.avg_engagement_rate ?? 0),
      0,
    ) / Math.max(ranked.length, 1);

  const totalFollowers = ranked.reduce((sum, c) => sum + (c.followers ?? 0), 0);
  const totalPosts = ranked.reduce(
    (sum, c) => sum + (c.post_count ?? c.content_strategy?.post_count ?? 0),
    0,
  );

  const contentTypes = buildContentTypes(ranked);
  const contentThemes = buildThemes(ranked);

  const stats: StatMetric[] = [
    {
      id: "competitors",
      label: "Competitors Found",
      value: String(ranked.length),
      subtitle: `${response.analysis_count ?? 0} analyses`,
      iconVariant: "competitors",
    },
    {
      id: "posts",
      label: "Posts Analyzed",
      value: String(totalPosts),
      subtitle: "Total Posts",
      iconVariant: "posts",
    },
    {
      id: "engagement",
      label: "Avg. Engagement Rate",
      value: formatEngagementRate(avgEngagement),
      subtitle: "Across Competitors",
      iconVariant: "engagement",
    },
    {
      id: "followers",
      label: "Total Followers",
      value: formatNumber(totalFollowers),
      subtitle: "Combined Reach",
      iconVariant: "calendar",
    },
  ];

  const topCompetitors: CompetitorRow[] = ranked.slice(0, 10).map((c, i) => ({
    rank: i + 1,
    handle: c.username ? `@${c.username}` : (c.name ?? `Competitor ${i + 1}`),
    name: c.name ?? c.username ?? "Unknown",
    followers: c.followers ?? 0,
    avgEngagement: c.content_strategy?.avg_engagement_rate ?? 0,
    posts: c.post_count ?? c.content_strategy?.post_count ?? 0,
    growth: computeRelativeEngagement(
      c.content_strategy?.avg_engagement_rate ?? 0,
      avgEngagement,
    ),
    imageUrl: c.image_url ?? c.profile_picture_url,
  }));

  const competitorDetails: CompetitorDetailRow[] = ranked.map((c, i) => ({
    username: c.username ?? "",
    handle: c.username ? `@${c.username}` : (c.name ?? `Competitor ${i + 1}`),
    name: c.name ?? c.username ?? "Unknown",
    imageUrl: c.image_url ?? c.profile_picture_url,
    followers: c.followers ?? 0,
    posts: c.post_count ?? c.content_strategy?.post_count ?? 0,
    avgEngagement: c.content_strategy?.avg_engagement_rate ?? 0,
    reelsPct: mediaShare(c, "reel"),
    carouselPct: mediaShare(c, "carousel"),
    imagePct: mediaShare(c, "image"),
    videoPct: mediaShare(c, "video"),
    primaryTheme: c.content_strategy?.themes?.[0]?.theme ?? "General",
    primaryFormat: c.content_strategy?.primary_format ?? "—",
    primaryCategory: c.content_strategy?.primary_content_category ?? "—",
    matchScore: (c.match_score ?? 0) * 100,
    profileUrl: c.profile_url,
  }));

  const latestDate = ranked
    .map((c) => c.created_at)
    .filter(Boolean)
    .sort()
    .reverse()[0];

  return {
    company: {
      name: companyName,
      subtitle: `${ranked.length} competitors · Instagram analysis`,
      logoInitials: companyName.slice(0, 2).toUpperCase(),
    },
    lastUpdated: latestDate
      ? new Date(latestDate).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })
      : "Just now",
    stats,
    topCompetitors,
    contentTypes,
    contentThemes,
    hashtags: buildHashtags(ranked),
    trendingTopics: contentThemes.map((item) => item.label),
    competitorDetails,
    aiInsights: buildInsights(ranked, contentTypes),
  };
}
