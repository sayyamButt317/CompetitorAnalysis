import type {
  ApiCompetitorProfile,
  CompetitorAnalysisResponse,
} from "@/types/api";
import type { DashboardData, CompetitorPostsGroup, SocialPost } from "@/types/dashboard";
import { formatEngagementRate } from "@/lib/format";

const CHART_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#a78bfa",
  "#c4b5fd",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#94a3b8",
  "#e0e7ff",
];

const POST_GRADIENTS = [
  "from-indigo-600 to-purple-700",
  "from-violet-600 to-indigo-700",
  "from-blue-600 to-indigo-600",
  "from-sky-600 to-blue-700",
  "from-purple-600 to-pink-600",
];

function toSegments(
  items: { label: string; value: number }[],
): { label: string; value: number; color: string }[] {
  return items.map((item, i) => ({
    ...item,
    color: CHART_COLORS[i % CHART_COLORS.length],
  }));
}

function formatTimestamp(iso?: string): string {
  if (!iso) return "Just now";
  try {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "Just now";
  }
}

function timeAgo(iso?: string): string {
  if (!iso) return "Recently";
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function normalizeMediaType(type?: string): "reel" | "carousel" | "image" {
  const value = (type || "").toLowerCase();
  if (value.includes("reel") || value === "video") return "reel";
  if (value.includes("carousel")) return "carousel";
  return "image";
}

function captionTitle(caption?: string): string {
  const line = (caption || "Untitled post").split("\n")[0].trim();
  return line.length > 60 ? `${line.slice(0, 57)}...` : line;
}

function postingActivityByDay(
  competitors: ApiCompetitorProfile[],
): { label: string; value: number }[] {
  const counts = [0, 0, 0, 0, 0, 0, 0];
  for (const competitor of competitors) {
    for (const post of competitor.posts ?? []) {
      if (!post.timestamp) continue;
      const day = new Date(post.timestamp).getDay();
      counts[day] += 1;
    }
  }
  return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label, i) => {
    const dayIndex = i === 6 ? 0 : i + 1;
    return { label, value: counts[dayIndex] };
  });
}

function engagementTrendByMonthFixed(
  competitors: ApiCompetitorProfile[],
): { label: string; value: number }[] {
  const buckets: { key: string; label: string; total: number; count: number; time: number }[] = [];

  for (const competitor of competitors) {
    for (const post of competitor.posts ?? []) {
      if (!post.timestamp) continue;
      const date = new Date(post.timestamp);
      const key = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, "0")}`;
      const label = date.toLocaleString("en-US", { month: "short", year: "2-digit" });
      const existing = buckets.find((b) => b.key === key);
      if (existing) {
        existing.total += post.engagement_rate ?? 0;
        existing.count += 1;
      } else {
        buckets.push({
          key,
          label,
          total: post.engagement_rate ?? 0,
          count: 1,
          time: date.getTime(),
        });
      }
    }
  }

  if (buckets.length === 0) {
    const avg =
      competitors.reduce(
        (sum, c) => sum + (c.content_strategy?.avg_engagement_rate ?? 0),
        0,
      ) / Math.max(competitors.length, 1);
    return [{ label: "Now", value: Number(avg.toFixed(2)) }];
  }

  return buckets
    .sort((a, b) => a.time - b.time)
    .map(({ label, total, count }) => ({
      label,
      value: Number((total / count).toFixed(2)),
    }));
}

function buildHashtags(response: CompetitorAnalysisResponse) {
  const summary = response.market_insights?.hashtag_summary ?? [];
  if (summary.length > 0) {
    const maxCount = Math.max(...summary.map((h) => h.post_count ?? 0), 1);
    return summary.map((item) => ({
      tag: item.hashtag.startsWith("#") ? item.hashtag : `#${item.hashtag}`,
      count: item.post_count ?? 0,
      maxCount,
    }));
  }

  const top = response.market_insights?.top_hashtags ?? [];
  const maxCount = Math.max(...top.map((h) => h.count), 1);
  return top.map((item) => ({
    tag: item.tag.startsWith("#") ? item.tag : `#${item.tag}`,
    count: item.count,
    maxCount,
  }));
}

function buildContentTypes(response: CompetitorAnalysisResponse) {
  const insights = response.market_insights;
  const raw =
    insights?.dominant_content_types ??
    insights?.content_usage?.format_breakdown ??
    [];

  const normalized = raw.map((item) => ({
    label: item.type ?? item.format ?? "Unknown",
    value: item.count,
  }));

  return toSegments(normalized);
}

