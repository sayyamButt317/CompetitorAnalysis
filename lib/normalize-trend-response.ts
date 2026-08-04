import type { GlobalTrendsResponse, TrendGroupItem } from "@/types/trends";

export interface StoredTrendRow {
  id: string;
  summary?: string;
  duration_sec?: number;
  created_at?: string;
  result?: GlobalTrendsResponse & Record<string, unknown>;
  hashtags?: unknown[];
  topics?: unknown[];
  trend_scores?: TrendGroupItem[];
  web_sources?: string[];
  [key: string]: unknown;
}

export interface StoredTrendResponse {
  success: boolean;
  trend: StoredTrendRow;
}

export interface TrendRunSummary {
  trend_id: string;
  summary?: string;
  duration_sec?: number;
  created_at?: string;
}

export interface StoredTrendsListResponse {
  success: boolean;
  count: number;
  trends: TrendRunSummary[];
}

function scoresByType(
  scores: TrendGroupItem[] | undefined,
  groupType: string,
): TrendGroupItem[] {
  return (scores ?? []).filter((item) => item.group_type === groupType);
}

export function isPartialTrendResponse(response: GlobalTrendsResponse): boolean {
  const breakdown =
    response.source_breakdown?.length ?? response.web_trends?.source_breakdown?.length ?? 0;

  if (breakdown >= 50) return false;
  if ((response.meta?.duration_sec ?? 0) >= 30) return false;
  if (/Reddit \+ X/i.test(response.summary ?? "")) return false;

  return true;
}

export function normalizeStoredTrendResponse(
  stored: StoredTrendResponse,
): GlobalTrendsResponse {
  const trend = stored.trend;
  const result = (trend.result ?? {}) as GlobalTrendsResponse & Record<string, unknown>;
  const webTrends = result.web_trends;
  const trendScores = result.trend_scores ?? trend.trend_scores;

  const sourceBreakdown =
    result.source_breakdown ??
    webTrends?.source_breakdown ??
    [];

  return {
    ...result,
    success: stored.success,
    mode: result.mode ?? "global_trend",
    summary: trend.summary ?? result.summary ?? "",
    source_breakdown: sourceBreakdown,
    web_trends: webTrends,
    web_sources: result.web_sources ?? trend.web_sources,
    trending_hashtags:
      result.trending_hashtags ?? scoresByType(trendScores, "hashtag"),
    trending_topics:
      result.trending_topics ?? scoresByType(trendScores, "topic"),
    trending_reel_formats:
      result.trending_reel_formats ?? scoresByType(trendScores, "reel_format"),
    trend_scores: trendScores,
    google_trends:
      result.google_trends ??
      webTrends?.google_trends ??
      [],
    google_trends_by_country:
      result.google_trends_by_country ??
      webTrends?.google_trends_by_country,
    competitor_count:
      result.competitor_count ??
      result.web_sources?.length ??
      trend.web_sources?.length ??
      sourceBreakdown.length,
    meta: result.meta ?? {
      duration_sec: trend.duration_sec,
      timestamp: trend.created_at,
      status: "success",
      platform: "instagram",
      discovery_source: "web_trend_crawl",
      agent_mode: "global_trend",
    },
    saved_trend_id: trend.id,
  };
}

export function findLatestFullTrendId(
  trends: TrendRunSummary[],
): string | null {
  const full = trends.find(
    (run) =>
      (run.duration_sec ?? 0) >= 30 &&
      /Reddit \+ X/i.test(run.summary ?? ""),
  );

  return full?.trend_id ?? null;
}
