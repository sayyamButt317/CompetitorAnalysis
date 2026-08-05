import type {
  ApiCompetitorLinkedInProfile,
  ApiCompetitorProfile,
  ApiLinkedInTheme,
  ApiRecommendation,
  ApiSimilarityScore,
  ApiUserLinkedIn,
  CompetitorAnalysisResponse,
} from "@/types/api";
import type {
  CompanyInstagramView,
  CompanyLinkedInView,
  CompanyProfileView,
  CompetitorLinkedInRow,
  CompetitorPostsGroup,
  DashboardData,
  GapAnalysisView,
  RecommendationItem,
  SimilarityRow,
  SocialPost,
  SwotView,
} from "@/types/dashboard";
import { APP_COMPANY } from "@/lib/app-brand";
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
    response.gap_analysis?.dominant_competitor_formats?.map((item) => ({
      type: item.format,
      format: item.format,
      count: item.count,
    })) ??
    [];

  return toSegments(
    raw.map((item) => ({
      label: item.type ?? item.format ?? "Unknown",
      value: item.count,
    })),
  );
}

function buildContentThemes(response: CompetitorAnalysisResponse) {
  const insights = response.market_insights;
  const source =
    insights?.dominant_themes ??
    response.gap_analysis?.dominant_competitor_themes?.map((item) => ({
      theme: item.theme,
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

function buildContentCategories(response: CompetitorAnalysisResponse) {
  const source =
    response.market_insights?.dominant_content_categories ??
    response.market_insights?.content_usage?.category_breakdown ??
    response.gap_analysis?.dominant_competitor_categories?.map((item) => ({
      category: item.category,
      count: item.count,
    })) ??
    [];

  return toSegments(
    source.map((item) => ({
      label: item.category,
      value: item.count,
    })),
  );
}

function normalizePriority(priority?: string): RecommendationItem["priority"] {
  const value = (priority ?? "medium").toLowerCase();
  if (value === "high") return "high";
  if (value === "low") return "low";
  return "medium";
}

function buildRecommendations(response: CompetitorAnalysisResponse): RecommendationItem[] {
  const source: ApiRecommendation[] =
    response.recommendations ??
    response.analysis?.recommendations ??
    [];

  return source
    .filter((item) => item.title)
    .map((item) => ({
      type: item.type ?? "general",
      priority: normalizePriority(item.priority),
      title: item.title ?? "Recommendation",
      detail: item.detail ?? "",
    }));
}

function buildInsights(response: CompetitorAnalysisResponse): string[] {
  const contentUsage = response.market_insights?.content_usage;
  const fromUsage = contentUsage?.insights ?? [];
  const combined: string[] = [];

  if (contentUsage?.summary) combined.push(contentUsage.summary);
  combined.push(...fromUsage);

  if (response.gap_analysis?.summary) combined.push(response.gap_analysis.summary);
  if (response.competitor_intelligence_report?.summary) {
    combined.push(response.competitor_intelligence_report.summary);
  }

  if (combined.length >= 2) {
    return [...new Set(combined)].slice(0, 6);
  }

  const summaryParts = (response.summary ?? "")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  return [...new Set([...combined, ...summaryParts])].slice(0, 6);
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

function buildCompanyProfile(response: CompetitorAnalysisResponse): CompanyProfileView | undefined {
  const profile = response.company_profile;
  const company = response.company;
const dna = response.company_social_analysis?.company_dna;
  const name =
    profile?.name ??
    company?.name ??
    response.analysis?.company?.name ??
    company?.extracted_signals?.name;

  if (!name) return undefined;

  return {
    name,
    industry: profile?.industry ?? response.analysis?.company?.industry,
    niche: profile?.niche ?? response.company_social_analysis?.detected_niche,
    description:
      profile?.description ??
      company?.extracted_signals?.summary ??
      response.analysis?.company?.description,
    positioning:
      profile?.positioning ??
      response.company_social_analysis?.company_dna?.positioning ??
      response.analysis?.company?.positioning,
    valueProposition:
      profile?.value_proposition ??
      response.company_social_analysis?.company_dna?.value_proposition ??
      response.analysis?.company?.value_proposition,
    region:
      profile?.region ??
      response.filters_applied?.region ??
      response.analysis?.company?.region,
    services:
      profile?.services ??
      company?.flagship_services ??
      company?.services ??
      dna?.services ??
      [],
    technologies:
      profile?.technologies ??
      company?.extracted_signals?.technologies ??
      dna?.technologies ??
      [],
    keywords:
      profile?.keywords ??
      company?.extracted_signals?.keywords ??
      dna?.keywords ??
      [],
    targetAudience:
      profile?.target_audience ??
      dna?.target_audience ??
      response.analysis?.company?.target_audience ??
      [],
    instagramUrl:
      profile?.instagram_url ??
      company?.instagram_url ??
      response.company_social_analysis?.social_handles?.instagram_url ??
      undefined,
    linkedinUrl:
      profile?.linkedin_url ??
      company?.linkedin_url ??
      response.company_social_analysis?.social_handles?.linkedin_url ??
      undefined,
    website: profile?.website ?? company?.website ?? undefined,
  };
}

function buildCompanyInstagram(
  response: CompetitorAnalysisResponse,
): CompanyInstagramView | undefined {
  const ig = response.company_social_analysis?.user_instagram;
  if (!ig || ig.skipped) return undefined;

  const analysis = ig.analysis;
  if (!analysis && !ig.username) return undefined;

  return {
    username: analysis?.username ?? ig.username,
    name: analysis?.name,
    bio: analysis?.bio,
    followers: analysis?.followers ?? 0,
    postCount: analysis?.post_count ?? ig.post_count ?? 0,
    avgEngagement: analysis?.avg_engagement_rate ?? 0,
    primaryFormat: analysis?.primary_format,
    primaryCategory: analysis?.primary_content_category,
    niche: analysis?.detected_niche ?? ig.detected_niche,
    topHashtags: (analysis?.top_hashtags ?? []).map((h) =>
      h.tag.startsWith("#") ? h.tag : `#${h.tag}`,
    ),
    mediaMix: toSegments(
      (analysis?.media_mix ?? []).map((item) => ({
        label: item.type ?? item.format ?? "Unknown",
        value: item.count,
      })),
    ),
  };
}

function asThemeList(
  themes?: ApiLinkedInTheme[] | string[] | null,
): { theme: string; count: number }[] {
  if (!themes?.length) return [];
  return themes.map((item) =>
    typeof item === "string"
      ? { theme: item, count: 1 }
      : { theme: item.theme, count: item.count },
  );
}

function collectBusinessSignals(source?: {
  business_signals?: string[];
  hiring?: boolean | null;
  is_hiring?: boolean | null;
  partnerships?: boolean | null;
  funding?: boolean | null;
  awards?: boolean | null;
  product_launches?: boolean | null;
  case_studies?: boolean | null;
  ai_posts?: boolean | null;
  blogs?: boolean | null;
  videos?: boolean | null;
}): string[] {
  if (!source) return [];
  if (source.business_signals?.length) return source.business_signals;

  const flags: [boolean | null | undefined, string][] = [
    [source.hiring ?? source.is_hiring, "hiring"],
    [source.partnerships, "partnerships"],
    [source.funding, "funding"],
    [source.awards, "awards"],
    [source.product_launches, "product launches"],
    [source.case_studies, "case studies"],
    [source.ai_posts, "AI posts"],
    [source.blogs, "blogs"],
    [source.videos, "videos"],
  ];

  return flags.filter(([on]) => Boolean(on)).map(([, label]) => label);
}

function hasLinkedInPayload(source?: ApiUserLinkedIn | ApiCompetitorLinkedInProfile | null): boolean {
  if (!source) return false;
  const user = source as ApiUserLinkedIn;
  return Boolean(
    source.linkedin_url ||
      (source.post_count ?? 0) > 0 ||
      (source.employee_count ?? 0) > 0 ||
      (source.followers ?? 0) > 0 ||
      (source.employees?.length ?? 0) > 0 ||
      (source.content_themes?.length ?? 0) > 0 ||
      (source.business_signals?.length ?? 0) > 0 ||
      (source.specialties?.length ?? 0) > 0 ||
      source.industry ||
      source.hiring ||
      user.is_hiring ||
      user.analysis,
  );
}

function buildCompanyLinkedIn(
  response: CompetitorAnalysisResponse,
): CompanyLinkedInView | undefined {
  const social = response.company_social_analysis?.user_linkedin;
  const analysisUser = response.analysis?.linkedin?.user;
  const reportUser = response.competitor_intelligence_report?.linkedin_analysis?.user;

  // Prefer full social crawl; fall back to analysis/report even when crawl was skipped.
  const primary =
    social && !social.skipped && hasLinkedInPayload(social)
      ? social
      : hasLinkedInPayload(analysisUser)
        ? analysisUser
        : hasLinkedInPayload(reportUser)
          ? reportUser
          : social && hasLinkedInPayload(social)
            ? social
            : undefined;

  if (!primary) return undefined;

  const primaryUser = primary as ApiUserLinkedIn;
  const themes = asThemeList(
    primary.content_themes ?? primaryUser.analysis?.content_themes ?? reportUser?.content_themes,
  );

  const url =
    primary.linkedin_url ??
    social?.linkedin_url ??
    analysisUser?.linkedin_url ??
    response.company?.linkedin_url ??
    response.company_profile?.linkedin_url ??
    response.company_social_analysis?.social_handles?.linkedin_url ??
    undefined;

  const employees = (primary.employees ?? social?.employees ?? reportUser?.employees ?? [])
    .filter((e): e is typeof e & { name: string } => Boolean(e.name))
    .slice(0, 8)
    .map((e) => ({
      name: e.name,
      designation: e.designation ?? "",
      url: e.linkedin_url,
    }));

  const skipped = Boolean(
    (social?.skipped || analysisUser?.skipped || response.meta?.skip_linkedin) &&
      !(social && !social.skipped && hasLinkedInPayload(social)),
  );

  return {
    url: url ?? undefined,
    postCount:
      primary.post_count ??
      primaryUser.analysis?.post_count ??
      reportUser?.post_count ??
      0,
    employeeCount:
      primary.employee_count ??
      primaryUser.analysis?.employee_count ??
      reportUser?.employee_count ??
      employees.length ??
      0,
    followers: primary.followers ?? reportUser?.followers ?? undefined,
    isHiring: Boolean(
      primaryUser.is_hiring ??
        primary.hiring ??
        primaryUser.analysis?.is_hiring ??
        reportUser?.hiring ??
        reportUser?.is_hiring,
    ),
    thoughtLeadershipScore:
      primary.thought_leadership_score ??
      primaryUser.analysis?.thought_leadership_score ??
      reportUser?.thought_leadership_score ??
      0,
    industry: primary.industry ?? reportUser?.industry ?? undefined,
    specialties: primary.specialties ?? reportUser?.specialties ?? [],
    businessSignals: collectBusinessSignals(primary).length
      ? collectBusinessSignals(primary)
      : collectBusinessSignals(reportUser),
    themes,
    employees,
    warnings: [
      ...(primaryUser.warnings ?? []),
      ...(skipped
        ? [
            social?.reason === "serverless_skip_linkedin" || response.meta?.skip_linkedin
              ? "Full LinkedIn crawl was skipped on this run — showing available LinkedIn intelligence."
              : "LinkedIn crawl was partial — showing available LinkedIn intelligence.",
          ]
        : []),
    ],
    skipped,
  };
}

function buildCompetitorLinkedIn(
  response: CompetitorAnalysisResponse,
): CompetitorLinkedInRow[] {
  const fromAnalysis = response.analysis?.linkedin?.competitors ?? [];
  const fromReport =
    response.competitor_intelligence_report?.linkedin_analysis?.competitors ?? [];
  const source = fromAnalysis.length > 0 ? fromAnalysis : fromReport;

  return source
    .map((item): CompetitorLinkedInRow => {
      const themes = asThemeList(item.content_themes);
      return {
        name: item.name ?? "Unknown",
        url: item.linkedin_url ?? undefined,
        followers: item.followers ?? 0,
        employeeCount: item.employee_count ?? item.employees?.length ?? 0,
        postCount: item.post_count ?? 0,
        isHiring: Boolean(item.hiring),
        thoughtLeadershipScore: item.thought_leadership_score ?? 0,
        industry: item.industry ?? undefined,
        businessSignals: collectBusinessSignals(item),
        themes: themes.map((t) => t.theme),
      };
    })
    .filter(
      (row) =>
        row.followers > 0 ||
        row.employeeCount > 0 ||
        row.postCount > 0 ||
        row.businessSignals.length > 0 ||
        row.themes.length > 0 ||
        Boolean(row.url),
    )
    .sort((a, b) => b.followers - a.followers);
}

function buildGapAnalysis(response: CompetitorAnalysisResponse): GapAnalysisView | undefined {
  const gaps = response.gap_analysis;
  const reportGaps = response.competitor_intelligence_report?.gaps;
  if (!gaps && !reportGaps) return undefined;

  return {
    summary: gaps?.summary ?? reportGaps?.summary,
    serviceGaps: gaps?.service_gaps ?? reportGaps?.services ?? [],
    technologyGaps: gaps?.technology_gaps ?? reportGaps?.technologies ?? [],
    keywordGaps: gaps?.keyword_gaps ?? [],
    formats: toSegments(
      (gaps?.dominant_competitor_formats ?? []).map((item) => ({
        label: item.format,
        value: item.count,
      })),
    ),
    themes: toSegments(
      (gaps?.dominant_competitor_themes ?? []).map((item) => ({
        label: item.theme,
        value: item.count,
      })),
    ),
    categories: toSegments(
      (gaps?.dominant_competitor_categories ?? []).map((item) => ({
        label: item.category,
        value: item.count,
      })),
    ),
  };
}

function buildSimilarityScores(response: CompetitorAnalysisResponse): SimilarityRow[] {
  const source: ApiSimilarityScore[] =
    response.similarity_scores ??
    response.competitor_intelligence_report?.similarity_vs_competitors ??
    [];

  return source.map((item) => ({
    name: item.name ?? item.username ?? "Unknown",
    username: item.username ?? undefined,
    website: item.website ?? undefined,
    overall: item.similarity?.overall ?? item.match_score ?? 0,
    services: item.similarity?.services ?? 0,
    technology: item.similarity?.technology ?? 0,
    marketing: item.similarity?.marketing ?? 0,
    content: item.similarity?.content ?? 0,
    location: item.similarity?.location ?? 0,
  }));
}

function buildSwot(response: CompetitorAnalysisResponse): SwotView | undefined {
  const swot = response.analysis?.swot;
  if (!swot) return undefined;

  const hasAny =
    (swot.strengths?.length ?? 0) +
      (swot.weaknesses?.length ?? 0) +
      (swot.opportunities?.length ?? 0) +
      (swot.threats?.length ?? 0) >
    0;

  if (!hasAny) return undefined;

  return {
    strengths: swot.strengths ?? [],
    weaknesses: swot.weaknesses ?? [],
    opportunities: swot.opportunities ?? [],
    threats: swot.threats ?? [],
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
      label: "Match Score",
      values: competitors.map((c) =>
        c.match_score != null ? `${(c.match_score * 100).toFixed(0)}%` : "—",
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

export function mapApiResponseToDashboard(
  response: CompetitorAnalysisResponse,
  request: { company_data: string; region: string },
): DashboardData {
  const competitors = response.competitors ?? [];
  const companyName =
    response.company_profile?.name ??
    response.company?.name ??
    response.company?.extracted_signals?.name ??
    "Your Company";
  const region = capitalize(
    response.filters_applied?.region ??
      response.company_profile?.region ??
      request.region,
  );
  const service =
    response.company?.flagship_services?.[0] ??
    response.company_profile?.flagship_services?.[0] ??
    response.company_profile?.industry ??
    response.company?.extracted_signals?.flagship_services?.[0] ??
    response.company?.services?.[0] ??
    APP_COMPANY.name;

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
  const platforms =
    response.meta?.platforms?.join(", ") ??
    response.meta?.platform ??
    "Instagram";

  return {
    company: {
      name: companyName,
      subtitle: `${companyName} · ${service} · ${region}`,
      logoInitials: initials(companyName),
    },
    lastUpdated: formatTimestamp(response.meta?.timestamp),
    summary: response.summary,
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
        subtitle: platforms,
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
      imageUrl: c.profile_picture_url ?? c.image_url,
      matchScore: c.match_score,
      website: c.website ?? undefined,
    })),
    engagementShare: toSegments(
      ranked.slice(0, 5).map((c, i) => ({
        label: `@${c.username}`,
        value: Math.round((engagementWeights[i] / totalWeight) * 100),
      })),
    ),
    contentTypes: buildContentTypes(response),
    contentThemes: buildContentThemes(response),
    contentCategories: buildContentCategories(response),
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
    companyProfile: buildCompanyProfile(response),
    companyInstagram: buildCompanyInstagram(response),
    companyLinkedIn: buildCompanyLinkedIn(response),
    competitorLinkedIn: buildCompetitorLinkedIn(response),
    recommendations: buildRecommendations(response),
    gapAnalysis: buildGapAnalysis(response),
    similarityScores: buildSimilarityScores(response),
    swot: buildSwot(response),
    discoveryReasoning: response.filters_applied?.reasoning,
  };
}
