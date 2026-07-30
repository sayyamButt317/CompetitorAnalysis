import type {
  GlobalTrendsResponse,
  GoogleTrendItem,
  TrendGroupItem,
  TrendRankedItem,
  TrendWebSource,
  TrendsPageData,
} from "@/types/trends";

const PLATFORM_COLORS: Record<string, string> = {
  Instagram: "#6366f1",
  Google: "#4285f4",
  TikTok: "#ec4899",
  YouTube: "#ef4444",
  Web: "#94a3b8",
};

function sparklineFromScores(scores: number[]): number[] {
  if (scores.length === 0) return [1, 2, 3, 4, 5];
  return scores.slice(0, 8).reverse();
}

function formatHashtag(key: string): string {
  return key.startsWith("#") ? key : `#${key}`;
}

function timeAgoFromDate(iso?: string): string {
  if (!iso) return "Recently";
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatSublabel(item: TrendGroupItem): string | undefined {
  if (item.source_count != null && item.source_count > 0) {
    return `${item.source_count} source${item.source_count === 1 ? "" : "s"}`;
  }
  if (item.source) {
    return item.source;
  }
  if (item.geo_label) {
    return item.geo_label;
  }
  return undefined;
}

function mapRankedItems(
  items: TrendGroupItem[],
  formatLabel: (key: string) => string = (key) => key,
  limit = 10,
): TrendRankedItem[] {
  const scores = items.map((item) => item.trend_score ?? item.post_count ?? 0);

  return items.slice(0, limit).map((item, index) => ({
    rank: index + 1,
    label: item.key,
    displayLabel: formatLabel(item.key),
    metric: String(item.post_count ?? item.source_count ?? item.trend_score ?? 0),
    sublabel: formatSublabel(item),
    trendScore: item.trend_score ?? 0,
    sparkline: sparklineFromScores(scores.slice(index, index + 6)),
  }));
}

function mapTrendScores(items: TrendGroupItem[]): TrendRankedItem[] {
  return items.slice(0, 15).map((item, index) => {
    const typeLabel =
      item.group_type === "hashtag"
        ? "Hashtag"
        : item.group_type === "google_trend"
          ? "Google"
          : item.group_type === "reel_format"
            ? "Reel"
            : item.group_type === "topic"
              ? "Topic"
              : item.group_type ?? "Trend";

    return {
      rank: index + 1,
      label: `${typeLabel}-${item.key}`,
      displayLabel:
        item.group_type === "hashtag" ? formatHashtag(item.key) : item.key,
      metric: String(item.trend_score ?? item.traffic_score ?? item.post_count ?? 0),
      sublabel: [typeLabel, item.source ?? item.geo_label].filter(Boolean).join(" · "),
      trendScore: item.trend_score ?? item.traffic_score ?? 0,
      sparkline: sparklineFromScores(
        items.slice(index, index + 6).map((i) => i.trend_score ?? 0),
      ),
    };
  });
}

function categorizeWebSource(name: string): TrendWebSource["category"] {
  const lower = name.toLowerCase();
  if (lower.includes("wikipedia")) return "content";
  if (lower.includes("google trends") || lower.includes("tavily")) return "search";
  if (
    lower.includes("instagram") ||
    lower.includes("tiktok") ||
    lower.includes("youtube")
  ) {
    return "platform";
  }
  if (
    lower.includes("socialbee") ||
    lower.includes("metricool") ||
    lower.includes("hootsuite") ||
    lower.includes("buffer") ||
    lower.includes("sprout") ||
    lower.includes("later") ||
    lower.includes("awario")
  ) {
    return "social_tool";
  }
  return "other";
}

function buildWebSources(
  webSources: string[],
  discovered?: { name?: string; username?: string }[],
): TrendWebSource[] {
  const names = [...webSources];
  for (const entry of discovered ?? []) {
    const name = entry.name ?? entry.username;
    if (name && !names.includes(name)) {
      names.push(name);
    }
  }

  const seen = new Set<string>();
  const unique: TrendWebSource[] = [];

  for (const name of names) {
    if (seen.has(name)) continue;
    seen.add(name);
    unique.push({ name, category: categorizeWebSource(name) });
  }

  return unique;
}

function normalizeSourceName(source: string): string {
  if (source.toLowerCase().includes("google trends")) return "Google Trends";
  return source;
}

function buildTrendSourceBreakdown(items: TrendGroupItem[]) {
  const counts = new Map<string, number>();

  for (const item of items) {
    if (!item.source) continue;
    const name = normalizeSourceName(item.source);
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }

  const total = Array.from(counts.values()).reduce((sum, n) => sum + n, 0) || 1;
  const sourceColors: Record<string, string> = {
    Wikipedia: "#6366f1",
    SocialBee: "#ec4899",
    "Google Trends": "#4285f4",
    Metricool: "#8b5cf6",
    Hootsuite: "#f59e0b",
  };

  return Array.from(counts.entries())
    .sort(([, a], [, b]) => b - a)
    .map(([platform, count]) => ({
      platform,
      percentage: Math.round((count / total) * 100),
      color: sourceColors[platform] ?? "#94a3b8",
    }));
}

function buildTopCountries(googleTrends: GoogleTrendItem[]) {
  const counts = new Map<string, { code: string; name: string; count: number }>();

  for (const trend of googleTrends) {
    const name = trend.geo_label ?? trend.geo ?? "Unknown";
    const code = trend.geo ?? "XX";
    const existing = counts.get(name);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(name, { code, name, count: 1 });
    }
  }

  return Array.from(counts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
    .map((item) => ({
      code: item.code,
      name: item.name,
      trendCount: item.count,
    }));
}

function buildInsights(summary: string): string[] {
  const sentences = summary
    .split(/(?<=[.!])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return sentences.slice(0, 4);
}

function buildRecommendations(
  hashtags: TrendGroupItem[],
  reelFormats: TrendGroupItem[],
  topics: TrendGroupItem[],
): string[] {
  const recs: string[] = [];
  const topTag = hashtags[0];
  const topFormat = reelFormats[0];
  const topTopic = topics[0];

  if (topFormat) {
    recs.push(`Create Reels using the "${topFormat.key}" format while momentum is high.`);
  }
  if (topTag) {
    recs.push(`Test content with ${formatHashtag(topTag.key)} — ${topTag.post_count ?? 0} mentions detected.`);
  }
  if (topTopic) {
    recs.push(`Publish posts around "${topTopic.key}" to align with rising cultural topics.`);
  }
  recs.push("Monitor Google Trends daily for breakout search terms in your target regions.");

  return recs.slice(0, 4);
}

function buildPlatformBreakdown(webSources: string[]) {
  const counts = new Map<string, number>();
  const rules: { key: string; label: string }[] = [
    { key: "instagram", label: "Instagram" },
    { key: "google", label: "Google" },
    { key: "tiktok", label: "TikTok" },
    { key: "youtube", label: "YouTube" },
  ];

  for (const source of webSources) {
    const lower = source.toLowerCase();
    let matched = false;
    for (const rule of rules) {
      if (lower.includes(rule.key)) {
        counts.set(rule.label, (counts.get(rule.label) ?? 0) + 1);
        matched = true;
        break;
      }
    }
    if (!matched) {
      counts.set("Web", (counts.get("Web") ?? 0) + 1);
    }
  }

  const total = Array.from(counts.values()).reduce((sum, n) => sum + n, 0) || 1;

  return Array.from(counts.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)
    .map(([platform, count]) => ({
      platform,
      percentage: Math.round((count / total) * 100),
      color: PLATFORM_COLORS[platform] ?? "#94a3b8",
    }));
}

function buildGoogleCards(googleTrends: GoogleTrendItem[]) {
  return googleTrends.slice(0, 8).map((trend, index) => {
    const news = trend.news_items?.[0];
    return {
      rank: index + 1,
      title: trend.topic ?? trend.key,
      country: trend.geo_label ?? trend.geo ?? "Global",
      countryCode: trend.geo ?? "GL",
      traffic: trend.approx_traffic ?? `${trend.traffic_score ?? 0}`,
      timeAgo: timeAgoFromDate(trend.published_at),
      newsTitle: news?.title,
      newsSource: news?.source,
      newsUrl: news?.url,
    };
  });
}

function buildNewsTimeline(googleTrends: GoogleTrendItem[]) {
  return googleTrends.slice(0, 12).map((trend, index) => {
    const news = trend.news_items?.[0];
    return {
      id: `${trend.key}-${index}`,
      time: trend.published_at
        ? new Date(trend.published_at).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          })
        : "—",
      platform: trend.source?.includes("Google") ? "Google" : "Instagram",
      title: news?.title ?? trend.topic ?? trend.key,
      traffic: trend.approx_traffic ?? "—",
      url: news?.url,
    };
  });
}

