import { formatEngagementRate, formatNumber } from "@/lib/format";
import type {
  ContentListItem,
  ContentListResponse,
  ContentMediaType,
  ContentPageData,
  ContentPost,
  ContentStatMetric,
} from "@/types/content";

const POST_GRADIENTS = [
  "from-indigo-600 to-purple-700",
  "from-violet-600 to-indigo-700",
  "from-blue-600 to-indigo-600",
  "from-sky-600 to-blue-700",
  "from-purple-600 to-pink-600",
];

function normalizeMediaType(type?: string): ContentMediaType {
  const value = (type || "").toLowerCase();
  if (value.includes("reel") || value === "video") return "reel";
  if (value.includes("carousel")) return "carousel";
  return "image";
}

function mediaTypeLabel(type: ContentMediaType): string {
  if (type === "reel") return "Reels";
  if (type === "carousel") return "Carousel";
  return "Image";
}

function captionTitle(caption?: string): string {
  const line = (caption || "Untitled post").split("\n")[0].trim();
  return line.length > 80 ? `${line.slice(0, 77)}...` : line;
}

function formatPostDate(iso?: string): string {
  if (!iso) return "Unknown date";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Unknown date";
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

function buildDateRange(posts: ContentPost[]): string {
  const timestamps = posts
    .map((post) => post.timestamp)
    .filter(Boolean)
    .map((value) => new Date(value!).getTime())
    .filter((value) => !Number.isNaN(value));

  if (timestamps.length === 0) return "All time";

  const min = new Date(Math.min(...timestamps));
  const max = new Date(Math.max(...timestamps));
  const format = (date: Date) =>
    date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return `${format(min)} – ${format(max)}`;
}

function mapToContentPost(item: ContentListItem, index: number): ContentPost {
  const username = item.username ?? "unknown";
  const type = normalizeMediaType(item.media_type);

  return {
    id: `${username}-${item.id ?? index}`,
    username,
    competitorName: item.competitor_name ?? username,
    handle: `@${username}`,
    caption: item.caption ?? "",
    title: captionTitle(item.caption),
    type,
    typeLabel: mediaTypeLabel(type),
    likes: item.likes ?? 0,
    comments: item.comments ?? 0,
    engagementRate: Number((item.engagement_rate ?? 0).toFixed(2)),
    postedDate: formatPostDate(item.timestamp),
    postedAgo: timeAgo(item.timestamp),
    hashtags: (item.hashtags ?? []).map((tag) =>
      tag.startsWith("#") ? tag : `#${tag}`,
    ),
    mediaUrl: item.media_url ?? undefined,
    thumbnailUrl: item.thumbnail_url ?? undefined,
    permalink: item.permalink,
    gradient: POST_GRADIENTS[index % POST_GRADIENTS.length],
    timestamp: item.timestamp,
  };
}

function buildStats(posts: ContentPost[]): ContentStatMetric[] {
  const total = posts.length;
  const reels = posts.filter((post) => post.type === "reel").length;
  const images = posts.filter((post) => post.type === "image").length;
  const carousels = posts.filter((post) => post.type === "carousel").length;
  const totalEngagement = posts.reduce(
    (sum, post) => sum + post.likes + post.comments,
    0,
  );
  const avgEngagement =
    posts.reduce((sum, post) => sum + post.engagementRate, 0) /
    Math.max(total, 1);

  const pct = (count: number) =>
    total > 0 ? `${Math.round((count / total) * 100)}%` : "0%";

  return [
    {
      id: "total-posts",
      label: "Total Posts",
      value: String(total),
      subtitle: "All competitors",
      icon: "posts",
    },
    {
      id: "reels",
      label: "Reels",
      value: String(reels),
      subtitle: pct(reels),
      icon: "reels",
    },
    {
      id: "images",
      label: "Images",
      value: String(images),
      subtitle: pct(images),
      icon: "images",
    },
    {
      id: "carousels",
      label: "Carousels",
      value: String(carousels),
      subtitle: pct(carousels),
      icon: "carousels",
    },
    {
      id: "total-engagement",
      label: "Total Engagement",
      value: formatNumber(totalEngagement),
      subtitle: "All time",
      icon: "engagement",
    },
    {
      id: "avg-er",
      label: "Avg. Engagement Rate",
      value: formatEngagementRate(avgEngagement),
      subtitle: "Across posts",
      icon: "rate",
    },
  ];
}

export function mapContentListToPage(response: ContentListResponse): ContentPageData {
  const items = response.content ?? [];
  const posts = items
    .map(mapToContentPost)
    .sort(
      (a, b) =>
        new Date(b.timestamp ?? 0).getTime() - new Date(a.timestamp ?? 0).getTime(),
    );

  const companyName = items[0]?.company_name ?? "Content Analysis";

  return {
    company: {
      name: companyName,
      subtitle: "Explore and analyze all content across your competitors",
      logoInitials: companyName.slice(0, 2).toUpperCase(),
    },
    dateRange: buildDateRange(posts),
    stats: buildStats(posts),
    posts,
    analysisCount: response.analysis_count ?? 0,
    totalCount: response.count ?? posts.length,
  };
}
