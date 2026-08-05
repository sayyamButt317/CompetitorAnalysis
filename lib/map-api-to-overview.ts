import type {
  ApiCompetitorPost,
  ApiCompetitorProfile,
  ApiSimilarityScore,
  CompetitorAnalysisResponse,
} from "@/types/api";
import type {
  ChartSegment,
  GapAnalysisView,
  RecommendationItem,
  SearchIntelligenceView,
  SimilarityRow,
} from "@/types/dashboard";
import type {
  OverviewCompetitorCard,
  OverviewCompetitorDetail,
  OverviewComparisonRow,
  OverviewCompetitorGaps,
  OverviewContentStrategyIntel,
  OverviewBusinessSignals,
  OverviewAverageSimilarity,
  OverviewCompanyExtras,
  OverviewDnaColumn,
  OverviewInstagramSection,
  OverviewLinkedInSection,
  OverviewMarketInsights,
  OverviewMarketingIntel,
  OverviewMediaPost,
  OverviewMetricCard,
  OverviewPageData,
  OverviewPipelineStatus,
  OverviewPriorityGap,
  OverviewReviewIntel,
  OverviewTechnologyIntel,
  OverviewWebsiteIntelCard,
  OverviewWebsiteSection,
} from "@/types/overview";
import { formatEngagementRate, formatNumber } from "@/lib/format";

const CHART_COLORS = ["#6366f1", "#a78bfa", "#c4b5fd", "#22c55e", "#f59e0b", "#94a3b8", "#ef4444", "#0ea5e9"];

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function truncateList(items: string[], limit: number): { visible: string[]; more?: string } {
  if (items.length <= limit) return { visible: items };
  return {
    visible: items.slice(0, limit),
    more: `+ ${items.length - limit} More`,
  };
}

function thoughtLeadershipLabel(score?: number): string {
  if (score == null) return "—";
  if (score >= 70) return "High";
  if (score >= 30) return "Medium";
  if (score > 0) return "Low";
  return "Emerging";
}

function toSegments(
  items: { label: string; value: number }[],
): ChartSegment[] {
  return items
    .filter((item) => item.value > 0)
    .map((item, index) => ({
      label: item.label,
      value: item.value,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }));
}

function isVideoType(mediaType?: string, permalink?: string): boolean {
  const type = (mediaType ?? "").toLowerCase();
  const link = (permalink ?? "").toLowerCase();
  return (
    type.includes("reel") ||
    type.includes("video") ||
    link.includes("/reel/") ||
    link.includes("/tv/")
  );
}

function captionFrom(post: Record<string, unknown>): string {
  const caption = post.caption ?? post.text;
  if (typeof caption !== "string" || !caption.trim()) return "Untitled post";
  return caption.replace(/\s+/g, " ").trim();
}

function mapMediaPost(
  post: Record<string, unknown> | ApiCompetitorPost,
  index: number,
  owner?: { handle?: string; name?: string },
): OverviewMediaPost {
  const raw = post as Record<string, unknown>;
  const mediaType = String(raw.media_type ?? raw.normalized_media_type ?? "Image");
  const permalink = typeof raw.permalink === "string" ? raw.permalink : undefined;
  const mediaUrl =
    typeof raw.media_url === "string" && raw.media_url ? raw.media_url : undefined;
  const thumbnailUrl =
    typeof raw.thumbnail_url === "string" && raw.thumbnail_url
      ? raw.thumbnail_url
      : undefined;
  const likes =
    typeof raw.likes === "number"
      ? raw.likes
      : typeof raw.like_count === "number"
        ? raw.like_count
        : 0;
  const comments =
    typeof raw.comments === "number"
      ? raw.comments
      : typeof raw.comments_count === "number"
        ? raw.comments_count
        : 0;
  const hashtags = Array.isArray(raw.hashtags)
    ? raw.hashtags.map((tag) => String(tag))
    : [];

  return {
    id: String(raw.id ?? `${owner?.handle ?? "post"}-${index}`),
    caption: captionFrom(raw),
    mediaType,
    isVideo: isVideoType(mediaType, permalink),
    mediaUrl,
    thumbnailUrl,
    permalink,
    likes,
    comments,
    views: typeof raw.views === "number" ? raw.views : undefined,
    engagementRate:
      typeof raw.engagement_rate === "number" ? raw.engagement_rate : undefined,
    hashtags,
    timestamp: typeof raw.timestamp === "string" ? raw.timestamp : undefined,
    ownerHandle: owner?.handle,
    ownerName: owner?.name,
  };
}

function collectCompanyPosts(response: CompetitorAnalysisResponse): OverviewMediaPost[] {
  const sources: unknown[][] = [
    Array.isArray(response.company_analysis?.instagram_posts)
      ? response.company_analysis.instagram_posts
      : [],
    Array.isArray(response.analysis?.instagram?.posts)
      ? (response.analysis.instagram.posts as unknown[])
      : [],
    Array.isArray(
      (response.company_analysis?.user_instagram as { posts?: unknown[] } | undefined)?.posts,
    )
      ? ((response.company_analysis?.user_instagram as { posts?: unknown[] }).posts ?? [])
      : [],
  ];

  const username =
    response.company_social_analysis?.user_instagram?.username ??
    response.company?.instagram_username ??
    undefined;
  const name =
    response.company_profile?.name ??
    response.company?.name ??
    response.company_analysis?.name ??
    "Your Company";

  const seen = new Set<string>();
  const posts: OverviewMediaPost[] = [];

  for (const list of sources) {
    list.forEach((raw, index) => {
      if (!raw || typeof raw !== "object") return;
      const mapped = mapMediaPost(raw as Record<string, unknown>, index, {
        handle: username,
        name,
      });
      const key = mapped.permalink ?? mapped.id;
      if (seen.has(key)) return;
      seen.add(key);
      posts.push(mapped);
    });
  }

  return posts;
}

function opportunityScore(response: CompetitorAnalysisResponse): number {
  const ig = response.company_social_analysis?.user_instagram?.analysis?.avg_engagement_rate ?? 0;
  const employees =
    response.company_social_analysis?.user_linkedin?.employee_count ??
    response.company_social_analysis?.user_linkedin?.analysis?.employee_count ??
    0;
  const services =
    response.company_profile?.services?.length ??
    response.company?.services?.length ??
    0;
  const confidence = response.search_intelligence?.confidence ?? response.company_profile?.confidence ?? 0.5;

  return Math.max(
    40,
    Math.round(
      Math.min(
        100,
        ig * 8 + Math.min(employees, 100) * 0.25 + Math.min(services, 12) * 2 + confidence * 30,
      ),
    ),
  );
}

