import { APP_COMPANY } from "@/lib/app-brand";
import type { BarChartItem, ChartSegment, HashtagItem } from "@/types/dashboard";
import type {
  CountryGoogleTrends,
  CountryTrendSection,
  GlobalTrendsResponse,
  GoogleTrendItem,
  GoogleTrendRow,
  PlatformId,
  PlatformSection,
  PlatformStatRow,
  PlatformTrendItem,
  PlatformTrendsBundle,
  ReelFormatRow,
  SourceBreakdownItem,
  TrendGroupItem,
  TrendHashtagItem,
  TrendTableRow,
  TrendTopicItem,
  TrendsPageData,
  TrendTab,
} from "@/types/trends";

const EXCLUDED = new Set(["tiktok", "youtube"]);

const PLATFORM: Record<string, { label: string; color: string }> = {
  google: { label: "Google Trends", color: "#4285F4" },
  x: { label: "X", color: "#0ea5e9" },
  reddit: { label: "Reddit", color: "#FF4500" },
  facebook: { label: "Facebook", color: "#1877F2" },
  linkedin: { label: "LinkedIn", color: "#0A66C2" },
  web: { label: "Web Blogs", color: "#6366f1" },
  tavily: { label: "Tavily Search", color: "#8b5cf6" },
};

const GEO: Record<string, string> = {
  US: "United States",
  PK: "Pakistan",
  SA: "Saudi Arabia",
  AE: "UAE",
  GB: "United Kingdom",
};

const SOCIAL_PLATFORMS: PlatformId[] = [
  "reddit",
  "x",
  "facebook",
  "linkedin",
  "web",
  "tavily",
];

const EMPTY_PLATFORM_MSG: Partial<Record<PlatformId, string>> = {
  reddit:
    "No Reddit data in this response. The /today endpoint may only return web + Google Trends.",
  x: "No X data in this response. The /today endpoint may only return web + Google Trends.",
  facebook:
    "No Facebook data in this response. The /today endpoint may only return web + Google Trends.",
  linkedin:
    "No LinkedIn data in this response. The /today endpoint may only return web + Google Trends.",
};

function tag(key: string): string {
  return key.startsWith("#") ? key : `#${key}`;
}

function normPlatform(p?: string): string {
  const k = (p ?? "web").toLowerCase();
  return k === "twitter" ? "x" : k;
}

function labelPlatform(p: string): string {
  return PLATFORM[p]?.label ?? p;
}

function inferPlatformFromSource(source: string): PlatformId {
  const l = source.toLowerCase();
  if (l.includes("reddit")) return "reddit";
  if (l.includes("linkedin")) return "linkedin";
  if (l.includes("facebook")) return "facebook";
  if (l === "x" || l.startsWith("x ") || l.includes("x (")) return "x";
  if (l.includes("google trend")) return "google";
  if (l.includes("tavily")) return "tavily";
  return "web";
}

function createBreakdownEntry(source: string, platform?: string): SourceBreakdownItem {
  return {
    source,
    platform: platform ?? inferPlatformFromSource(source),
    counts: { reel_formats: 0, hashtags: 0, topics: 0, google_trends: 0, total: 0 },
    reel_formats: [],
    hashtags: [],
    topics: [],
    google_trends: [],
  };
}

function bumpCount(entry: SourceBreakdownItem, field: keyof NonNullable<SourceBreakdownItem["counts"]>) {
  if (!entry.counts) entry.counts = { total: 0 };
  entry.counts[field] = (entry.counts[field] ?? 0) + 1;
  entry.counts.total = (entry.counts.total ?? 0) + 1;
}

