import type {
  CompetitorAnalysisAsyncJobResponse,
  CompetitorAnalysisJobPollResponse,
  CompetitorAnalysisRequest,
  CompetitorAnalysisResponse,
  CompetitorAnalysisResultsAllResponse,
  CompetitorAnalysisResultsResponse,
} from "@/types/api";
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

const JOB_POLL_INTERVAL_MS = 15_000;
const JOB_POLL_TIMEOUT_MS = 15 * 60 * 1000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeJobStatus(status?: string): string {
  return (status ?? "").toLowerCase().trim();
}

function isJobComplete(status?: string): boolean {
  const value = normalizeJobStatus(status);
  return value === "completed" || value === "success" || value === "done";
}

function isJobFailed(status?: string): boolean {
  const value = normalizeJobStatus(status);
  return value === "failed" || value === "error" || value === "cancelled";
}

function extractAnalysisResult(
  poll: CompetitorAnalysisJobPollResponse,
): CompetitorAnalysisResponse | null {
  if (poll.result && typeof poll.result === "object") return poll.result;
  if (poll.data && typeof poll.data === "object") return poll.data;

  if (
    isJobComplete(poll.status) &&
    ("competitors" in poll || "company_profile" in poll || "market_insights" in poll)
  ) {
    return poll as unknown as CompetitorAnalysisResponse;
  }

  return null;
}


export const startCompetitorAnalysisJob = async (
  payload: CompetitorAnalysisRequest,
): Promise<CompetitorAnalysisAsyncJobResponse> => {
  const response = await fetch(Endpoint.COMPETITORANALYSISAPI, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await parseJsonResponse<
    CompetitorAnalysisAsyncJobResponse & { error?: string; detail?: unknown }
  >(response);

  if (!response.ok) throw new Error(formatApiError(data));

  const jobId = data.job_id;
  if (!jobId) {
    throw new Error("Async analysis did not return a job_id");
  }

  return data;
};

export const fetchCompetitorAnalysisJob = async (
  jobId: string,
): Promise<CompetitorAnalysisJobPollResponse> => {
  const response = await fetch(Endpoint.POLLEDCOMPETITORANALYSISJOBS(jobId), {
    cache: "no-store",
  });

  const data = await parseJsonResponse<
    CompetitorAnalysisJobPollResponse & { error?: string; detail?: unknown }
  >(response);

  if (!response.ok) throw new Error(formatApiError(data));
  return data;
};

export const fetchCompetitorAnalysisResults = async (): Promise<CompetitorAnalysisResultsResponse> => {
  const response = await fetch(Endpoint.COMPETITORANALYSISRESULTS, {
    cache: "no-store",
  });
  const data = await parseJsonResponse<
    CompetitorAnalysisResultsResponse & { error?: string; detail?: unknown }
  >(response);
  if (!response.ok) throw new Error(formatApiError(data));
  return data;
};


export const CompetitorAnalysisApi = async (
  payload: CompetitorAnalysisRequest,
  options?: {
    onJobStarted?: (job: CompetitorAnalysisAsyncJobResponse) => void;
    onPoll?: (job: CompetitorAnalysisJobPollResponse) => void;
    signal?: AbortSignal;
  },
): Promise<CompetitorAnalysisResponse> => {
  const started = await startCompetitorAnalysisJob(payload);
  options?.onJobStarted?.(started);

  const jobId = started.job_id;
  const startedAt = Date.now();

  while (Date.now() - startedAt < JOB_POLL_TIMEOUT_MS) {
    if (options?.signal?.aborted) {
      throw new Error("Analysis cancelled");
    }

    await sleep(JOB_POLL_INTERVAL_MS);

    const poll = await fetchCompetitorAnalysisJob(jobId);
    options?.onPoll?.(poll);

    if (isJobFailed(poll.status) || poll.error) {
      throw new Error(
        typeof poll.error === "string" && poll.error
          ? poll.error
          : formatApiError({
              error: poll.error ?? undefined,
              detail: poll.detail,
            }) || `Analysis job failed (${poll.status ?? "error"})`,
      );
    }

    const result = extractAnalysisResult(poll);
    if (result && (isJobComplete(poll.status) || result.success || result.competitors?.length)) {
      if (result.error && !result.competitors?.length) {
        throw new Error(result.error);
      }
      return result;
    }

    if (isJobComplete(poll.status) && !result) {
      return fetchCompetitorAnalysisResults();
    }
  }

  throw new Error("Analysis timed out while waiting for the job to complete");
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


export const fetchCompetitorAnalysisResultsAll = async (): Promise<CompetitorAnalysisResultsAllResponse> => {
  const response = await fetch(Endpoint.COMPETITORANALYSISRESULTSALL, {
    cache: "no-store",
  });
  const data = await parseJsonResponse<
    CompetitorAnalysisResultsAllResponse & { error?: string; detail?: unknown }
  >(response);
  if (!response.ok) throw new Error(formatApiError(data));
  return data;
};

export const fetchCompetitorAnalysisResultsById = async (
  analysisId: string,
): Promise<CompetitorAnalysisResultsResponse> => {
  const response = await fetch(Endpoint.COMPETITORANALYSISRESULTSBYID(analysisId), {
    cache: "no-store",
  });
  const data = await parseJsonResponse<
    CompetitorAnalysisResultsResponse & { error?: string; detail?: unknown }
  >(response);
  if (!response.ok) throw new Error(formatApiError(data));
  return data;
};


export const deleteCompetitorAnalysisResultsById = async (analysisId: string): Promise<void> => {
  const response = await fetch(Endpoint.DETAILCOMPETITORANALYSISRESULTSALLBYID(analysisId), {
    method: "DELETE",
  });

  if (response.status === 204 || response.status === 205) return;

  const text = await response.text();
  if (!response.ok) {
    let payload: { error?: string; detail?: unknown } = {};
    try {
      payload = text ? (JSON.parse(text) as { error?: string; detail?: unknown }) : {};
    } catch {
      payload = { error: text || "Failed to delete analysis" };
    }
    throw new Error(formatApiError(payload));
  }
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