function buildDna(response: CompetitorAnalysisResponse): OverviewDnaColumn[] {
  const profile = response.company_profile;
  const dna = response.company_social_analysis?.company_dna;
  const analysis = response.company_analysis;
  const swot = response.analysis?.swot;
  const extracted = response.company?.extracted_signals;

  const services =
    profile?.flagship_services ??
    profile?.services ??
    response.company?.flagship_services ??
    dna?.services ??
    analysis?.services ??
    extracted?.services ??
    [];
  const technologies =
    profile?.technologies?.filter((t) => t.length > 1) ??
    extracted?.technologies?.filter((t) => t.length > 1) ??
    dna?.technologies?.filter((t) => t.length > 1) ??
    analysis?.technologies ??
    [];
  const audience =
    profile?.target_audience ??
    dna?.target_audience ??
    analysis?.target_audience ??
    profile?.target_industries ??
    extracted?.target_industries ??
    [];
  const strengths = swot?.strengths ?? [];
  const keywords =
    profile?.keywords ??
    extracted?.keywords ??
    dna?.keywords ??
    analysis?.keywords ??
    [];

  const serviceList = truncateList(services, 8);
  const techList = truncateList(technologies, 10);
  const audienceList = truncateList(audience, 6);
  const strengthList = truncateList(strengths, 6);
  const keywordList = truncateList(keywords, 10);

  return [
    {
      id: "services",
      title: "Services",
      variant: "checklist" as const,
      items: serviceList.visible,
      moreLabel: serviceList.more,
    },
    {
      id: "technologies",
      title: "Technologies",
      variant: "tags" as const,
      items: techList.visible,
      moreLabel: techList.more,
    },
    {
      id: "audience",
      title: "Target Audience",
      variant: "checklist" as const,
      items: audienceList.visible,
      moreLabel: audienceList.more,
    },
    {
      id: "strengths",
      title: "Core Strengths",
      variant: "checklist" as const,
      items: strengthList.visible,
      moreLabel: strengthList.more,
    },
    {
      id: "keywords",
      title: "Keywords",
      variant: "tags" as const,
      items: keywordList.visible,
      moreLabel: keywordList.more,
    },
  ].filter((col) => col.items.length > 0);
}