function buildSyntheticBreakdown(response: GlobalTrendsResponse): SourceBreakdownItem[] {
  const bySource = new Map<string, SourceBreakdownItem>();

  const getEntry = (source: string, platform?: PlatformId) => {
    if (!bySource.has(source)) {
      bySource.set(source, createBreakdownEntry(source, platform));
    }
    const entry = bySource.get(source)!;
    if (platform) entry.platform = platform;
    return entry;
  };

  for (const rf of response.web_trends?.reel_formats ?? []) {
    const entry = getEntry(rf.source ?? "Web Blogs");
    entry.reel_formats!.push({ name: rf.name });
    bumpCount(entry, "reel_formats");
  }

  for (const h of response.web_trends?.hashtags ?? []) {
    const tagValue = h.tag ?? h.hashtag ?? "";
    if (!tagValue) continue;
    const entry = getEntry(h.source ?? "Web Blogs");
    entry.hashtags!.push({ tag: tagValue, post_count: h.post_count });
    bumpCount(entry, "hashtags");
  }

  for (const h of response.hashtags ?? []) {
    const tagValue = h.tag ?? h.hashtag ?? "";
    if (!tagValue) continue;
    const sources = h.sources?.length ? h.sources : [h.source ?? "Web Blogs"];
    for (const src of sources) {
      const entry = getEntry(src);
      entry.hashtags!.push({ tag: tagValue, post_count: h.post_count });
      bumpCount(entry, "hashtags");
    }
  }

  const topicItems: TrendTopicItem[] = [
    ...(response.topics ?? []),
    ...(response.web_trends?.topics ?? []),
  ];
  for (const t of topicItems) {
    const title = t.topic ?? t.key ?? "";
    if (!title) continue;
    const entry = getEntry(t.source ?? "Web Blogs");
    entry.topics!.push({ topic: title });
    bumpCount(entry, "topics");
  }

  const googleItems = resolveGoogleTrends(response);
  for (const g of googleItems) {
    const src = g.source ?? `Google Trends (${g.geo_label ?? g.geo ?? "Global"})`;
    const entry = getEntry(src, "google");
    entry.platform = "google";
    entry.google_trends!.push({ topic: g.topic ?? g.key, geo: g.geo });
    bumpCount(entry, "google_trends");
  }

  for (const src of response.web_sources ?? []) {
    getEntry(src);
  }

  return Array.from(bySource.values());
}

function resolveBreakdown(response: GlobalTrendsResponse): SourceBreakdownItem[] {
  if (response.source_breakdown?.length) return response.source_breakdown;
  if (response.web_trends?.source_breakdown?.length) return response.web_trends.source_breakdown;
  return buildSyntheticBreakdown(response);
}

function resolveCountryTrends(
  response: GlobalTrendsResponse,
): Record<string, CountryGoogleTrends> | undefined {
  return (
    response.google_trends_by_country ??
    response.web_trends?.google_trends_by_country
  );
}

function itemsFromPlatformBundle(bundle: PlatformTrendsBundle): PlatformTrendItem[] {
  const items: PlatformTrendItem[] = [];
  const seen = new Set<string>();

  const add = (item: PlatformTrendItem) => {
    if (seen.has(item.title)) return;
    seen.add(item.title);
    items.push(item);
  };

  for (const t of bundle.topics ?? []) {
    const title = t.topic ?? t.key ?? "";
    if (!title) continue;
    add({
      id: `${bundle.platform}-topic-${title}`,
      title,
      type: "Topic",
      source: t.source ?? bundle.platform,
    });
  }
  for (const h of bundle.hashtags ?? []) {
    const raw = h.tag ?? h.hashtag ?? "";
    if (!raw) continue;
    add({
      id: `${bundle.platform}-hashtag-${raw}`,
      title: tag(raw),
      type: "Hashtag",
      source: h.source ?? bundle.platform,
      metric: h.post_count != null ? `${h.post_count} posts` : undefined,
    });
  }
  for (const rf of bundle.reel_formats ?? []) {
    add({
      id: `${bundle.platform}-format-${rf.name}`,
      title: rf.name,
      type: "Format",
      source: rf.source ?? bundle.platform,
    });
  }

  return items;
}

function enrichPlatformSections(
  sections: PlatformSection[],
  response: GlobalTrendsResponse,
): PlatformSection[] {
  const bundles: Partial<Record<PlatformId, PlatformTrendsBundle>> = {
    reddit: response.reddit_trends,
    x: response.x_trends,
    linkedin: response.linkedin_trends,
  };

  return sections.map((section) => {
    const bundle = bundles[section.id];
    const summary = response.platform_summary?.[section.id as keyof typeof response.platform_summary];

    if (!bundle && !summary) return section;

    const bundleItems = bundle ? itemsFromPlatformBundle(bundle) : [];
    const mergedItems = [...section.items];
    const seen = new Set(mergedItems.map((i) => i.title));
    for (const item of bundleItems) {
      if (!seen.has(item.title)) {
        seen.add(item.title);
        mergedItems.push(item);
      }
    }

    const sourceCount = Math.max(
      section.sourceCount,
      bundle?.source_count ?? 0,
      summary?.source_count ?? 0,
    );
    const totalSignals = Math.max(
      section.totalSignals,
      bundle?.total_items ?? 0,
      summary?.total_items ?? 0,
    );

    return {
      ...section,
      sourceCount,
      totalSignals,
      items: mergedItems.slice(0, 10),
      emptyMessage: mergedItems.length === 0 ? section.emptyMessage : undefined,
    };
  });
}

