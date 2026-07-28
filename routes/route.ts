import type { CompetitorAnalysisRequest, CompetitorAnalysisResponse } from "@/types/api";
import type { CompetitorsListResponse } from "@/types/competitors";
import type { ContentListResponse } from "@/types/content";
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

  const data = await response.json();

  if (!response.ok) {
    const message =
      typeof data?.error === "string"
        ? data.error
        : Array.isArray(data?.detail)
          ? data.detail.map((d: { msg?: string }) => d.msg).join(", ")
          : "Competitor analysis request failed";
    throw new Error(message);
  }

  return data;
};

export const fetchCompetitorsList = async (): Promise<CompetitorsListResponse> => {
  const response = await fetch(Endpoint.COMPETITORS, {
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error ?? "Failed to fetch competitors");
  }

  return data;
};

export const fetchContentList = async (): Promise<ContentListResponse> => {
  const response = await fetch(Endpoint.CONTENT_LOCAL || Endpoint.CONTENT, {
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error ?? "Failed to fetch content");
  }

  return data;
};
