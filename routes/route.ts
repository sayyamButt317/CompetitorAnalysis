import type { CompetitorAnalysisRequest, CompetitorAnalysisResponse } from "@/types/api";

const CLIENT_API = "/api/competitor-analysis";

export const CompetitorAnalysisApi = async (
  payload: CompetitorAnalysisRequest,
): Promise<CompetitorAnalysisResponse> => {
  const response = await fetch(CLIENT_API, {
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