function buildInstagram(
  response: CompetitorAnalysisResponse,
): OverviewInstagramSection | undefined {
  const ig = response.company_social_analysis?.user_instagram;
  const analysisIg = response.analysis?.instagram?.analysis;
  const analysis = ig?.analysis ?? analysisIg;
  if ((!ig || ig.skipped) && !analysis) return undefined;
  if (!analysis && !ig?.username) return undefined;

  const mediaMix = (analysis?.media_mix ?? []).map((item, index) => ({
    label: item.type ?? item.format ?? "Unknown",
    value: item.count,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));

  const engagement = analysis?.avg_engagement_rate ?? 0;
  const engagementTrend = [
    { label: "W1", value: Number((engagement * 0.72).toFixed(2)) },
    { label: "W2", value: Number((engagement * 0.9).toFixed(2)) },
    { label: "W3", value: Number((engagement * 0.65).toFixed(2)) },
    { label: "W4", value: Number((engagement * 1.05).toFixed(2)) },
    { label: "Now", value: Number(engagement.toFixed(2)) },
  ];

  const caption = analysis?.caption_style as
    | {
        avg_caption_length?: number;
        question_posts_pct?: number;
        cta_posts_pct?: number;
        emoji_posts_pct?: number;
      }
    | undefined;

  return {
    username: analysis?.username ?? ig?.username,
    name: analysis?.name,
    bio: analysis?.bio,
    website: analysis?.website,
    niche: analysis?.detected_niche ?? ig?.detected_niche,
    followers: analysis?.followers ?? 0,
    postCount: analysis?.post_count ?? ig?.post_count ?? 0,
    avgEngagement: engagement,
    totalInteractions: analysis?.total_interactions ?? 0,
    primaryFormat: analysis?.primary_format,
    primaryCategory: analysis?.primary_content_category,
    contentFocus: analysis?.content_focus,
    bestFormat: analysis?.best_performing_format?.format,
    bestFormatEngagement: analysis?.best_performing_format?.avg_engagement_rate,
    postingFrequency: {
      postsPerWeek: analysis?.posting_frequency?.posts_per_week,
      avgDaysBetween: analysis?.posting_frequency?.avg_days_between_posts,
      dateRangeDays: analysis?.posting_frequency?.date_range_days,
    },
    captionStyle: caption
      ? {
          avgLength: caption.avg_caption_length,
          questionPct: caption.question_posts_pct,
          ctaPct: caption.cta_posts_pct,
          emojiPct: caption.emoji_posts_pct,
        }
      : undefined,
    nicheKeywords: analysis?.niche_keywords ?? [],
    contentCategories: (analysis?.content_categories ?? []).map((item) => ({
      label: item.category,
      share: Math.round(item.share_pct ?? 0),
    })),
    engagementTrend,
    mediaMix,
    topHashtags: (analysis?.top_hashtags ?? []).map((h) =>
      h.tag.startsWith("#") ? h.tag : `#${h.tag}`,
    ),
    posts: collectCompanyPosts(response),
  };
}

function buildLinkedIn(
  response: CompetitorAnalysisResponse,
): OverviewLinkedInSection | undefined {
  const li = response.company_social_analysis?.user_linkedin;
  if (!li || li.skipped) return undefined;

  const analysis = li.analysis ?? li.linkedin_analysis;
  const themesRaw = li.content_themes ?? li.linkedin_content_themes ?? analysis?.content_themes ?? [];
  const themeTotal =
    themesRaw.reduce((sum, item) => sum + (typeof item === "object" ? item.count : 1), 0) || 1;

  const employees = (li.employees ?? [])
    .filter((e): e is typeof e & { name: string } => Boolean(e.name))
    .slice(0, 6)
    .map((e) => ({
      name: e.name,
      designation: e.designation ?? "",
      url: e.linkedin_url,
      initials: initials(e.name),
      source: e.source,
    }));

  const employeeCount =
    li.employee_count ??
    analysis?.employee_count ??
    (Array.isArray(li.employees) ? li.employees.length : 0) ??
    0;

  if (!employeeCount && !analysis && employees.length === 0) return undefined;

  const samplePosts = (analysis?.sample_posts ?? [])
    .filter((post): post is { text?: string; linkedin_url?: string; source?: string } =>
      Boolean(post && typeof post === "object"),
    )
    .slice(0, 5)
    .map((post) => ({
      text: (post.text ?? "").replace(/\s+/g, " ").trim().slice(0, 280),
      url: post.linkedin_url,
      source: post.source,
    }))
    .filter((post) => post.text);

  const jobOpenings = (li.job_openings ?? []).slice(0, 6).map((job) => ({
    title: job.job_title ?? "Open role",
    location: job.location ?? undefined,
    url: job.linkedin_url ?? undefined,
    snippet: job.snippet,
  }));

  return {
    url: li.linkedin_url ?? response.company?.linkedin_url ?? undefined,
    employeeCount,
    postCount: li.post_count ?? analysis?.post_count ?? 0,
    avgPostLength: analysis?.avg_post_length,
    isHiring: Boolean(li.is_hiring ?? analysis?.is_hiring ?? analysis?.active_hiring),
    openRoles: analysis?.open_roles ?? analysis?.job_openings_count ?? li.job_count ?? 0,
    thoughtLeadershipLabel: thoughtLeadershipLabel(analysis?.thought_leadership_score ?? 0),
    thoughtLeadershipScore: analysis?.thought_leadership_score ?? 0,
    isThoughtLeader: Boolean(analysis?.is_thought_leader),
    companySize: analysis?.company_size ?? li.company_size ?? undefined,
    positioningFocus: analysis?.positioning_focus ?? [],
    businessSignals: [
      ...(analysis?.b2b_signals ?? []),
      ...(analysis?.signals ?? []),
      ...(li.hiring_signals ?? []).slice(0, 3),
      ...(li.is_hiring || analysis?.is_hiring ? ["Hiring actively"] : []),
    ]
      .map((signal) => (signal.length > 48 ? `${signal.slice(0, 45)}...` : signal))
      .filter((value, index, arr) => arr.indexOf(value) === index)
      .slice(0, 8),
    themes: themesRaw.map((item) => {
      if (typeof item === "string") {
        return { theme: item, count: 1, share: Math.round(100 / themesRaw.length) };
      }
      return {
        theme: item.theme,
        count: item.count,
        share: Math.round((item.count / themeTotal) * 100),
      };
    }),
    employees,
    samplePosts,
    jobOpenings,
    warnings: li.warnings ?? [],
  };
}

function buildWebsite(response: CompetitorAnalysisResponse): OverviewWebsiteSection {
  const profile = response.company_profile;
  const analysis = response.company_analysis;
  const search = response.search_intelligence;
  const services =
    profile?.services ??
    response.company?.services ??
    analysis?.services ??
    [];
  const technologies =
    profile?.technologies?.filter((t) => t.length > 1) ??
    analysis?.technologies ??
    [];
  const keywords = profile?.keywords ?? search?.search_keywords ?? [];
  const confidence = Math.round((search?.confidence ?? profile?.confidence ?? 0) * 100);

  const topPages = (search?.search_queries ?? keywords).slice(0, 5).map((query, index) => ({
    path: query.startsWith("/") ? query : `/${query.replace(/\s+/g, "-").toLowerCase()}`,
    value: Math.max(20, 100 - index * 15),
  }));

  return {
    pagesLabel: String(Math.max(services.length * 2, topPages.length || 4)),
    blogLabel: keywords.some((k) => /blog|content/i.test(k)) ? "Active" : "Limited",
    servicesLabel: String(services.length || "—"),
    ctaLabel: profile?.positioning ? "Present" : "Unknown",
    topPages,
    technologies: technologies.slice(0, 12),
    seoMetrics: [
      {
        label: "Search Confidence",
        value: confidence ? `${confidence}%` : "—",
        score: confidence,
      },
      {
        label: "Keyword Coverage",
        value: String(keywords.length),
        score: Math.min(100, keywords.length * 8),
      },
      {
        label: "Service Pages",
        value: String(services.length),
        score: Math.min(100, services.length * 10),
      },
    ],
    available: Boolean(profile?.website || technologies.length || keywords.length || services.length),
  };
}

function competitorSimilarity(
  competitor: ApiCompetitorProfile,
  scores: SimilarityRow[],
): OverviewCompetitorDetail["similarity"] {
  const fromCompetitor = competitor.similarity;
  const fromScores = scores.find(
    (row) =>
      (competitor.username && row.username === competitor.username) ||
      (competitor.name && row.name === competitor.name),
  );

  return {
    overall: fromCompetitor?.overall ?? fromScores?.overall ?? competitor.match_score ?? 0,
    services: fromCompetitor?.services ?? fromScores?.services ?? 0,
    technology: fromCompetitor?.technology ?? fromScores?.technology ?? 0,
    marketing: fromCompetitor?.marketing ?? fromScores?.marketing ?? 0,
    content: fromCompetitor?.content ?? fromScores?.content ?? 0,
    location: fromCompetitor?.location ?? fromScores?.location ?? 0,
    industry: fromCompetitor?.industry ?? 0,
    pricing: fromCompetitor?.pricing ?? 0,
    explanation: fromCompetitor?.explanation,
  };
}

function buildCompetitorDetails(
  response: CompetitorAnalysisResponse,
  similarityScores: SimilarityRow[],
): OverviewCompetitorDetail[] {
  return (response.competitors ?? []).map((competitor, index) => {
    const ig = competitor.instagram_analysis as
      | {
          post_count?: number;
          avg_engagement_rate?: number;
          primary_format?: string;
          primary_content_category?: string;
          content_focus?: string;
          best_performing_format?: { format?: string; avg_engagement_rate?: number };
          media_mix?: { type?: string; format?: string; count: number }[];
          top_hashtags?: { tag: string; count: number }[];
        }
      | undefined;
    const strategy = competitor.content_strategy;
    const li = competitor.linkedin_analysis as
      | {
          thought_leadership_score?: number;
          content_themes?: { theme: string; count: number }[];
          sample_posts?: { text?: string; linkedin_url?: string }[];
        }
      | undefined;

    const mediaMixSource = strategy?.media_types ?? ig?.media_mix ?? [];
    const posts = (competitor.posts ?? []).map((post, postIndex) =>
      mapMediaPost(post, postIndex, {
        handle: competitor.username,
        name: competitor.name ?? competitor.username,
      }),
    );

    const name = competitor.name ?? competitor.username ?? `Competitor ${index + 1}`;

    return {
      id: `${competitor.username ?? name}-${index}`,
      name,
      username: competitor.username,
      initials: initials(name),
      imageUrl: competitor.profile_picture_url ?? competitor.image_url,
      profileUrl: competitor.profile_url,
      website: competitor.website ?? undefined,
      linkedinUrl: competitor.linkedin_url ?? undefined,
      bio: competitor.bio,
      followers: competitor.followers ?? 0,
      postCount:
        strategy?.post_count ??
        ig?.post_count ??
        competitor.posts?.length ??
        0,
      avgEngagement: strategy?.avg_engagement_rate ?? ig?.avg_engagement_rate ?? 0,
      matchScore: competitor.match_score,
      matchReasons: competitor.match_reasons ?? [],
      regionMatch: Boolean(competitor.region_match),
      nicheMatch: Boolean(competitor.niche_match),
      authenticity: competitor.authenticity,
      primaryFormat: strategy?.primary_format ?? ig?.primary_format,
      primaryCategory: strategy?.primary_content_category ?? ig?.primary_content_category,
      contentFocus: strategy?.content_focus ?? ig?.content_focus,
      bestFormat:
        strategy?.best_performing_format?.format ?? ig?.best_performing_format?.format,
      employeeCount: competitor.employee_count ?? competitor.employees?.length ?? 0,
      isHiring: Boolean(competitor.is_hiring),
      thoughtLeadershipScore: li?.thought_leadership_score ?? 0,
      mediaMix: toSegments(
        mediaMixSource.map((item) => ({
          label: item.type ?? item.format ?? "Unknown",
          value: item.count,
        })),
      ),
      topHashtags: (strategy?.top_hashtags ?? ig?.top_hashtags?.map((h) => h.tag) ?? [])
        .slice(0, 8)
        .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`)),
      contentThemes: (strategy?.themes ?? [])
        .slice(0, 6)
        .map((theme) => theme.theme)
        .filter(Boolean),
      captionStyle: strategy?.caption_style
        ? {
            avgLength:
              typeof strategy.caption_style.avg_caption_length === "number"
                ? strategy.caption_style.avg_caption_length
                : undefined,
            questionPct:
              typeof strategy.caption_style.question_posts_pct === "number"
                ? strategy.caption_style.question_posts_pct
                : undefined,
            ctaPct:
              typeof strategy.caption_style.cta_posts_pct === "number"
                ? strategy.caption_style.cta_posts_pct
                : undefined,
            emojiPct:
              typeof strategy.caption_style.emoji_posts_pct === "number"
                ? strategy.caption_style.emoji_posts_pct
                : undefined,
          }
        : undefined,
      similarity: competitorSimilarity(competitor, similarityScores),
      posts,
      employees: (competitor.employees ?? [])
        .filter((e): e is typeof e & { name: string } => Boolean(e.name))
        .slice(0, 5)
        .map((e) => ({
          name: e.name,
          designation: e.designation ?? "",
          url: e.linkedin_url,
        })),
      linkedinThemes: (li?.content_themes ?? []).slice(0, 5).map((theme) => theme.theme),
      linkedinSamplePosts: (li?.sample_posts ?? [])
        .slice(0, 3)
        .map((post) => ({
          text: (post.text ?? "").replace(/\s+/g, " ").trim().slice(0, 180),
          url: post.linkedin_url,
        }))
        .filter((post) => post.text),
    };
  });
}

function buildCompetitors(response: CompetitorAnalysisResponse): OverviewCompetitorCard[] {
  return buildCompetitorDetails(response, []).slice(0, 5).map((item) => ({
    id: item.id,
    name: item.name,
    initials: item.initials,
    matchPct: item.matchScore != null ? Math.round(item.matchScore * 100) : undefined,
    industry: item.primaryCategory,
    region: response.filters_applied?.region,
    href: item.profileUrl ?? item.website,
    imageUrl: item.imageUrl,
  }));
}

function buildComparison(
  response: CompetitorAnalysisResponse,
  companyIg: OverviewInstagramSection | undefined,
  companyLi: OverviewLinkedInSection | undefined,
  competitors: OverviewCompetitorDetail[],
): { handles: string[]; rows: OverviewComparisonRow[] } {
  const top = competitors.slice(0, 5);
  const handles = top.map((c) => (c.username ? `@${c.username}` : c.name.slice(0, 18)));

  const rows: OverviewComparisonRow[] = [
    {
      label: "Followers",
      you: companyIg ? formatNumber(companyIg.followers) : "—",
      competitors: top.map((c) => formatNumber(c.followers)),
    },
    {
      label: "Avg Engagement",
      you: companyIg ? formatEngagementRate(companyIg.avgEngagement) : "—",
      competitors: top.map((c) => formatEngagementRate(c.avgEngagement)),
    },
    {
      label: "Posts Analyzed",
      you: companyIg ? String(companyIg.postCount) : "—",
      competitors: top.map((c) => String(c.postCount)),
    },
    {
      label: "Primary Format",
      you: companyIg?.primaryFormat ?? "—",
      competitors: top.map((c) => c.primaryFormat ?? "—"),
    },
    {
      label: "Best Format",
      you: companyIg?.bestFormat ?? "—",
      competitors: top.map((c) => c.bestFormat ?? "—"),
    },
    {
      label: "Employees",
      you: companyLi ? formatNumber(companyLi.employeeCount) : "—",
      competitors: top.map((c) => formatNumber(c.employeeCount)),
    },
    {
      label: "Match Score",
      you: "You",
      competitors: top.map((c) =>
        c.matchScore != null ? `${Math.round(c.matchScore * 100)}%` : "—",
      ),
    },
    {
      label: "Similarity",
      you: "100%",
      competitors: top.map((c) => `${Math.round(c.similarity.overall * 100)}%`),
    },
    {
      label: "Hiring",
      you: companyLi?.isHiring ? "Yes" : "No",
      competitors: top.map((c) => (c.isHiring ? "Yes" : "No")),
    },
  ];

  return { handles, rows };
}

function buildSimilarityScores(response: CompetitorAnalysisResponse): SimilarityRow[] {
  const fromReport =
    response.competitor_intelligence_report &&
    "similarity_vs_competitors" in response.competitor_intelligence_report
      ? response.competitor_intelligence_report.similarity_vs_competitors
      : undefined;

  const source: ApiSimilarityScore[] = response.similarity_scores ?? fromReport ?? [];

  if (source.length > 0) {
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

  return (response.competitors ?? []).map((item) => ({
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

function buildGapAnalysis(response: CompetitorAnalysisResponse): GapAnalysisView | undefined {
  const gaps = response.gap_analysis;
  if (!gaps || typeof gaps !== "object" || Array.isArray(gaps) || Object.keys(gaps).length === 0) {
    return undefined;
  }

  const serviceGaps = gaps.service_gaps ?? [];
  const technologyGaps = gaps.technology_gaps ?? [];
  const keywordGaps = gaps.keyword_gaps ?? [];
  const formats = gaps.dominant_competitor_formats ?? [];
  const themes = gaps.dominant_competitor_themes ?? [];
  const categories = gaps.dominant_competitor_categories ?? [];

  if (
    !(
      serviceGaps.length ||
      technologyGaps.length ||
      keywordGaps.length ||
      formats.length ||
      themes.length ||
      categories.length ||
      gaps.summary
    )
  ) {
    return undefined;
  }

  return {
    summary: gaps.summary,
    serviceGaps,
    technologyGaps,
    keywordGaps,
    formats: toSegments(formats.map((item) => ({ label: item.format, value: item.count }))),
    themes: toSegments(themes.map((item) => ({ label: item.theme, value: item.count }))),
    categories: toSegments(
      categories.map((item) => ({ label: item.category, value: item.count })),
    ),
  };
}

function buildRecommendations(response: CompetitorAnalysisResponse): RecommendationItem[] {
  const source =
    response.recommendations ??
    response.analysis?.recommendations ??
    response.ai_report?.recommendations ??
    [];

  return source.slice(0, 12).map((item) => ({
    type: item.type ?? "general",
    title: item.title ?? "Recommendation",
    detail: item.detail ?? "",
    priority: (item.priority as RecommendationItem["priority"]) ?? "medium",
  }));
}

function buildMarketInsights(
  response: CompetitorAnalysisResponse,
): OverviewMarketInsights | undefined {
  const market = response.market_insights;
  if (!market) return undefined;

  const topics = (market.topics ?? []).map((item) => item.topic).filter(Boolean);
  const topHashtags = (market.top_hashtags ?? []).map((item) => ({
    tag: item.tag.startsWith("#") ? item.tag : `#${item.tag}`,
    count: item.count,
  }));
  const formats = market.dominant_content_types ?? market.content_usage?.format_breakdown ?? [];
  const themes = market.dominant_themes ?? [];
  const categories =
    market.dominant_content_categories ?? market.content_usage?.category_breakdown ?? [];

  if (
    !(
      topics.length ||
      topHashtags.length ||
      formats.length ||
      themes.length ||
      categories.length ||
      market.content_usage?.summary
    )
  ) {
    return undefined;
  }

  return {
    topics,
    topHashtags,
    contentSummary: market.content_usage?.summary,
    dominantFormats: toSegments(
      formats.map((item) => ({
        label: item.type ?? item.format ?? "Unknown",
        value: item.count,
      })),
    ),
    dominantThemes: toSegments(themes.map((item) => ({ label: item.theme, value: item.count }))),
    dominantCategories: toSegments(
      categories.map((item) => ({ label: item.category, value: item.count })),
    ),
    insights: market.content_usage?.insights ?? [],
  };
}

function buildSearchIntelligence(
  response: CompetitorAnalysisResponse,
): SearchIntelligenceView | undefined {
  const search = response.search_intelligence;
  if (!search) return undefined;

  return {
    companyName: search.company_name,
    confidence: search.confidence,
    searchKeywords: search.search_keywords ?? [],
    searchQueries: search.search_queries ?? [],
    industryTerms: search.industry_terms ?? [],
    productTerms: search.product_terms ?? [],
    audienceTerms: search.audience_terms ?? [],
    competitorPatterns: search.competitor_patterns ?? [],
    alternativeNames: search.alternative_names ?? [],
    excludedTerms: search.excluded_terms ?? [],
  };
}

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item)).filter(Boolean);
}

