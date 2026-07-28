export interface CompetitorAnalysisRequest {
  company_data: string;
  region: string;
  competitors: string[];
}

export interface ApiCompetitorPost {
  id?: string;
  caption?: string;
  media_type?: string;
  media_url?: string | null;
  thumbnail_url?: string | null;
  permalink?: string;
  timestamp?: string;
  likes?: number;
  comments?: number;
  engagement_rate?: number;
  hashtags?: string[];
}

export interface ApiMediaTypeBreakdown {
  type?: string;
  format?: string;
  count: number;
  share_pct?: number;
}

export interface ApiThemeBreakdown {
  theme: string;
  count: number;
  share_pct?: number;
}

export interface ApiCategoryBreakdown {
  category: string;
  count: number;
  share_pct?: number;
}

export interface ApiContentStrategy {
  post_count?: number;
  primary_format?: string;
  primary_content_category?: string;
  content_focus?: string;
  media_types?: ApiMediaTypeBreakdown[];
  content_categories?: ApiCategoryBreakdown[];
  themes?: ApiThemeBreakdown[];
  top_hashtags?: string[];
  avg_engagement_rate?: number;
  caption_style?: Record<string, number>;
  best_performing_format?: {
    format?: string;
    avg_engagement_rate?: number;
    post_count?: number;
  };
}

export interface ApiCompetitorProfile {
  username?: string;
  name?: string;
  followers?: number;
  profile_url?: string;
  profile_picture_url?: string;
  image_url?: string;
  bio?: string;
  website?: string;
  discovered_by?: string;
  match_score?: number;
  match_reasons?: string[];
  content_strategy?: ApiContentStrategy;
  posts?: ApiCompetitorPost[];
}

export interface ApiTopicInsight {
  topic: string;
  post_count?: number;
  creator_count?: number;
}

export interface ApiHashtagSummary {
  hashtag: string;
  post_count?: number;
  creator_count?: number;
}

export interface ApiHashtagCount {
  tag: string;
  count: number;
}

export interface ApiContentUsage {
  summary?: string;
  format_breakdown?: ApiMediaTypeBreakdown[];
  category_breakdown?: ApiCategoryBreakdown[];
  most_used_format?: string;
  most_used_category?: string;
  insights?: string[];
}

export interface ApiMarketInsights {
  topics?: ApiTopicInsight[];
  content_usage?: ApiContentUsage;
  dominant_content_types?: ApiMediaTypeBreakdown[];
  dominant_content_categories?: ApiCategoryBreakdown[];
  dominant_themes?: ApiThemeBreakdown[];
  top_hashtags?: ApiHashtagCount[];
  hashtag_summary?: ApiHashtagSummary[];
}

export interface ApiCompanyExtractedSignals {
  name?: string;
  services?: string[];
  flagship_services?: string[];
  technologies?: string[];
  target_industries?: string[];
  keywords?: string[];
  summary?: string;
}

export interface ApiCompany {
  name?: string;
  instagram_username?: string | null;
  website?: string | null;
  services?: string[];
  flagship_services?: string[];
  extracted_signals?: ApiCompanyExtractedSignals;
}

export interface ApiFiltersApplied {
  region?: string;
  competitors?: string[];
  competitor_limit?: number;
  matching_mode?: string;
  discovery_warnings?: string[];
}

export interface ApiMeta {
  status?: string;
  duration_sec?: number;
  timestamp?: string;
  platform?: string;
  agent_mode?: string;
  discovery_source?: string;
}

export interface CompetitorAnalysisResponse {
  success: boolean;
  error?: string | null;
  summary?: string;
  company?: ApiCompany;
  filters_applied?: ApiFiltersApplied;
  matching_mode?: string;
  discovery_warnings?: string[];
  competitor_intelligence?: unknown;
  competitor_count?: number;
  post_count?: number;
  competitors?: ApiCompetitorProfile[];
  market_insights?: ApiMarketInsights;
  meta?: ApiMeta;
}