function normalizeHashtags(response: GlobalTrendsResponse): TrendGroupItem[] {
  if (response.trending_hashtags?.length) return response.trending_hashtags;

  const fromRoot = (response.hashtags ?? []).map(
    (h: TrendHashtagItem): TrendGroupItem => ({
      group_type: "hashtag",
      key: h.tag ?? h.hashtag ?? "",
      post_count: h.post_count,
      source_count: h.source_count,
      source: h.sources?.[0] ?? h.source,
      trend_score: h.post_count,
    }),
  );
  if (fromRoot.length) return fromRoot;

  return (response.web_trends?.hashtags ?? []).map((h) => ({
    group_type: "hashtag",
    key: h.tag ?? h.hashtag ?? "",
    post_count: h.post_count,
    source: h.source,
    trend_score: h.post_count,
  }));
}

function normalizeTopics(response: GlobalTrendsResponse): TrendGroupItem[] {
  if (response.trending_topics?.length) return response.trending_topics;

  const items: TrendTopicItem[] = [
    ...(response.topics ?? []),
    ...(response.web_trends?.topics ?? []),
  ];
  return items.map((t) => ({
    group_type: "topic",
    key: t.topic ?? t.key ?? "",
    source: t.source,
  }));
}

function normalizeTrendScores(response: GlobalTrendsResponse): TrendGroupItem[] {
  const root = response.trend_scores ?? [];
  const web = response.web_trends?.trend_scores ?? [];
  if (!web.length) return root;
  if (!root.length) return web;

  const seen = new Set(root.map((s) => `${s.group_type}-${s.key}-${s.geo ?? ""}`));
  const merged = [...root];
  for (const item of web) {
    const key = `${item.group_type}-${item.key}-${item.geo ?? ""}`;
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(item);
    }
  }
  return merged;
}

function resolveGoogleTrends(response: GlobalTrendsResponse): GoogleTrendItem[] {
  if (response.google_trends?.length) return response.google_trends;
  return response.web_trends?.google_trends ?? [];
}

function typeLabel(group?: string): string {
  switch (group) {
    case "google_trend":
      return "Google Trend";
    case "hashtag":
      return "Hashtag";
    case "topic":
      return "Topic";
    case "reel_format":
      return "Reel Format";
    default:
      return "Trend";
  }
}

function tabForGroup(group?: string): TrendTab {
  switch (group) {
    case "google_trend":
      return "google";
    case "hashtag":
      return "hashtags";
    case "topic":
      return "topics";
    case "reel_format":
      return "reels";
    default:
      return "all";
  }
}

function inferPlatform(item: TrendGroupItem): { label: string; id: PlatformId } {
  if (item.group_type === "google_trend") return { label: "Google Trends", id: "google" };
  if (item.source?.includes("Reddit")) return { label: "Reddit", id: "reddit" };
  if (item.source?.startsWith("X ") || item.source === "X") return { label: "X", id: "x" };
  if (item.source?.includes("Facebook")) return { label: "Facebook", id: "facebook" };
  if (item.source?.includes("LinkedIn")) return { label: "LinkedIn", id: "linkedin" };
  if (item.source?.includes("Tavily")) return { label: "Tavily Search", id: "tavily" };
  if (item.group_type === "hashtag" || item.group_type === "reel_format") {
    return { label: "Web Blogs", id: "web" };
  }
  return { label: item.source?.split(" ")[0] ?? "Web Blogs", id: "web" };
}

function platformTotals(breakdown: SourceBreakdownItem[]): {
  totals: Map<string, number>;
  sourceCounts: Map<string, number>;
} {
  const totals = new Map<string, number>();
  const sourceCounts = new Map<string, number>();

  for (const entry of breakdown) {
    const p = normPlatform(entry.platform);
    if (EXCLUDED.has(p)) continue;
    totals.set(p, (totals.get(p) ?? 0) + (entry.counts?.total ?? 0));
    sourceCounts.set(p, (sourceCounts.get(p) ?? 0) + 1);
  }

  return { totals, sourceCounts };
}

function buildPlatformChart(breakdown: SourceBreakdownItem[]): {
  chart: ChartSegment[];
  stats: PlatformStatRow[];
} {
  const { totals, sourceCounts } = platformTotals(breakdown);
  const sum = Array.from(totals.values()).reduce((a, b) => a + b, 0) || 1;

  const stats = Array.from(totals.entries())
    .sort(([, a], [, b]) => b - a)
    .map(([id, count]) => ({
      id,
      label: labelPlatform(id),
      count,
      sourceCount: sourceCounts.get(id) ?? 0,
      percentage: Math.round((count / sum) * 100),
      color: PLATFORM[id]?.color ?? "#94a3b8",
    }));

  const chart: ChartSegment[] = stats.map((s) => ({
    label: s.label,
    value: s.count,
    color: s.color,
  }));

  return { chart, stats };
}

