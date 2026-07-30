import type { CompetitorAnalysisRequest, CompetitorAnalysisResponse } from "@/types/api";
import type { CompetitorsListResponse } from "@/types/competitors";
import type { ContentListResponse } from "@/types/content";
import type { HashtagListResponse } from "@/types/hashtag";
import type { GlobalTrendsResponse } from "@/types/trends";
import { formatApiError } from "@/lib/format-api-error";
import { parseJsonResponse } from "@/lib/parse-json-response";
import { Endpoint } from "./endpoint";

export const CompetitorAnalysisApi = async (
  payload: CompetitorAnalysisRequest,
): Promise<CompetitorAnalysisResponse> => {
  const response = await fetch(Endpoint.COMPETITORANALYSISAPI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await parseJsonResponse<
    CompetitorAnalysisResponse & { error?: string; detail?: unknown }
  >(response);

  if (!response.ok) {
    throw new Error(formatApiError(data));
  }

  return data;
};

export const fetchCompetitorsList = async (): Promise<CompetitorsListResponse> => {
  const response = await fetch(Endpoint.COMPETITORS, {
    cache: "no-store",
  });

  const data = await parseJsonResponse<
    CompetitorsListResponse & { error?: string; detail?: unknown }
  >(response);

  if (!response.ok) {
    throw new Error(formatApiError(data));
  }

  return data;
};

export const fetchContentList = async (): Promise<ContentListResponse> => {
  const response = await fetch(Endpoint.CONTENT, {
    cache: "no-store",
  });

  const data = await parseJsonResponse<
    ContentListResponse & { error?: string; detail?: unknown }
  >(response);

  if (!response.ok) {
    throw new Error(formatApiError(data));
  }

  return data;
};

export const fetchHashtagList = async (): Promise<HashtagListResponse> => {
  const response = await fetch(Endpoint.HASHTAGS, {
    cache: "no-store",
  });

  const data = await parseJsonResponse<
    HashtagListResponse & { error?: string; detail?: unknown }
  >(response);

  if (!response.ok) {
    throw new Error(formatApiError(data));
  }

  return data;
};


export const fetchGlobalTrends = async (): Promise<GlobalTrendsResponse> => {
  const response = await fetch(Endpoint.GLOBALTRENDS, {
    cache: "no-store",
  });

  const data = await parseJsonResponse<
    GlobalTrendsResponse & { error?: string; detail?: unknown }
  >(response);

  if (!response.ok) {
    throw new Error(formatApiError(data));
  }

  return data;
};