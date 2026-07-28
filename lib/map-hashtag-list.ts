import { formatNumber } from "@/lib/format";
import type { ContentListItem, ContentListResponse } from "@/types/content";
import type {
  HashtagByAnalysis,
  HashtagCloudItem,
  HashtagCompetitorRef,
  HashtagListResponse,
  HashtagPageData,
  HashtagRow,
  HashtagStatMetric,
} from "@/types/hashtag";
import type { ChartSegment } from "@/types/dashboard";

const CHART_COLORS = ["#6366f1", "#8b5cf6", "#22c55e", "#f59e0b", "#94a3b8"];

function normalizeTag(tag: string): string {
  return tag.trim().replace(/^#/, "").toLowerCase();
}

function displayTag(tag: string): string {
  const normalized = tag.replace(/^#/, "");
  return `#${normalized}`;
}

function buildDateRange(
  byAnalysis: HashtagByAnalysis[],
  content: ContentListItem[],
): string {
  const timestamps = [
    ...byAnalysis.map((item) => item.created_at).filter(Boolean),
    ...content.map((item) => item.timestamp).filter(Boolean),
  ] as string[];

  if (timestamps.length === 0) return "All time";

  const dates = timestamps
    .map((value) => new Date(value).getTime())
    .filter((value) => !Number.isNaN(value));

  const min = new Date(Math.min(...dates));
  const max = new Date(Math.max(...dates));
  const format = (date: Date) =>
    date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return `${format(min)} – ${format(max)}`;
}

function buildCompetitorMap(content: ContentListItem[]): Map<string, HashtagCompetitorRef> {
  const map = new Map<string, HashtagCompetitorRef>();

  for (const item of content) {
    const username = item.username ?? "";
    if (!username || map.has(username)) continue;
    map.set(username, {
      username,
      name: item.competitor_name ?? username,
    });
  }

  return map;
}

function buildTagCompetitors(
  content: ContentListItem[],
  competitorMap: Map<string, HashtagCompetitorRef>,
): Map<string, HashtagCompetitorRef[]> {
  const tagUsers = new Map<string, Map<string, number>>();

  for (const item of content) {
    const username = item.username ?? "";
    if (!username) continue;

    for (const rawTag of item.hashtags ?? []) {
      const tag = rawTag.replace(/^#/, "").toLowerCase();
      if (!tag) continue;
      const users = tagUsers.get(tag) ?? new Map<string, number>();
      users.set(username, (users.get(username) ?? 0) + 1);
      tagUsers.set(tag, users);
    }
  }

  const result = new Map<string, HashtagCompetitorRef[]>();
  for (const [tag, users] of tagUsers.entries()) {
    const sorted = Array.from(users.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([username]) => competitorMap.get(username) ?? { username, name: username });
    result.set(tag, sorted);
  }

  return result;
}

function buildTrendForTag(
  tag: string,
  byAnalysis: HashtagByAnalysis[],
): number[] {
  const sorted = [...byAnalysis].sort(
    (a, b) =>
      new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime(),
  );

  return sorted.map((analysis) => {
    const match = analysis.hashtags?.find(
      (item) => item.tag.replace(/^#/, "").toLowerCase() === tag,
    );
    return match?.count ?? 0;
  });
}

function buildOverviewSegments(
  hashtags: { tag: string; count: number }[],
  totalUses: number,
): ChartSegment[] {
  const top = hashtags.slice(0, 4);
  const topTotal = top.reduce((sum, item) => sum + item.count, 0);
  const others = Math.max(totalUses - topTotal, 0);

  const segments: ChartSegment[] = top.map((item, index) => ({
    label: displayTag(item.tag),
    value: item.count,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));

  if (others > 0) {
    segments.push({
      label: "Others",
      value: others,
      color: CHART_COLORS[4],
    });
  }

  return segments;
}

function cloudSize(count: number, max: number): HashtagCloudItem["size"] {
  const ratio = count / Math.max(max, 1);
  if (ratio >= 0.75) return "xl";
  if (ratio >= 0.5) return "lg";
  if (ratio >= 0.3) return "md";
  if (ratio >= 0.15) return "sm";
  return "xs";
}

function buildCloudTags(hashtags: { tag: string; count: number }[]): HashtagCloudItem[] {
  const top = hashtags.slice(0, 40);
  const max = top[0]?.count ?? 1;

  return top.map((item) => ({
    tag: item.tag,
    displayTag: displayTag(item.tag),
    count: item.count,
    size: cloudSize(item.count, max),
  }));
}

function diversityLabel(topShare: number): { value: string; subtitle: string } {
  if (topShare < 5) return { value: "High", subtitle: "Great variety" };
  if (topShare < 12) return { value: "Medium", subtitle: "Balanced mix" };
  return { value: "Low", subtitle: "Concentrated usage" };
}

function buildStats(
  hashtags: { tag: string; count: number }[],
  totalUnique: number,
  totalUses: number,
): HashtagStatMetric[] {
  const top = hashtags[0];
  const avgPosts = totalUses / Math.max(totalUnique, 1);
  const topShare = top ? (top.count / Math.max(totalUses, 1)) * 100 : 0;
  const diversity = diversityLabel(topShare);

  return [
    {
      id: "unique",
      label: "Total Unique Hashtags",
      value: String(totalUnique),
      subtitle: "Across all competitors",
      icon: "unique",
    },
    {
      id: "uses",
      label: "Total Hashtag Uses",
      value: formatNumber(totalUses),
      subtitle: "In all posts",
      icon: "uses",
    },
    {
      id: "top",
      label: "Top Hashtag",
      value: top ? displayTag(top.tag) : "—",
      subtitle: top ? `Used ${top.count} times` : "No data",
      icon: "top",
    },
    {
      id: "avg",
      label: "Avg. Posts per Hashtag",
      value: avgPosts.toFixed(2),
      subtitle: "Average frequency",
      icon: "avg",
    },
    {
      id: "diversity",
      label: "Hashtag Diversity",
      value: diversity.value,
      subtitle: diversity.subtitle,
      icon: "diversity",
    },
  ];
}

export function mapHashtagListToPage(
  response: HashtagListResponse,
  contentResponse?: ContentListResponse,
): HashtagPageData {
  const hashtags = [...(response.hashtags ?? [])].sort((a, b) => b.count - a.count);
  const totalUnique = response.total_unique ?? hashtags.length;
  const totalUses = hashtags.reduce((sum, item) => sum + item.count, 0);
  const byAnalysis = response.by_analysis ?? [];
  const content = contentResponse?.content ?? [];

  const competitorMap = buildCompetitorMap(content);
  const tagCompetitors = buildTagCompetitors(content, competitorMap);

  const companyName =
    byAnalysis[0]?.company_name ??
    content[0]?.company_name ??
    "Hashtag Analysis";

  const rows: HashtagRow[] = hashtags.map((item, index) => {
    const normalized = normalizeTag(item.tag);
    return {
      rank: index + 1,
      tag: normalized,
      displayTag: displayTag(item.tag),
      frequency: item.count,
      percentOfTotal: totalUses > 0 ? (item.count / totalUses) * 100 : 0,
      trend: buildTrendForTag(normalized, byAnalysis),
      topCompetitors: tagCompetitors.get(normalized) ?? [],
    };
  });

  return {
    company: {
      name: companyName,
      subtitle: "Discover the most used hashtags by your competitors and analyze their impact.",
      logoInitials: companyName.slice(0, 2).toUpperCase(),
    },
    dateRange: buildDateRange(byAnalysis, content),
    stats: buildStats(hashtags, totalUnique, totalUses),
    overviewSegments: buildOverviewSegments(hashtags, totalUses),
    overviewCenterValue: formatNumber(totalUses),
    cloudTags: buildCloudTags(hashtags),
    rows,
    totalUnique,
    totalUses,
  };
}
