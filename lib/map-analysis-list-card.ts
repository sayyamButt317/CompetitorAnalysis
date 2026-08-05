import type { CompetitorAnalysisResponse } from "@/types/api";

export type AnalysisListStatus = "success" | "failed" | "unknown";

export interface AnalysisContentMixItem {
  label: string;
  share: number;
  tone: "blue" | "green" | "purple" | "amber" | "slate";
}

export interface AnalysisListCardModel {
  id: string | null;
  companyName: string;
  initials: string;
  status: AnalysisListStatus;
  statusLabel: string;
  location: string;
  competitorCount: number;
  postCount: number;
  summary: string;
  contentMix: AnalysisContentMixItem[];
  topTheme?: string;
  contentGaps: string[];
  techGaps: string[];
  relevanceScore: number | null;
  relevanceLabel: "High" | "Medium" | "Low" | "—";
  createdAt?: string;
  errorMessage?: string | null;
}

const MIX_TONES: AnalysisContentMixItem["tone"][] = ["blue", "green", "purple", "amber", "slate"];

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function getAnalysisId(item: CompetitorAnalysisResponse): string | null {
  return item.meta?.analysis_id ?? null;
}

export function getCompanyName(item: CompetitorAnalysisResponse): string {
  return (
    item.company_profile?.name ??
    item.company?.name ??
    item.company_analysis?.name ??
    item.company?.extracted_signals?.name ??
    "Untitled analysis"
  );
}

function getLocation(item: CompetitorAnalysisResponse): string {
  const city = item.company_profile?.city ?? item.company_analysis?.city ?? undefined;
  const region =
    item.company_profile?.region ??
    item.filters_applied?.region ??
    item.company_analysis?.region;
  if (city && region && city !== region) return `${city}, ${region}`;
  return city ?? region ?? "—";
}

function getStatus(item: CompetitorAnalysisResponse): {
  status: AnalysisListStatus;
  label: string;
} {
  const raw = (item.meta?.status ?? (item.success ? "success" : "failed")).toLowerCase();
  if (item.success || raw === "success" || raw === "completed" || raw === "succeeded") {
    return { status: "success", label: "SUCCESS" };
  }
  if (raw === "failed" || raw === "error" || item.error) {
    return { status: "failed", label: "FAILED" };
  }
  return { status: "unknown", label: (raw || "UNKNOWN").toUpperCase() };
}

function relevanceLabel(score: number | null): AnalysisListCardModel["relevanceLabel"] {
  if (score == null) return "—";
  if (score >= 0.55) return "High";
  if (score >= 0.35) return "Medium";
  return "Low";
}

function averageRelevance(item: CompetitorAnalysisResponse): number | null {
  const scores = (item.competitors ?? [])
    .map((competitor) => competitor.match_score ?? competitor.similarity?.overall)
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value));

  if (scores.length === 0) {
    const fromSimilarity = (item.similarity_scores ?? [])
      .map((row) => row.match_score ?? row.similarity?.overall)
      .filter((value): value is number => typeof value === "number" && Number.isFinite(value));
    if (fromSimilarity.length === 0) return null;
    return fromSimilarity.reduce((sum, value) => sum + value, 0) / fromSimilarity.length;
  }

  return scores.reduce((sum, value) => sum + value, 0) / scores.length;
}

function buildSummary(item: CompetitorAnalysisResponse, companyName: string): string {
  if (item.error) return item.error;

  const industry =
    item.company_profile?.industry ??
    item.company_analysis?.industry ??
    item.analysis?.company?.industry;
  const region =
    item.filters_applied?.region ??
    item.company_profile?.region ??
    item.company_analysis?.region;
  const competitorCount = item.competitor_count ?? item.competitors?.length ?? 0;
  const postCount =
    item.post_count ??
    item.company_social_analysis?.user_instagram?.analysis?.post_count ??
    0;

  const parts = [
    `Competitor analysis for ${companyName}.`,
    industry ? `Industry: ${industry}.` : null,
    region ? `Region focus: ${region}.` : null,
    `Matched ${competitorCount} competitor${competitorCount === 1 ? "" : "s"} and analyzed ${postCount} posts.`,
  ].filter(Boolean);

  return parts.join(" ");
}