export function mapGlobalTrendsToPage(response: GlobalTrendsResponse): TrendsPageData {
  const hashtags = response.trending_hashtags ?? [];
  const topics = response.trending_topics ?? [];
  const reelFormats = response.trending_reel_formats ?? [];
  const googleTrends = response.google_trends ?? [];
  const webSources = response.web_sources ?? [];
  const trendScores = response.trend_scores ?? [];
  const itemsWithSource = [...topics, ...reelFormats, ...googleTrends];

  const hashtagScores = hashtags.map((h) => h.trend_score ?? h.post_count ?? 0);
  const topicScores = topics.map((t) => t.trend_score ?? 0);
  const reelScores = reelFormats.map((r) => r.trend_score ?? 0);
  const googleScores = googleTrends.map((g) => g.traffic_score ?? 0);

  const lastUpdated = response.meta?.timestamp
    ? new Date(response.meta.timestamp).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "Just now";

  return {
    company: { name: "Techtimize", logoInitials: "Tr" },
    lastUpdated,
    summary: response.summary ?? "No trend summary available.",
    sourceCount: response.competitor_count ?? webSources.length,
    stats: [
      {
        id: "hashtags",
        label: "Trending Hashtags",
        value: String(hashtags.length),
        change: `↑ ${hashtags[0]?.post_count ?? 0} top mentions`,
        icon: "hashtags",
        sparkline: sparklineFromScores(hashtagScores),
        accent: "bg-violet-100 text-violet-600",
      },
      {
        id: "topics",
        label: "Trending Topics",
        value: String(topics.length),
        change: `↑ ${topics.length} active topics`,
        icon: "topics",
        sparkline: sparklineFromScores(topicScores),
        accent: "bg-emerald-100 text-emerald-600",
      },
      {
        id: "reels",
        label: "Reel Formats",
        value: String(reelFormats.length),
        change: `↑ ${reelFormats.length} formats tracked`,
        icon: "reels",
        sparkline: sparklineFromScores(reelScores),
        accent: "bg-amber-100 text-amber-600",
      },
      {
        id: "google",
        label: "Google Trends",
        value: String(googleTrends.length),
        change: `↑ ${googleTrends[0]?.approx_traffic ?? "0"} peak traffic`,
        icon: "google",
        sparkline: sparklineFromScores(googleScores),
        accent: "bg-sky-100 text-sky-600",
      },
    ],
    hashtags: mapRankedItems(hashtags, formatHashtag, 10),
    topics: mapRankedItems(topics, (key) => key, 10),
    reelFormats: mapRankedItems(reelFormats, (key) => key, 10),
    allTrendScores: mapTrendScores(trendScores),
    webSources: buildWebSources(webSources, response.discovered_competitors),
    sourceBreakdown: buildTrendSourceBreakdown(itemsWithSource),
    topCountries: buildTopCountries(googleTrends),
    insights: buildInsights(response.summary ?? ""),
    recommendations: buildRecommendations(hashtags, reelFormats, topics),
    googleTrends: buildGoogleCards(googleTrends),
    newsTimeline: buildNewsTimeline(googleTrends),
    platformBreakdown: buildPlatformBreakdown(webSources),
  };
}