function buildContentThemes(response: CompetitorAnalysisResponse) {
  const insights = response.market_insights;
  const source =
    insights?.dominant_themes ??
    insights?.dominant_content_categories?.map((item) => ({
      theme: item.category,
      count: item.count,
    })) ??
    [];

  return toSegments(
    source.map((item) => ({
      label: item.theme,
      value: item.count,
    })),
  );
}

function buildInsights(response: CompetitorAnalysisResponse): string[] {
  const contentUsage = response.market_insights?.content_usage;
  const fromUsage = contentUsage?.insights ?? [];

  const combined: string[] = [];
  if (contentUsage?.summary) combined.push(contentUsage.summary);
  combined.push(...fromUsage);

  if (combined.length >= 2) {
    return [...new Set(combined)].slice(0, 5);
  }

  const summaryParts = (response.summary ?? "")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  const fallback: string[] = [...combined, ...summaryParts];

  const format = contentUsage?.most_used_format ?? insightsFormat(response);
  if (format) {
    fallback.push(`${format} is the dominant content format across competitors.`);
  }

  if (response.competitor_count) {
    fallback.push(`Analysis covers ${response.competitor_count} competitor accounts.`);
  }
  if (response.post_count) {
    fallback.push(`${response.post_count} posts were analyzed in total.`);
  }

  return [...new Set(fallback)].slice(0, 5);
}

function insightsFormat(response: CompetitorAnalysisResponse): string | undefined {
  return response.market_insights?.content_usage?.most_used_format
    ?? response.market_insights?.dominant_content_types?.[0]?.type;
}

function mapToSocialPost(
  post: {
    id?: string;
    caption?: string;
    media_type?: string;
    media_url?: string | null;
    thumbnail_url?: string | null;
    permalink?: string;
    timestamp?: string;
    likes?: number;
    comments?: number;
    engagement_rate?: number;
    username?: string;
    name?: string;
  },
  index: number,
): SocialPost {
  return {
    id: `${post.username}-${post.id ?? index}`,
    handle: `@${post.username}`,
    name: post.name ?? post.username ?? "Unknown",
    title: captionTitle(post.caption),
    type: normalizeMediaType(post.media_type),
    likes: post.likes ?? 0,
    comments: post.comments ?? 0,
    shares: 0,
    engagementRate: Number((post.engagement_rate ?? 0).toFixed(2)),
    postedAgo: timeAgo(post.timestamp),
    gradient: POST_GRADIENTS[index % POST_GRADIENTS.length],
    mediaUrl: post.media_url ?? undefined,
    thumbnailUrl: post.thumbnail_url ?? undefined,
    permalink: post.permalink,
  };
}

function buildCompetitorPosts(
  competitors: ApiCompetitorProfile[],
): CompetitorPostsGroup[] {
  return competitors
    .map((c, ci) => ({
      handle: `@${c.username}`,
      name: c.name ?? c.username ?? "Unknown",
      posts: [...(c.posts ?? [])]
        .sort((a, b) => (b.engagement_rate ?? 0) - (a.engagement_rate ?? 0))
        .map((post, i) =>
          mapToSocialPost(
            {
              ...post,
              username: c.username,
              name: c.name ?? c.username ?? "Unknown",
            },
            ci * 1000 + i,
          ),
        ),
    }))
    .filter((group) => group.posts.length > 0);
}

function computeRelativeEngagement(rate: number, marketAvg: number): number {
  if (marketAvg <= 0) return 0;
  return ((rate - marketAvg) / marketAvg) * 100;
}

