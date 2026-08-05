const BASE_URL = "https://trend-analysis-jf6t.vercel.app";
const LOCAL_URL = "http://127.0.0.1:8000";

function withTrendId(base: string, trendId?: string): string {
  if (!trendId) return base;
  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}trend_id=${encodeURIComponent(trendId)}`;
}

export const Endpoint = {
  /** POST — starts analysis and returns a job_id */
  COMPETITORANALYSISAPI: `${BASE_URL}/competitor-analysis/analyze/async`,
  /** GET — poll job status / result by job_id */
  POLLEDCOMPETITORANALYSISJOBS: (jobId: string) =>
    `${BASE_URL}/competitor-analysis/jobs/${encodeURIComponent(jobId)}`,

  COMPETITORS: `${BASE_URL}/competitor-analysis/competitors`,

  COMPETITORANALYSISRESULTSBYID: (analysisId: string) =>
    `${BASE_URL}/competitor-analysis/results/${encodeURIComponent(analysisId)}`,
  COMPETITORANALYSISRESULTS: `${BASE_URL}/competitor-analysis/results`,

  COMPETITORANALYSISRESULTSALL: `${BASE_URL}/competitor-analysis/results/all`,
  DETAILCOMPETITORANALYSISRESULTSALLBYID: (analysisId: string) =>
    `${BASE_URL}/competitor-analysis/results/${encodeURIComponent(analysisId)}`,

  CONTENT: `${BASE_URL}/competitor-analysis/content`,
  CONTENT_LOCAL: `${LOCAL_URL}/competitor-analysis/content`,
  HASHTAGS: `${BASE_URL}/competitor-analysis/hashtags`,
  HASHTAGS_LOCAL: `${LOCAL_URL}/competitor-analysis/hashtags`,

  GLOBALTRENDS: `${BASE_URL}/trend-analysis/today`,
  REGIONTRENDS: `${BASE_URL}/trend-analysis/today`,
  COMPANYBASEDTRENDS: `${BASE_URL}/trend-analysis/discover`,
  NICHE_TRENDS: `${BASE_URL}/trend-analysis/discover`,
  TRENDANALYTICS: (trendId?: string) =>
    withTrendId(`${BASE_URL}/trend-analysis/analytics`, trendId),
  TRENDSLIST: `${BASE_URL}/trend-analysis/trends`,
  TREND_BY_ID: (trendId: string) =>
    `${BASE_URL}/trend-analysis/trends/${encodeURIComponent(trendId)}`,
  LISTOFHASHTAGS: (trendId?: string) =>
    withTrendId(`${BASE_URL}/trend-analysis/hashtags`, trendId),
  VIRALPOSTS: (trendId?: string) =>
    withTrendId(`${BASE_URL}/trend-analysis/viral-posts`, trendId),
  TRENDSCORE: (trendId?: string) =>
    withTrendId(`${BASE_URL}/trend-analysis/trend-scores`, trendId),

  NICHETREND: `${BASE_URL}/niche-trend/discover`,
};
