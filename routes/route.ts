import type { CompetitorAnalysisRequest, CompetitorAnalysisResponse } from "@/types/api";
import type { CompetitorsListResponse } from "@/types/competitors";
import type { ContentListResponse } from "@/types/content";
import type { HashtagListResponse } from "@/types/hashtag";
import type {
  CompanyBasedTrendsRequest,
  FetchTrendDataOptions,
  GlobalTrendsResponse,
  ListOfHashtagsResponse,
  NicheTrendRequest,
  NicheTrendResponse,
  RegionTrendRequest,
  RegionTrendResponse,
  TrendAnalyticsResponse,
  TrendListResponse,
  TrendScoresResponse,
  ViralPostsResponse,
} from "@/types/trends";
import { formatApiError } from "@/lib/format-api-error";
import {
  findLatestFullTrendId,
  isPartialTrendResponse,
  normalizeStoredTrendResponse,
  type StoredTrendResponse,
} from "@/lib/normalize-trend-response";
import { parseJsonResponse } from "@/lib/parse-json-response";
import { Endpoint } from "./endpoint";

export const CompetitorAnalysisApi = async (
  payload: CompetitorAnalysisRequest,
): Promise<CompetitorAnalysisResponse> => {
  const response = await fetch(Endpoint.COMPETITORANALYSISAPI, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await parseJsonResponse<
    CompetitorAnalysisResponse & { error?: string; detail?: unknown }
  >(response);

  if (!response.ok) throw new Error(formatApiError(data));
  return data;
};

export const fetchCompetitorsList = async (): Promise<CompetitorsListResponse> => {
  const response = await fetch(Endpoint.COMPETITORS, { cache: "no-store" });
  const data = await parseJsonResponse<
    CompetitorsListResponse & { error?: string; detail?: unknown }
  >(response);
  if (!response.ok) throw new Error(formatApiError(data));
  return data;
};

export const fetchContentList = async (): Promise<ContentListResponse> => {
  const response = await fetch(Endpoint.CONTENT, { cache: "no-store" });
  const data = await parseJsonResponse<
    ContentListResponse & { error?: string; detail?: unknown }
  >(response);
  if (!response.ok) throw new Error(formatApiError(data));
  return data;
};

export const fetchHashtagList = async (): Promise<HashtagListResponse> => {
  const response = await fetch(Endpoint.HASHTAGS, { cache: "no-store" });
  const data = await parseJsonResponse<
    HashtagListResponse & { error?: string; detail?: unknown }
  >(response);
  if (!response.ok) throw new Error(formatApiError(data));
  return data;
};

async function fetchTodayTrends(): Promise<GlobalTrendsResponse> {
  const response = await fetch(`${Endpoint.GLOBALTRENDS}?ts=${Date.now()}`, {
    cache: "no-store",
    headers: { "Cache-Control": "no-cache, no-store", Pragma: "no-cache" },
  });
  const data = await parseJsonResponse<
    GlobalTrendsResponse & { error?: string; detail?: unknown }
  >(response);
  if (!response.ok) throw new Error(formatApiError(data));
  return data;
}

export async function fetchStoredTrendsList(): Promise<TrendListResponse> {
  const response = await fetch(Endpoint.TRENDSLIST, { cache: "no-store" });
  const data = await parseJsonResponse<
    TrendListResponse & { error?: string; detail?: unknown }
  >(response);
  if (!response.ok) throw new Error(formatApiError(data));
  return data;
}

export async function fetchTrendById(trendId: string): Promise<GlobalTrendsResponse> {
  const response = await fetch(Endpoint.TREND_BY_ID(trendId), { cache: "no-store" });
  const data = await parseJsonResponse<
    StoredTrendResponse & { error?: string; detail?: unknown }
  >(response);
  if (!response.ok) throw new Error(formatApiError(data));
  return normalizeStoredTrendResponse(data);
}

export interface FetchGlobalTrendsOptions {
  trendId?: string;
}

export async function fetchGlobalTrends(
  options: FetchGlobalTrendsOptions = {},
): Promise<GlobalTrendsResponse> {
  if (options.trendId) return fetchTrendById(options.trendId);

  const todayResponse = await fetchTodayTrends();
  if (!isPartialTrendResponse(todayResponse)) return todayResponse;

  try {
    const list = await fetchStoredTrendsList();
    const fullTrendId = findLatestFullTrendId(list.trends ?? []);
    if (fullTrendId) return fetchTrendById(fullTrendId);
  } catch {
    // Fall back to quick /today payload.
  }

  return todayResponse;
}

export const fetchCompanyBasedTrends = async (
  payload: CompanyBasedTrendsRequest,
): Promise<GlobalTrendsResponse> => {
  const response = await fetch(Endpoint.COMPANYBASEDTRENDS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const data = await parseJsonResponse<
    GlobalTrendsResponse & { error?: string; detail?: unknown }
  >(response);
  if (!response.ok) throw new Error(formatApiError(data));
  return data;
};

export const fetchRegionTrend = async (
  payload: RegionTrendRequest,
): Promise<RegionTrendResponse> => {
  const response = await fetch(Endpoint.REGIONTRENDS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const data = await parseJsonResponse<
    RegionTrendResponse & { error?: string; detail?: unknown }
  >(response);
  if (!response.ok) throw new Error(formatApiError(data));
  return data;
};

export const fetchNicheTrend = async (
  payload: NicheTrendRequest,
): Promise<NicheTrendResponse> => {
  const response = await fetch(Endpoint.NICHETREND, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const data = await parseJsonResponse<
    NicheTrendResponse & { error?: string; detail?: unknown }
  >(response);
  if (!response.ok) throw new Error(formatApiError(data));
  return data;
};

export const fetchTrendAnalytics = async (
  options: FetchTrendDataOptions = {},
): Promise<TrendAnalyticsResponse> => {
  const response = await fetch(Endpoint.TRENDANALYTICS(options.trendId), {
    cache: "no-store",
  });
  const data = await parseJsonResponse<
    TrendAnalyticsResponse & { error?: string; detail?: unknown }
  >(response);
  if (!response.ok) throw new Error(formatApiError(data));
  return data;
};

export const fetchTrendList = fetchStoredTrendsList;

export const fetchListOfHashtags = async (
  options: FetchTrendDataOptions = {},
): Promise<ListOfHashtagsResponse> => {
  const response = await fetch(Endpoint.LISTOFHASHTAGS(options.trendId), {
    cache: "no-store",
  });
  const data = await parseJsonResponse<
    ListOfHashtagsResponse & { error?: string; detail?: unknown }
  >(response);
  if (!response.ok) throw new Error(formatApiError(data));
  return data;
};

export const fetchViralPosts = async (
  options: FetchTrendDataOptions = {},
): Promise<ViralPostsResponse> => {
  const response = await fetch(Endpoint.VIRALPOSTS(options.trendId), {
    cache: "no-store",
  });
  const data = await parseJsonResponse<
    ViralPostsResponse & { error?: string; detail?: unknown }
  >(response);
  if (!response.ok) throw new Error(formatApiError(data));
  return data;
};

export const fetchTrendScores = async (
  options: FetchTrendDataOptions = {},
): Promise<TrendScoresResponse> => {
  const response = await fetch(Endpoint.TRENDSCORE(options.trendId), {
    cache: "no-store",
  });
  const data = await parseJsonResponse<
    TrendScoresResponse & { error?: string; detail?: unknown }
  >(response);
  if (!response.ok) throw new Error(formatApiError(data));
  return data;
};

// Backward-compatible aliases
export const RegionTrend = fetchRegionTrend;
export const NicheTrend = fetchNicheTrend;
export const TrendAnalytics = fetchTrendAnalytics;
export const TrendList = fetchTrendList;
export const TrendById = fetchTrendById;
export const ListOfHashtags = fetchListOfHashtags;
export const ViralPosts = fetchViralPosts;
export const TrendScores = fetchTrendScores;