export function mapApiResponseToDashboard(
  response: CompetitorAnalysisResponse,
  request: { company_data: string; region: string },
): DashboardData {
  const competitors = response.competitors ?? [];
  const companyName =
    response.company?.name ??
    response.company?.extracted_signals?.name ??
    "Your Company";
  const region = capitalize(
    response.filters_applied?.region ?? request.region,
  );
  const service =
    response.company?.flagship_services?.[0] ??
    response.company?.extracted_signals?.flagship_services?.[0] ??
    response.company?.services?.[0] ??
    "Competitor Analysis";

  const ranked = [...competitors].sort(
    (a, b) =>
      (b.content_strategy?.avg_engagement_rate ?? 0) -
      (a.content_strategy?.avg_engagement_rate ?? 0),
  );

  const avgEngagement =
    ranked.reduce(
      (sum, c) => sum + (c.content_strategy?.avg_engagement_rate ?? 0),
      0,
    ) / Math.max(ranked.length, 1);

  const engagementWeights = ranked.map((c) => {
    const rate = c.content_strategy?.avg_engagement_rate ?? 0;
    const posts = c.content_strategy?.post_count ?? c.posts?.length ?? 0;
    return rate * Math.max(posts, 1);
  });
  const totalWeight = engagementWeights.reduce((a, b) => a + b, 0) || 1;

  const allPosts = ranked.flatMap((c) =>
    (c.posts ?? []).map((post) => ({
      ...post,
      username: c.username,
      name: c.name ?? c.username ?? "Unknown",
    })),
  );

  const competitorPosts = buildCompetitorPosts(ranked);
  const topPosts = competitorPosts
    .map((group) => group.posts[0])
    .filter((post): post is NonNullable<typeof post> => post != null);

  const matchingMode = response.matching_mode ?? response.filters_applied?.matching_mode;

  return {
    company: {
      name: companyName,
      subtitle: `${companyName} · ${service} · ${region}`,
      logoInitials: initials(companyName),
    },
    lastUpdated: formatTimestamp(response.meta?.timestamp),
    stats: [
      {
        id: "competitors",
        label: "Competitors Found",
        value: String(response.competitor_count ?? ranked.length),
        subtitle: matchingMode ? `${matchingMode} match` : "Accounts",
        iconVariant: "competitors",
      },
      {
        id: "posts",
        label: "Posts Analyzed",
        value: String(response.post_count ?? allPosts.length),
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
        id: "calendar",
        label: "Region",
        value: region,
        subtitle: response.meta?.platform ?? "Instagram",
        iconVariant: "calendar",
      },
    ],
    topCompetitors: ranked.slice(0, 5).map((c, i) => ({
      rank: i + 1,
      handle: `@${c.username}`,
      name: c.name ?? c.username ?? "Unknown",
      followers: c.followers ?? 0,
      avgEngagement: c.content_strategy?.avg_engagement_rate ?? 0,
      posts: c.content_strategy?.post_count ?? c.posts?.length ?? 0,
      growth: computeRelativeEngagement(
        c.content_strategy?.avg_engagement_rate ?? 0,
        avgEngagement,
      ),
    })),
    engagementShare: toSegments(
      ranked.slice(0, 5).map((c, i) => ({
        label: `@${c.username}`,
        value: Math.round((engagementWeights[i] / totalWeight) * 100),
      })),
    ),
    contentTypes: buildContentTypes(response),
    contentThemes: buildContentThemes(response),
    postingActivity: postingActivityByDay(ranked),
    hashtags: buildHashtags(response),
    trendingTopics: (response.market_insights?.topics ?? []).map((t) => t.topic),
    engagementTrend: engagementTrendByMonthFixed(ranked),
    comparisonCompetitors: ranked.slice(0, 5).map((c) => ({
      handle: `@${c.username}`,
      name: c.name ?? c.username ?? "Unknown",
    })),
    comparisonMetrics: buildComparisonMetrics(ranked.slice(0, 5)),
    aiInsights: buildInsights(response),
    topPosts,
    competitorPosts,
  };
}

function buildComparisonMetrics(competitors: ApiCompetitorProfile[]) {
  const mediaPercent = (c: ApiCompetitorProfile, type: string) => {
    const types = c.content_strategy?.media_types ?? [];
    const total = types.reduce((sum, t) => sum + t.count, 0) || 1;
    const match = types.find((t) =>
      (t.type ?? t.format ?? "").toLowerCase().includes(type.toLowerCase()),
    );
    const share = match?.share_pct;
    if (share != null) return `${share.toFixed(1)}%`;
    return `${Math.round(((match?.count ?? 0) / total) * 100)}%`;
  };

  return [
    {
      label: "Followers",
      values: competitors.map((c) =>
        c.followers != null
          ? c.followers >= 1000
            ? `${(c.followers / 1000).toFixed(1)}K`
            : String(c.followers)
          : "—",
      ),
    },
    {
      label: "Posts",
      values: competitors.map(
        (c) => c.content_strategy?.post_count ?? c.posts?.length ?? 0,
      ),
    },
    {
      label: "Avg. Engagement",
      values: competitors.map((c) =>
        formatEngagementRate(c.content_strategy?.avg_engagement_rate),
      ),
    },
    {
      label: "Primary Format",
      values: competitors.map(
        (c) => c.content_strategy?.primary_format ?? "—",
      ),
    },
    {
      label: "Reels %",
      values: competitors.map((c) => mediaPercent(c, "reel")),
    },
    {
      label: "Image %",
      values: competitors.map((c) => mediaPercent(c, "image")),
    },
    {
      label: "Carousel %",
      values: competitors.map((c) => mediaPercent(c, "carousel")),
    },
    {
      label: "Best Format ER",
      values: competitors.map((c) =>
        c.content_strategy?.best_performing_format?.avg_engagement_rate != null
          ? formatEngagementRate(
              c.content_strategy.best_performing_format.avg_engagement_rate,
            )
          : "—",
      ),
    },
  ];
}