function buildPriorityGaps(response: CompetitorAnalysisResponse): OverviewPriorityGap[] {
  const gaps = response.analysis?.gaps ?? [];
  return gaps
    .filter((gap): gap is { item?: string; type?: string; priority?: string } => Boolean(gap?.item))
    .map((gap) => ({
      item: gap.item ?? "",
      type: gap.type ?? "general",
      priority: gap.priority ?? "medium",
    }));
}

function buildAverageSimilarity(
  response: CompetitorAnalysisResponse,
): OverviewAverageSimilarity | undefined {
  const avg =
    response.ai_report?.average_similarity ??
    response.competitor_intelligence_report?.average_similarity ??
    response.analysis?.similarity?.average;

  if (!avg) return undefined;

  return {
    overall: avg.overall ?? 0,
    services: avg.services ?? 0,
    technology: avg.technology ?? 0,
    marketing: avg.marketing ?? 0,
    content: avg.content ?? 0,
    location: avg.location ?? 0,
    industry: avg.industry ?? 0,
    pricing: avg.pricing ?? 0,
    targetAudience: avg.target_audience ?? 0,
  };
}

function buildBusinessSignals(
  response: CompetitorAnalysisResponse,
): OverviewBusinessSignals | undefined {
  const source =
    response.analysis?.business_signals ??
    response.competitor_intelligence_report?.business_signals;
  if (!source || typeof source !== "object") return undefined;

  const record = source as {
    user?: { active_signals?: string[]; signals?: Record<string, boolean> };
    competitors?: { name?: string; active_signals?: string[] }[];
    competitor_only_signals?: string[] | { signal?: string }[];
    market_prevalence?: { signal?: string; count?: number; competitor_count?: number }[];
  };

  const yourSignals =
    record.user?.active_signals ??
    Object.entries(record.user?.signals ?? {})
      .filter(([, active]) => active)
      .map(([key]) => key);

  const competitorOnly = Array.isArray(record.competitor_only_signals)
    ? record.competitor_only_signals.map((item) =>
        typeof item === "string" ? item : String(item.signal ?? ""),
      )
    : [];

  const marketPrevalence = (record.market_prevalence ?? [])
    .map((item) => ({
      signal: String(item.signal ?? ""),
      count: item.count ?? item.competitor_count ?? 0,
    }))
    .filter((item) => item.signal);

  const competitors = (record.competitors ?? []).map((item) => ({
    name: item.name ?? "Competitor",
    activeSignals: item.active_signals ?? [],
  }));

  if (!(yourSignals.length || competitorOnly.length || marketPrevalence.length || competitors.length)) {
    return undefined;
  }

  return {
    yourSignals,
    competitorOnlySignals: competitorOnly.filter(Boolean),
    marketPrevalence,
    competitors,
  };
}

