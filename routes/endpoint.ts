const BASE_URL = "https://trend-analysis-jf6t.vercel.app";
const LOCAL_URL = "http://127.0.0.1:8000";

export const Endpoint = {
  COMPETITORANALYSISAPI: `${BASE_URL}/competitor-analysis/analyze`,
  COMPETITORS: `${BASE_URL}/competitor-analysis/competitors`,
  CONTENT: `${BASE_URL}/competitor-analysis/content`,
  CONTENT_LOCAL: `${LOCAL_URL}/competitor-analysis/content`,
  HASHTAGS: `${BASE_URL}/competitor-analysis/hashtags`,
  HASHTAGS_LOCAL: `${LOCAL_URL}/competitor-analysis/hashtags`,
  GLOBALTRENDS: `${BASE_URL}/trend-analysis/today`,
  NICHE_TRENDS: `${BASE_URL}/trend-analysis/discover`,
}