function buildCountryBars(google: GoogleTrendItem[]): BarChartItem[] {
  const counts = new Map<string, number>();
  for (const t of google) {
    const code = t.geo ?? "GL";
    counts.set(code, (counts.get(code) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([code, value]) => ({
      label: GEO[code] ?? code,
      value,
    }));
}

function buildHashtags(items: TrendGroupItem[]): HashtagItem[] {
  const max = items[0]?.post_count ?? 1;
  return items.slice(0, 10).map((h) => ({
    tag: tag(h.key),
    count: h.post_count ?? 0,
    maxCount: max,
  }));
}

function buildSourceUrlMap(breakdown: SourceBreakdownItem[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const entry of breakdown) {
    if (entry.url) map.set(entry.source, entry.url);
  }
  return map;
}

interface ItemSourceRef {
  source: string;
  url?: string;
}

function buildItemSourceLookup(breakdown: SourceBreakdownItem[]): {
  hashtags: Map<string, ItemSourceRef>;
  topics: Map<string, ItemSourceRef>;
  reels: Map<string, ItemSourceRef>;
} {
  type Best = ItemSourceRef & { weight: number };
  const pickBest = (
    map: Map<string, Best>,
    key: string,
    source: string,
    url: string | undefined,
    weight: number,
  ) => {
    const existing = map.get(key);
    if (!existing || weight > existing.weight) {
      map.set(key, { source, url, weight });
    }
  };

  const hashtags = new Map<string, Best>();
  const topics = new Map<string, Best>();
  const reels = new Map<string, Best>();

  for (const entry of breakdown) {
    for (const h of entry.hashtags ?? []) {
      const key = (h.tag ?? "").toLowerCase();
      if (!key) continue;
      pickBest(hashtags, key, entry.source, entry.url, h.post_count ?? 1);
    }
    for (const t of entry.topics ?? []) {
      const key = (t.topic ?? "").toLowerCase();
      if (!key) continue;
      pickBest(topics, key, entry.source, entry.url, t.upvotes ?? 1);
    }
    for (const rf of entry.reel_formats ?? []) {
      const key = (rf.name ?? "").toLowerCase();
      if (!key) continue;
      pickBest(reels, key, entry.source, entry.url, 1);
    }
  }

  const strip = (map: Map<string, Best>) =>
    new Map([...map.entries()].map(([k, v]) => [k, { source: v.source, url: v.url }]));

  return {
    hashtags: strip(hashtags),
    topics: strip(topics),
    reels: strip(reels),
  };
}

function resolveSourceUrl(
  source: string | undefined,
  map: Map<string, string>,
): string | undefined {
  if (!source) return undefined;
  if (map.has(source)) return map.get(source);
  for (const [key, url] of map.entries()) {
    if (source.startsWith(key) || key.startsWith(source)) return url;
  }
  return undefined;
}

function mapGoogleItem(t: GoogleTrendItem, i: number): GoogleTrendRow {
  const news = t.news_items?.[0];
  return {
    rank: i + 1,
    title: t.topic ?? t.key,
    country: t.geo_label ?? GEO[t.geo ?? ""] ?? t.geo ?? "Global",
    countryCode: t.geo ?? "GL",
    traffic: t.approx_traffic ?? `${t.traffic_score ?? 0}`,
    queryType: t.query_type ?? "trending",
    exploreUrl: t.explore_url,
    newsTitle: news?.title,
    newsUrl: news?.url,
    newsSource: news?.source,
  };
}

function buildCountryTrends(
  byCountry?: Record<string, CountryGoogleTrends>,
): CountryTrendSection[] {
  if (!byCountry) return [];

  return Object.entries(byCountry)
    .map(([code, section]) => ({
      countryCode: code,
      country: section.label ?? GEO[code] ?? code,
      exploreUrl: section.explore_url,
      trendingUrl: section.trending_url,
      topQueries: (section.top_queries ?? []).slice(0, 8).map(mapGoogleItem),
      risingQueries: (section.rising_queries ?? []).slice(0, 8).map(mapGoogleItem),
    }))
    .sort((a, b) => {
      const order = ["PK", "SA", "AE", "US", "GB"];
      return order.indexOf(a.countryCode) - order.indexOf(b.countryCode);
    });
}

function buildTrendRows(
  scores: TrendGroupItem[],
  sourceUrlMap: Map<string, string>,
): TrendTableRow[] {
  return scores.map((item, i) => {
    const news = item.news_items?.[0];
    const platform = inferPlatform(item);
    const sourceName = item.source ?? platform.label;
    const metric =
      item.post_count != null
        ? `${item.post_count} posts`
        : item.approx_traffic
          ? item.approx_traffic
          : item.traffic_score
            ? `${item.traffic_score}+ searches`
            : "—";

    return {
      id: `${item.group_type}-${item.key}-${i}`,
      rank: i + 1,
      title: item.group_type === "hashtag" ? tag(item.key) : item.key,
      type: tabForGroup(item.group_type),
      typeLabel: typeLabel(item.group_type),
      source: sourceName,
      platform: platform.label,
      platformId: platform.id,
      score: item.trend_score ?? item.traffic_score ?? 0,
      metric,
      country: item.geo_label ?? (item.geo ? GEO[item.geo] : undefined),
      url: news?.url ?? item.explore_url,
      sourceUrl: resolveSourceUrl(sourceName, sourceUrlMap),
    };
  });
}

function platformTab(platformId: string): TrendTab {
  if (
    platformId === "reddit" ||
    platformId === "x" ||
    platformId === "facebook" ||
    platformId === "linkedin" ||
    platformId === "web" ||
    platformId === "tavily"
  ) {
    return platformId as TrendTab;
  }
  return "all";
}

function buildPlatformRows(breakdown: SourceBreakdownItem[]): TrendTableRow[] {
  const rows: TrendTableRow[] = [];
  const seen = new Set<string>();
  let rank = 1;

  for (const entry of breakdown) {
    const platformId = normPlatform(entry.platform) as PlatformId;
    if (EXCLUDED.has(platformId)) continue;

    const platformLabel = labelPlatform(platformId);
    const tab = platformTab(platformId);

    const push = (title: string, rowTypeLabel: string, metric: string) => {
      const key = `${platformId}-${title}`;
      if (seen.has(key)) return;
      seen.add(key);
      rows.push({
        id: key,
        rank: rank++,
        title,
        type: tab,
        typeLabel: rowTypeLabel,
        source: entry.source,
        platform: platformLabel,
        platformId,
        score: entry.weight ? Math.round(entry.weight * 100) : 0,
        metric,
        sourceUrl: entry.url,
      });
    };

    for (const rf of entry.reel_formats ?? []) {
      push(rf.name, `${platformLabel} Format`, "format");
    }
    for (const h of entry.hashtags ?? []) {
      push(tag(h.tag), `${platformLabel} Hashtag`, `${h.post_count ?? 0} posts`);
    }
    for (const t of entry.topics ?? []) {
      push(t.topic, `${platformLabel} Topic`, t.upvotes ? `${t.upvotes} upvotes` : "topic");
    }
    for (const g of entry.google_trends ?? []) {
      push(g.topic, `${platformLabel} Search`, g.geo ?? "Global");
    }
  }

  return rows;
}

function buildPlatformSections(breakdown: SourceBreakdownItem[]): PlatformSection[] {
  const grouped = new Map<PlatformId, PlatformTrendItem[]>();
  const totals = new Map<PlatformId, number>();
  const sourceCounts = new Map<PlatformId, number>();

  for (const id of SOCIAL_PLATFORMS) {
    grouped.set(id, []);
    totals.set(id, 0);
    sourceCounts.set(id, 0);
  }

  for (const entry of breakdown) {
    const platformId = normPlatform(entry.platform) as PlatformId;
    if (!grouped.has(platformId)) continue;

    totals.set(platformId, (totals.get(platformId) ?? 0) + (entry.counts?.total ?? 0));
    sourceCounts.set(platformId, (sourceCounts.get(platformId) ?? 0) + 1);

    const items = grouped.get(platformId)!;
    const seen = new Set(items.map((i) => i.title));

    const add = (item: PlatformTrendItem) => {
      if (seen.has(item.title)) return;
      seen.add(item.title);
      items.push(item);
    };

    for (const rf of entry.reel_formats ?? []) {
      add({
        id: `${platformId}-${rf.name}`,
        title: rf.name,
        type: "Format",
        source: entry.source,
        url: entry.url,
      });
    }
    for (const h of entry.hashtags ?? []) {
      add({
        id: `${platformId}-${h.tag}`,
        title: tag(h.tag),
        type: "Hashtag",
        source: entry.source,
        metric: `${h.post_count ?? 0} posts`,
        url: entry.url,
      });
    }
    for (const t of entry.topics ?? []) {
      add({
        id: `${platformId}-${t.topic}`,
        title: t.topic,
        type: "Topic",
        source: entry.source,
        metric: t.upvotes != null ? `${t.upvotes} upvotes` : undefined,
        url: entry.url,
      });
    }
  }

  return SOCIAL_PLATFORMS.map((id) => {
    const items = grouped.get(id) ?? [];
    const count = sourceCounts.get(id) ?? 0;
    return {
      id,
      label: labelPlatform(id),
      color: PLATFORM[id]?.color ?? "#94a3b8",
      sourceCount: count,
      totalSignals: totals.get(id) ?? 0,
      items: items.slice(0, 10),
      emptyMessage:
        items.length === 0
          ? EMPTY_PLATFORM_MSG[id] ??
            (count > 0
              ? `${labelPlatform(id)} sources were scanned but no trend signals were extracted.`
              : `No ${labelPlatform(id)} signals in this crawl.`)
          : undefined,
    };
  });
}

function mergeTrendRows(
  scores: TrendGroupItem[],
  breakdown: SourceBreakdownItem[],
): TrendTableRow[] {
  const sourceUrlMap = buildSourceUrlMap(breakdown);
  const scoreRows = buildTrendRows(scores, sourceUrlMap);
  const platformRows = buildPlatformRows(breakdown);
  const combined = [...scoreRows, ...platformRows];
  return combined.map((row, index) => ({ ...row, rank: index + 1 }));
}

function buildGoogleRows(google: GoogleTrendItem[]): GoogleTrendRow[] {
  return google.slice(0, 15).map(mapGoogleItem);
}

function buildReelRows(
  trending: TrendGroupItem[],
  breakdown: SourceBreakdownItem[],
  webReels: { name: string; source?: string }[],
): ReelFormatRow[] {
  const sourceUrlMap = buildSourceUrlMap(breakdown);
  const seen = new Set<string>();
  const rows: ReelFormatRow[] = [];

  const add = (
    name: string,
    source: string,
    score: number,
    platformId: PlatformId = "web",
  ) => {
    const key = name.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    rows.push({
      rank: rows.length + 1,
      name,
      source,
      sourceUrl: resolveSourceUrl(source, sourceUrlMap),
      platform: labelPlatform(platformId),
      platformId,
      score,
    });
  };

  for (const f of trending) {
    add(f.key, f.source ?? "Web Blogs", f.trend_score ?? 0);
  }

  for (const entry of breakdown) {
    const platformId = normPlatform(entry.platform) as PlatformId;
    if (EXCLUDED.has(platformId)) continue;
    for (const rf of entry.reel_formats ?? []) {
      add(rf.name, entry.source, entry.weight ? Math.round(entry.weight * 100) : 0, platformId);
    }
  }

  for (const rf of webReels) {
    add(rf.name, rf.source ?? "Web Blogs", 0);
  }

  return rows.slice(0, 20).map((row, i) => ({ ...row, rank: i + 1 }));
}

function buildInsights(summary: string): string[] {
  return summary
    .split(/(?<=[.!])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 30)
    .slice(0, 6);
}

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
  if (item.source) return item.source;
  if (item.geo_label) return item.geo_label;
  return undefined;
}

function mapRankedItems(
  items: TrendGroupItem[],
  sourceUrlMap: Map<string, string>,
  formatLabel: (key: string) => string = (key) => key,
  limit = 10,
  defaultTypeLabel?: string,
  itemSourceLookup?: Map<string, ItemSourceRef>,
): import("@/types/trends").TrendRankedItem[] {
  const scores = items.map((item) => item.trend_score ?? item.post_count ?? 0);

  return items.slice(0, limit).map((item, index) => {
    const lookup = itemSourceLookup?.get(item.key.toLowerCase());
    let sourceName = item.source ?? lookup?.source;
    let sourceUrl =
      lookup?.url ?? resolveSourceUrl(sourceName, sourceUrlMap);
    const verifyUrl = item.explore_url ?? item.news_items?.[0]?.url ?? sourceUrl;

    if (!sourceName && item.source_count && item.source_count > 1) {
      sourceName = `${item.source_count} sources`;
    }

    return {
      rank: index + 1,
      label: item.key,
      displayLabel: formatLabel(item.key),
      metric: String(item.post_count ?? item.source_count ?? item.trend_score ?? 0),
      sublabel: formatSublabel(item),
      typeLabel: defaultTypeLabel ?? item.group_type ?? "Trend",
      sourceName,
      sourceUrl,
      verifyUrl,
      trendScore: item.trend_score ?? 0,
      sparkline: sparklineFromScores(scores.slice(index, index + 6)),
    };
  });
}

function mapTrendScores(
  items: TrendGroupItem[],
  sourceUrlMap: Map<string, string>,
): import("@/types/trends").TrendRankedItem[] {
  return items.slice(0, 15).map((item, index) => {
    const typeLabel =
      item.group_type === "hashtag"
        ? "Hashtag"
        : item.group_type === "google_trend"
          ? "Google Trend"
          : item.group_type === "reel_format"
            ? "Reel Format"
            : item.group_type === "topic"
              ? "Topic"
              : item.group_type ?? "Trend";

    const sourceName = item.source ?? item.geo_label;
    const sourceUrl = resolveSourceUrl(sourceName, sourceUrlMap);
    const verifyUrl =
      item.explore_url ?? item.news_items?.[0]?.url ?? sourceUrl;

    return {
      rank: index + 1,
      label: `${typeLabel}-${item.key}-${item.geo ?? item.geo_label ?? index}`,
      displayLabel: item.group_type === "hashtag" ? formatHashtag(item.key) : item.key,
      metric: String(item.trend_score ?? item.traffic_score ?? item.post_count ?? 0),
      sublabel: [typeLabel, sourceName].filter(Boolean).join(" · "),
      typeLabel,
      sourceName,
      sourceUrl,
      verifyUrl,
      trendScore: item.trend_score ?? item.traffic_score ?? 0,
      sparkline: sparklineFromScores(items.slice(index, index + 6).map((i) => i.trend_score ?? 0)),
    };
  });
}

function categorizeWebSource(name: string): import("@/types/trends").TrendWebSource["category"] {
  const lower = name.toLowerCase();
  if (lower.includes("wikipedia")) return "content";
  if (lower.includes("google trends") || lower.includes("tavily")) return "search";
  if (
    lower.includes("reddit") ||
    lower.includes("linkedin") ||
    lower.includes("facebook") ||
    lower === "x" ||
    lower.startsWith("x ") ||
    lower.includes("x (") ||
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
  breakdown: SourceBreakdownItem[],
  discovered?: { name?: string; username?: string }[],
): import("@/types/trends").TrendWebSource[] {
  const urlMap = buildSourceUrlMap(breakdown);
  const names = [...webSources];
  for (const entry of breakdown) {
    if (entry.source && !names.includes(entry.source)) names.push(entry.source);
  }
  for (const entry of discovered ?? []) {
    const name = entry.name ?? entry.username;
    if (name && !names.includes(name)) names.push(name);
  }

  const seen = new Set<string>();
  const unique: import("@/types/trends").TrendWebSource[] = [];
  for (const name of names) {
    if (seen.has(name)) continue;
    seen.add(name);
    unique.push({
      name,
      category: categorizeWebSource(name),
      url: resolveSourceUrl(name, urlMap),
      platform: labelPlatform(inferPlatformFromSource(name)),
    });
  }
  return unique;
}

function normalizeSourceName(source: string): string {
  if (source.toLowerCase().includes("google trends")) return "Google Trends";
  return source;
}

function buildTrendSourceBreakdown(
  items: TrendGroupItem[],
  sourceUrlMap: Map<string, string>,
): import("@/types/trends").TrendPlatformShare[] {
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
    "Google Trends": "#4285F4",
    Metricool: "#8b5cf6",
    Hootsuite: "#f59e0b",
  };

  return Array.from(counts.entries())
    .sort(([, a], [, b]) => b - a)
    .map(([platform, count]) => ({
      platform,
      percentage: Math.round((count / total) * 100),
      color: sourceColors[platform] ?? "#94a3b8",
      url: resolveSourceUrl(platform, sourceUrlMap),
    }));
}

function buildTopCountries(googleTrends: GoogleTrendItem[]): import("@/types/trends").TrendCountryItem[] {
  const counts = new Map<string, { code: string; name: string; count: number }>();
  for (const trend of googleTrends) {
    const name = trend.geo_label ?? trend.geo ?? "Unknown";
    const code = trend.geo ?? "XX";
    const existing = counts.get(name);
    if (existing) existing.count += 1;
    else counts.set(name, { code, name, count: 1 });
  }

  return Array.from(counts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
    .map((item) => ({ code: item.code, name: item.name, trendCount: item.count }));
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

function buildPlatformBreakdown(breakdown: SourceBreakdownItem[]): import("@/types/trends").TrendPlatformShare[] {
  const { totals } = platformTotals(breakdown);
  const sum = Array.from(totals.values()).reduce((a, b) => a + b, 0) || 1;

  return Array.from(totals.entries())
    .sort(([, a], [, b]) => b - a)
    .map(([id, count]) => ({
      platform: labelPlatform(id),
      percentage: Math.round((count / sum) * 100),
      color: PLATFORM[id]?.color ?? "#94a3b8",
    }));
}

function buildGoogleCards(googleTrends: GoogleTrendItem[]): import("@/types/trends").TrendGoogleCard[] {
  return googleTrends.slice(0, 8).map((trend, index) => {
    const news = trend.news_items?.[0];
    return {
      rank: index + 1,
      title: trend.topic ?? trend.key,
      country: trend.geo_label ?? trend.geo ?? "Global",
      countryCode: trend.geo ?? "GL",
      traffic: trend.approx_traffic ?? `${trend.traffic_score ?? 0}`,
      timeAgo: timeAgoFromDate(trend.published_at),
      exploreUrl: trend.explore_url,
      newsTitle: news?.title,
      newsSource: news?.source,
      newsUrl: news?.url,
    };
  });
}

function buildNewsTimeline(googleTrends: GoogleTrendItem[]): import("@/types/trends").TrendNewsEntry[] {
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
      platform: trend.source?.includes("Google") ? "Google" : "Web",
      title: news?.title ?? trend.topic ?? trend.key,
      traffic: trend.approx_traffic ?? "—",
      url: news?.url,
    };
  });
}