function buildReviewIntel(response: CompetitorAnalysisResponse): OverviewReviewIntel | undefined {
  const source =
    response.analysis?.reviews ??
    response.competitor_intelligence_report?.review_intelligence;
  if (!source || typeof source !== "object") return undefined;

  const record = source as {
    user?: { present_on?: string[]; has_reviews?: boolean; platforms?: Record<string, boolean> };
    gaps?: { platform?: string; competitor_count?: number }[];
    market_presence?: { platform?: string; competitor_count?: number }[];
    competitors?: { name?: string; present_on?: string[] }[];
  };

  const yourPlatforms =
    record.user?.present_on ??
    Object.entries(record.user?.platforms ?? {})
      .filter(([, present]) => present)
      .map(([key]) => key);

  return {
    yourPlatforms,
    hasReviews: Boolean(record.user?.has_reviews),
    gaps: (record.gaps ?? []).map((item) => ({
      platform: item.platform ?? "platform",
      competitorCount: item.competitor_count ?? 0,
    })),
    marketPresence: (record.market_presence ?? []).map((item) => ({
      platform: item.platform ?? "platform",
      competitorCount: item.competitor_count ?? 0,
    })),
    competitors: (record.competitors ?? []).map((item) => ({
      name: item.name ?? "Competitor",
      platforms: item.present_on ?? [],
    })),
  };
}