function buildContentMix(item: CompetitorAnalysisResponse): AnalysisContentMixItem[] {
  const mix =
    item.company_social_analysis?.user_instagram?.analysis?.media_mix ??
    item.market_insights?.dominant_content_types ??
    [];

  return mix.slice(0, 4).map((entry, index) => {
    const label =
      ("type" in entry && entry.type) ||
      ("format" in entry && entry.format) ||
      "Content";
    const share =
      "share_pct" in entry && typeof entry.share_pct === "number"
        ? entry.share_pct
        : "count" in entry && typeof entry.count === "number"
          ? entry.count
          : 0;

    return {
      label: String(label),
      share: Number.isFinite(share) ? share : 0,
      tone: MIX_TONES[index % MIX_TONES.length],
    };
  });
}

export function mapAnalysisToListCard(item: CompetitorAnalysisResponse): AnalysisListCardModel {
  const companyName = getCompanyName(item);
  const { status, label } = getStatus(item);
  const relevanceScore = averageRelevance(item);
  const categories =
    item.company_social_analysis?.user_instagram?.analysis?.content_categories ?? [];
  const themes =
    item.market_insights?.dominant_themes ??
    item.company_social_analysis?.user_linkedin?.content_themes ??
    [];
  const topTheme =
    categories[0]?.category ??
    (typeof themes[0] === "string" ? themes[0] : themes[0]?.theme) ??
    undefined;

  return {
    id: getAnalysisId(item),
    companyName,
    initials: initials(companyName),
    status,
    statusLabel: label,
    location: getLocation(item),
    competitorCount: item.competitor_count ?? item.competitors?.length ?? 0,
    postCount:
      item.post_count ??
      item.company_social_analysis?.user_instagram?.analysis?.post_count ??
      0,
    summary: buildSummary(item, companyName),
    contentMix: buildContentMix(item),
    topTheme,
    contentGaps: (item.gap_analysis?.service_gaps ?? []).slice(0, 2),
    techGaps: (item.gap_analysis?.technology_gaps ?? []).slice(0, 2),
    relevanceScore,
    relevanceLabel: relevanceLabel(relevanceScore),
    createdAt: item.meta?.created_at ?? item.meta?.timestamp,
    errorMessage: typeof item.error === "string" ? item.error : null,
  };
}

export function buildDashboardListStats(results: CompetitorAnalysisResponse[]) {
  const total = results.length;
  const successCount = results.filter((item) => getStatus(item).status === "success").length;
  const failedCount = total - successCount;
  const successRate = total > 0 ? Math.round((successCount / total) * 100) : 0;

  const relevanceValues = results
    .map((item) => averageRelevance(item))
    .filter((value): value is number => value != null);
  const avgRelevance =
    relevanceValues.length > 0
      ? relevanceValues.reduce((sum, value) => sum + value, 0) / relevanceValues.length
      : null;

  const postsAnalyzed = results.reduce(
    (sum, item) =>
      sum +
      (item.post_count ??
        item.company_social_analysis?.user_instagram?.analysis?.post_count ??
        0),
    0,
  );

  const competitorsMatched = results.reduce(
    (sum, item) => sum + (item.competitor_count ?? item.competitors?.length ?? 0),
    0,
  );

  const latest = results
    .map((item) => item.meta?.created_at ?? item.meta?.timestamp)
    .filter(Boolean)
    .sort((a, b) => new Date(b as string).getTime() - new Date(a as string).getTime())[0];

  return {
    total,
    successCount,
    failedCount,
    successRate,
    avgRelevance,
    postsAnalyzed,
    competitorsMatched,
    lastAnalysisAt: latest,
  };
}