function buildLegacyStats(
  hashtags: TrendGroupItem[],
  topics: TrendGroupItem[],
  reelFormats: TrendGroupItem[],
  googleTrends: GoogleTrendItem[],
): import("@/types/trends").TrendStatMetric[] {
  const hashtagScores = hashtags.map((h) => h.trend_score ?? h.post_count ?? 0);
  const topicScores = topics.map((t) => t.trend_score ?? 0);
  const reelScores = reelFormats.map((r) => r.trend_score ?? 0);
  const googleScores = googleTrends.map((g) => g.traffic_score ?? 0);

  return [
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
  ];
}

export function mapGlobalTrendsToPage(response: GlobalTrendsResponse): TrendsPageData {
  const breakdown = resolveBreakdown(response);
  const hashtags = normalizeHashtags(response);
  const topics = normalizeTopics(response);
  const reels = response.trending_reel_formats ?? [];
  const google = resolveGoogleTrends(response);
  const scores = normalizeTrendScores(response);
  const webSources = response.web_sources ?? [];
  const sourceUrlMap = buildSourceUrlMap(breakdown);
  const itemSources = buildItemSourceLookup(breakdown);
  const itemsWithSource = [...topics, ...reels, ...google];

  const sourceCount = response.competitor_count ?? webSources.length;
  const platformSections = enrichPlatformSections(buildPlatformSections(breakdown), response);

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
    company: {
      name: APP_COMPANY.name,
      logoInitials: APP_COMPANY.logoInitials,
      subtitle: `${sourceCount} sources · Google, Reddit, X, Facebook, LinkedIn`,
    },
    lastUpdated,
    summary: response.summary ?? "No trend summary available.",
    sourceCount,
    savedTrendId: response.saved_trend_id,
    stats: buildLegacyStats(hashtags, topics, reels, google),
    hashtags: mapRankedItems(
      hashtags,
      sourceUrlMap,
      formatHashtag,
      10,
      "Hashtag",
      itemSources.hashtags,
    ),
    topics: mapRankedItems(topics, sourceUrlMap, (key) => key, 10, "Topic", itemSources.topics),
    reelFormats: mapRankedItems(
      reels,
      sourceUrlMap,
      (key) => key,
      10,
      "Reel Format",
      itemSources.reels,
    ),
    allTrendScores: mapTrendScores(scores, sourceUrlMap),
    webSources: buildWebSources(
      webSources,
      breakdown,
      response.discovered_competitors as { name?: string; username?: string }[],
    ),
    sourceBreakdown: buildTrendSourceBreakdown(itemsWithSource, sourceUrlMap),
    topCountries: buildTopCountries(google),
    insights: buildInsights(response.summary ?? ""),
    recommendations: buildRecommendations(hashtags, reels, topics),
    googleTrends: buildGoogleCards(google),
    newsTimeline: buildNewsTimeline(google),
    platformBreakdown: buildPlatformBreakdown(breakdown),
    platformSections,
  };
}