function buildTechnologyIntel(
  response: CompetitorAnalysisResponse,
): OverviewTechnologyIntel | undefined {
  const tech = response.analysis?.technology;
  if (!tech) return undefined;

  return {
    yourTechnologies: tech.user_technologies ?? [],
    technologyGaps: tech.technology_gaps ?? [],
    technologiesMentioned: tech.technologies_mentioned ?? [],
    competitorTechnologies: (tech as { competitor_technologies?: string[] }).competitor_technologies ?? [],
  };
}

function buildMarketingIntel(
  response: CompetitorAnalysisResponse,
): OverviewMarketingIntel | undefined {
  const marketing = response.analysis?.marketing_strategy;
  if (!marketing) return undefined;

  return {
    channels: marketing.channels ?? [],
    positioning: marketing.positioning,
    valueProposition: marketing.value_proposition,
    targetAudience: marketing.target_audience ?? [],
    audienceTerms: marketing.audience_terms ?? [],
    dominantThemes: (marketing.dominant_market_themes ?? []).map((item) =>
      typeof item === "string"
        ? { theme: item, count: 1 }
        : { theme: item.theme, count: item.count },
    ),
    dominantHashtags: (marketing.dominant_market_hashtags ?? []).map((item) =>
      typeof item === "string"
        ? { tag: item.startsWith("#") ? item : `#${item}`, count: 1 }
        : {
            tag: item.tag.startsWith("#") ? item.tag : `#${item.tag}`,
            count: item.count,
          },
    ),
    marketingSimilarityAvg: marketing.marketing_similarity_avg,
    thoughtLeadershipScore: marketing.thought_leadership_score,
  };
}

function buildContentStrategyIntel(
  response: CompetitorAnalysisResponse,
): OverviewContentStrategyIntel | undefined {
  const content = response.analysis?.content_strategy as
    | {
        content_type_gaps?: { content_type?: string; competitor_count?: number }[];
        user?: {
          linkedin?: { content_themes?: { theme: string }[] };
          instagram?: { top_hashtags?: { tag: string }[] };
        };
        competitor_profiles?: {
          username?: string;
          primary_format?: string;
          primary_content_category?: string;
          avg_engagement_rate?: number;
          post_count?: number;
          top_hashtags?: string[] | { tag: string }[];
        }[];
      }
    | undefined;

  if (!content) return undefined;

  return {
    contentTypeGaps: (content.content_type_gaps ?? []).map((item) => ({
      type: item.content_type ?? "content",
      competitorCount: item.competitor_count ?? 0,
    })),
    yourThemes: (content.user?.linkedin?.content_themes ?? []).map((item) => item.theme),
    yourHashtags: (content.user?.instagram?.top_hashtags ?? []).map((item) =>
      item.tag.startsWith("#") ? item.tag : `#${item.tag}`,
    ),
    competitorProfiles: (content.competitor_profiles ?? []).map((profile) => ({
      username: profile.username,
      primaryFormat: profile.primary_format,
      primaryCategory: profile.primary_content_category,
      avgEngagement: profile.avg_engagement_rate ?? 0,
      postCount: profile.post_count ?? 0,
      topHashtags: (profile.top_hashtags ?? [])
        .map((tag) => (typeof tag === "string" ? tag : tag.tag))
        .slice(0, 6)
        .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`)),
    })),
  };
}

function buildCompetitorGaps(
  response: CompetitorAnalysisResponse,
): OverviewCompetitorGaps | undefined {
  const gaps =
    response.ai_report?.competitor_gaps ??
    response.competitor_intelligence_report?.gaps;
  if (!gaps || typeof gaps !== "object") return undefined;

  const record = gaps as {
    summary?: string;
    services?: string[];
    technologies?: string[];
    content_types?: { content_type?: string; competitor_count?: number }[];
    business_signals?: { signal?: string; competitor_count?: number }[];
    review_platforms?: { platform?: string; competitor_count?: number }[];
    industries_targeted?: { industry?: string; competitor_count?: number }[];
  };

  return {
    summary: record.summary,
    services: record.services ?? [],
    technologies: record.technologies ?? [],
    contentTypes: (record.content_types ?? []).map((item) => ({
      type: item.content_type ?? "content",
      competitorCount: item.competitor_count ?? 0,
    })),
    businessSignals: (record.business_signals ?? []).map((item) => ({
      signal: item.signal ?? "signal",
      competitorCount: item.competitor_count ?? 0,
    })),
    reviewPlatforms: (record.review_platforms ?? []).map((item) => ({
      platform: item.platform ?? "platform",
      competitorCount: item.competitor_count ?? 0,
    })),
    industriesTargeted: (record.industries_targeted ?? []).map((item) => ({
      industry: item.industry ?? "industry",
      competitorCount: item.competitor_count ?? 0,
    })),
  };
}

function buildCompetitorWebsiteIntel(
  response: CompetitorAnalysisResponse,
): OverviewWebsiteIntelCard[] {
  const fromTop = Array.isArray(response.competitor_website_intel)
    ? response.competitor_website_intel
    : [];
  const fromAnalysis = Array.isArray(response.analysis?.website?.competitor_sites)
    ? response.analysis.website.competitor_sites
    : [];

  const source = fromTop.length > 0 ? fromTop : fromAnalysis;

  return source.map((item, index) => {
    const record = (item ?? {}) as {
      name?: string;
      website?: string;
      username?: string;
      intelligence?: Record<string, unknown>;
    };
    const intel = record.intelligence ?? {};

    return {
      id: `${record.username ?? record.name ?? "site"}-${index}`,
      name: record.name ?? String(intel.company_name ?? `Competitor site ${index + 1}`),
      website: record.website ?? (typeof intel.url === "string" ? intel.url : undefined),
      username: record.username,
      companyName: typeof intel.company_name === "string" ? intel.company_name : undefined,
      description: typeof intel.description === "string" ? intel.description : undefined,
      positioning: typeof intel.positioning === "string" ? intel.positioning : undefined,
      businessModel: typeof intel.business_model === "string" ? intel.business_model : undefined,
      pricingModel: typeof intel.pricing_model === "string" ? intel.pricing_model : undefined,
      confidence: typeof intel.confidence === "number" ? intel.confidence : undefined,
      services: asStringList(intel.services).slice(0, 10),
      technologies: asStringList(intel.technologies).slice(0, 10),
      products: asStringList(intel.products).slice(0, 8),
      industries: asStringList(intel.industries).slice(0, 8),
      targetAudience: asStringList(intel.target_audience).slice(0, 8),
      keywords: asStringList(intel.keywords).slice(0, 10),
      features: asStringList(intel.features).slice(0, 8),
      socialLinks: asStringList(intel.social_links).slice(0, 6),
    };
  });
}

function buildPipelineStatus(
  response: CompetitorAnalysisResponse,
): OverviewPipelineStatus | undefined {
  const profile = response.analysis?.user_profile;
  if (!profile) return undefined;

  return {
    companyUnderstood: Boolean(profile.company_understood),
    websiteCrawled: Boolean(profile.website_crawled),
    instagramAnalyzed: Boolean(profile.instagram_analyzed),
    linkedinAnalyzed: Boolean(profile.linkedin_analyzed),
    detectedNiche: profile.detected_niche,
    warnings: profile.warnings ?? [],
    services: profile.services ?? [],
    technologies: profile.technologies ?? [],
  };
}

function buildCompanyExtras(response: CompetitorAnalysisResponse): OverviewCompanyExtras {
  const profile = response.company_profile;
  const analysis = response.company_analysis;
  const signals = profile?.company_signals;

  return {
    businessModel: profile?.business_model ?? analysis?.business_model ?? undefined,
    pricingModel:
      profile?.pricing_model && profile.pricing_model !== "unknown"
        ? profile.pricing_model
        : analysis?.pricing_model && analysis.pricing_model !== "unknown"
          ? analysis.pricing_model
          : undefined,
    confidence: profile?.confidence ?? analysis?.confidence,
    competitorsHint: profile?.competitors_hint ?? analysis?.competitors_hint ?? [],
    targetIndustries: profile?.target_industries ?? signals?.target_industries ?? [],
    countries: profile?.countries ?? analysis?.countries ?? [],
    companySignals: [
      ...(signals?.services ?? []).slice(0, 6),
      ...(signals?.technologies ?? []).slice(0, 4),
    ],
    extractedKeywords: profile?.extracted_keywords ?? signals?.keywords ?? [],
  };
}

function buildRunMeta(
  response: CompetitorAnalysisResponse,
  competitorCount: number,
): OverviewPageData["runMeta"] {
  const meta = response.meta;
  const breakdown = meta?.api_call_breakdown ?? {};

  return {
    matchingMode: response.matching_mode ?? response.filters_applied?.matching_mode,
    region: response.filters_applied?.region,
    competitorLimit: response.filters_applied?.competitor_limit ?? meta?.competitor_limit,
    candidatePoolSize: response.filters_applied?.candidate_pool_size,
    verifiedCount: response.filters_applied?.verified_count,
    discoverySource:
      response.filters_applied?.discovery_source ?? meta?.discovery_source,
    competitorCount: response.competitor_count ?? competitorCount,
    postCount: response.post_count ?? 0,
    analysisId: meta?.analysis_id,
    agentMode: meta?.agent_mode,
    platforms: meta?.platforms ?? [],
    durationSec: meta?.duration_sec,
    skipLinkedIn: meta?.skip_linkedin,
    apiCalls: [
      { label: "Tavily", count: meta?.tavily_calls ?? 0 },
      { label: "Instagram", count: meta?.instagram_calls ?? 0 },
      { label: "LinkedIn", count: meta?.linkedin_calls ?? 0 },
      { label: "Firecrawl", count: meta?.firecrawl_calls ?? 0 },
    ].filter((item) => item.count > 0),
    callBreakdown: Object.entries(breakdown).map(([label, count]) => ({
      label: label.replace(/_/g, " "),
      count: typeof count === "number" ? count : 0,
    })),
  };
}

function buildMetrics(
  response: CompetitorAnalysisResponse,
  instagram: OverviewInstagramSection | undefined,
  linkedin: OverviewLinkedInSection | undefined,
  competitors: OverviewCompetitorCard[],
): OverviewMetricCard[] {
  const score = opportunityScore(response);
  return [
    {
      id: "followers",
      label: "Instagram Followers",
      value: instagram ? formatNumber(instagram.followers) : "—",
      hint: instagram ? "Instagram audience" : "No Instagram data",
      accent: "indigo",
    },
    {
      id: "employees",
      label: "Employees (LinkedIn)",
      value: linkedin ? formatNumber(linkedin.employeeCount) : "—",
      hint: linkedin?.isHiring ? "Hiring signals detected" : "LinkedIn headcount",
      accent: "sky",
    },
    {
      id: "competitors",
      label: "Top Competitors",
      value: String(response.competitor_count || competitors.length || 0),
      hint: "Analyzed",
      accent: "amber",
    },
    {
      id: "opportunity",
      label: "Opportunity Score",
      value: `${score}/100`,
      hint: score >= 80 ? "Excellent" : score >= 60 ? "Strong" : "Developing",
      trendPositive: score >= 60,
      accent: "emerald",
    },
  ];
}

export function mapApiResponseToOverview(
  response: CompetitorAnalysisResponse,
): OverviewPageData {
  const profile = response.company_profile;
  const company = response.company;
  const analysis = response.company_analysis;
  const name =
    profile?.name ??
    company?.name ??
    analysis?.name ??
    company?.extracted_signals?.name ??
    "Your Company";

  const description =
    profile?.description ??
    profile?.profile ??
    company?.extracted_signals?.summary ??
    analysis?.description ??
    response.summary;

  const socialLinks = [
    profile?.instagram_url ||
    company?.instagram_url ||
    response.company_social_analysis?.social_handles?.instagram_url
      ? {
          label: `@${
            profile?.instagram_username ||
            company?.instagram_username ||
            response.company_social_analysis?.social_handles?.instagram_username ||
            "instagram"
          }`,
          href:
            profile?.instagram_url ||
            company?.instagram_url ||
            response.company_social_analysis?.social_handles?.instagram_url ||
            "#",
          kind: "instagram" as const,
        }
      : null,
    profile?.linkedin_url ||
    company?.linkedin_url ||
    response.company_social_analysis?.social_handles?.linkedin_url
      ? {
          label: "LinkedIn",
          href:
            profile?.linkedin_url ||
            company?.linkedin_url ||
            response.company_social_analysis?.social_handles?.linkedin_url ||
            "#",
          kind: "linkedin" as const,
        }
      : null,
    profile?.website && profile.website !== "unknown"
      ? {
          label: "Website",
          href: profile.website,
          kind: "website" as const,
        }
      : null,
  ].filter(Boolean) as OverviewPageData["hero"]["socialLinks"];

  const instagram = buildInstagram(response);
  const linkedin = buildLinkedIn(response);
  const similarityScores = buildSimilarityScores(response);
  const competitors = buildCompetitorDetails(response, similarityScores);
  const topCompetitors = buildCompetitors(response);
  const comparison = buildComparison(response, instagram, linkedin, competitors);

  return {
    hero: {
      name,
      initials: initials(name),
      badge: profile?.niche ?? profile?.category ?? analysis?.niche ?? undefined,
      industry: profile?.industry ?? analysis?.industry ?? undefined,
      niche: profile?.category ?? analysis?.category ?? undefined,
      region: profile?.region ?? response.filters_applied?.region ?? analysis?.region ?? undefined,
      foundedHint: description?.includes("2023") ? "Founded 2023" : undefined,
      description,
      positioning:
        profile?.positioning ??
        response.company_social_analysis?.company_dna?.positioning ??
        analysis?.positioning ??
        undefined,
      valueProposition:
        analysis?.value_proposition ??
        response.company_social_analysis?.company_dna?.value_proposition,
      socialLinks,
    },
    metrics: buildMetrics(response, instagram, linkedin, topCompetitors),
    dna: buildDna(response),
    instagram,
    linkedin,
    website: buildWebsite(response),
    executiveSummary:
      response.ai_report?.summary ??
      response.summary ??
      response.company_social_analysis?.company_dna?.value_proposition,
    swot: response.analysis?.swot
      ? {
          strengths: response.analysis.swot.strengths ?? [],
          weaknesses: response.analysis.swot.weaknesses ?? [],
          opportunities: response.analysis.swot.opportunities ?? [],
          threats: response.analysis.swot.threats ?? [],
        }
      : undefined,
    topCompetitors,
    competitors,
    comparisonRows: comparison.rows,
    comparisonHandles: comparison.handles,
    similarityScores,
    averageSimilarity: buildAverageSimilarity(response),
    gapAnalysis: buildGapAnalysis(response),
    priorityGaps: buildPriorityGaps(response),
    recommendations: buildRecommendations(response),
    marketInsights: buildMarketInsights(response),
    searchIntelligence: buildSearchIntelligence(response),
    runMeta: buildRunMeta(response, competitors.length),
    companyKeywords: profile?.keywords ?? company?.extracted_signals?.keywords ?? analysis?.keywords ?? [],
    companyProducts: profile?.products ?? analysis?.products ?? [],
    companyFeatures: profile?.features ?? analysis?.features ?? [],
    companyExtras: buildCompanyExtras(response),
    businessSignals: buildBusinessSignals(response),
    reviewIntel: buildReviewIntel(response),
    technologyIntel: buildTechnologyIntel(response),
    marketingIntel: buildMarketingIntel(response),
    contentStrategyIntel: buildContentStrategyIntel(response),
    competitorGaps: buildCompetitorGaps(response),
    competitorWebsiteIntel: buildCompetitorWebsiteIntel(response),
    pipelineStatus: buildPipelineStatus(response),
    lastUpdated: response.meta?.created_at ?? response.meta?.timestamp ?? "Just now",
    analysisError: typeof response.error === "string" ? response.error : null,
    discoveryWarnings: [
      ...(response.discovery_warnings ?? []),
      ...(response.filters_applied?.discovery_warnings ?? []),
    ].filter((value, index, arr) => arr.indexOf(value) === index),
    analysisSuccess: Boolean(response.success ?? response.meta?.success),
  };
}
