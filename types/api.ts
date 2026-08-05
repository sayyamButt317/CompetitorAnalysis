export interface CompetitorAnalysisRequest {
  company_data: string;
  region: string;
  competitors: string[];
  instagram_username?: string;
  linkedin_url?: string;
  competitor_limit?: number;
}

export type CompetitorAnalysisJobStatus =
  | "queued"
  | "pending"
  | "started"
  | "running"
  | "processing"
  | "completed"
  | "success"
  | "failed"
  | "error";

/** Response from POST /competitor-analysis/analyze/async */
export interface CompetitorAnalysisAsyncJobResponse {
  job_id: string;
  status?: CompetitorAnalysisJobStatus | string;
  message?: string;
  poll_url?: string;
  error?: string | null;
  detail?: unknown;
}

/** Response from GET /competitor-analysis/jobs/{job_id} */
export interface CompetitorAnalysisJobPollResponse {
  job_id?: string;
  status?: CompetitorAnalysisJobStatus | string;
  progress?: number | string | Record<string, unknown>;
  message?: string;
  error?: string | null;
  detail?: unknown;
  /** Full analysis payload when the job completes */
  result?: CompetitorAnalysisResponse;
  data?: CompetitorAnalysisResponse;
  analysis_id?: string;
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

export interface ApiSimilarityBreakdown {
  services?: number;
  technology?: number;
  target_audience?: number;
  industry?: number;
  pricing?: number;
  location?: number;
  marketing?: number;
  content?: number;
  products?: number;
  audience?: number;
  business_model?: number;
  positioning?: number;
  geography?: number;
  social_strategy?: number;
  content_strategy?: number;
  overall?: number;
  explanation?: string;
}

export interface ApiCompetitorProfile {
  username?: string;
  name?: string;
  followers?: number;
  profile_url?: string;
  profile_picture_url?: string;
  image_url?: string;
  bio?: string;
  website?: string | null;
  linkedin_url?: string | null;
  linkedin_username?: string | null;
  region_match?: boolean;
  niche_match?: boolean;
  authenticity?: string;
  discovered_by?: string;
  match_score?: number;
  match_reasons?: string[];
  similarity?: ApiSimilarityBreakdown;
  content_strategy?: ApiContentStrategy;
  posts?: ApiCompetitorPost[];
  social_warnings?: string[];
  instagram_analysis?: unknown;
  linkedin_analysis?: unknown;
  employees?: ApiLinkedInEmployee[];
  employee_count?: number | null;
  job_openings?: ApiJobOpening[];
  company_size?: string | null;
  is_hiring?: boolean | null;
  hiring_signals?: string[];
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
  instagram_username?: string | null;
  instagram_url?: string | null;
  linkedin_url?: string | null;
  linkedin_username?: string | null;
}

export interface ApiCompany {
  name?: string;
  instagram_username?: string | null;
  instagram_url?: string | null;
  linkedin_url?: string | null;
  website?: string | null;
  services?: string[];
  flagship_services?: string[];
  extracted_signals?: ApiCompanyExtractedSignals;
}

export interface ApiCompanyDna {
  services?: string[];
  technologies?: string[];
  keywords?: string[];
  target_audience?: string[];
  positioning?: string;
  value_proposition?: string;
}

export interface ApiInstagramAnalysis {
  username?: string;
  name?: string;
  bio?: string;
  followers?: number;
  website?: string;
  post_count?: number;
  primary_format?: string;
  primary_content_category?: string;
  content_focus?: string;
  top_hashtags?: ApiHashtagCount[];
  media_mix?: ApiMediaTypeBreakdown[];
  content_categories?: ApiCategoryBreakdown[];
  posting_frequency?: {
    post_count?: number;
    date_range_days?: number;
    avg_days_between_posts?: number;
    posts_per_week?: number;
  };
  avg_engagement_rate?: number;
  best_performing_format?: {
    format?: string;
    avg_engagement_rate?: number;
    post_count?: number;
  };
  total_interactions?: number;
  detected_niche?: string;
  niche_keywords?: string[];
  caption_style?: {
    avg_caption_length?: number;
    question_posts_pct?: number;
    cta_posts_pct?: number;
    emoji_posts_pct?: number;
  } & Record<string, number>;
}

export interface ApiUserInstagram {
  skipped?: boolean;
  username?: string;
  detected_niche?: string;
  analysis?: ApiInstagramAnalysis;
  post_count?: number;
  warnings?: string[];
}

export interface ApiLinkedInEmployee {
  name?: string;
  designation?: string;
  linkedin_url?: string;
  source?: string;
}

export interface ApiLinkedInTheme {
  theme: string;
  count: number;
}

export interface ApiUserLinkedIn {
  skipped?: boolean;
  reason?: string;
  linkedin_url?: string | null;
  linkedin_posts_url?: string | null;
  linkedin_slug?: string | null;
  company_name?: string | null;
  analysis?: {
    post_count?: number;
    avg_post_length?: number;
    content_themes?: ApiLinkedInTheme[];
    thought_leadership_score?: number;
    is_thought_leader?: boolean;
    employee_count?: number;
    company_size?: string | null;
    is_hiring?: boolean;
    open_roles?: number;
    active_hiring?: boolean;
    job_openings_count?: number;
    thought_leadership_posts?: number;
    b2b_signals?: string[];
    positioning_focus?: string[];
    sample_posts?: unknown[];
    signals?: string[];
  };
  content_themes?: ApiLinkedInTheme[];
  linkedin_content_themes?: ApiLinkedInTheme[];
  posts?: unknown[];
  linkedin_posts?: unknown[];
  post_count?: number;
  employees?: ApiLinkedInEmployee[];
  employee_count?: number | null;
  company_size?: string | null;
  job_openings?: ApiJobOpening[];
  job_count?: number;
  is_hiring?: boolean | null;
  hiring?: boolean | null;
  hiring_signals?: string[];
  warnings?: string[];
  followers?: number | null;
  industry?: string | null;
  specialties?: string[] | null;
  headquarters?: string | null;
  website?: string | null;
  tagline?: string | null;
  partnerships?: boolean | null;
  product_launches?: boolean | null;
  funding?: boolean | null;
  awards?: boolean | null;
  case_studies?: boolean | null;
  ai_posts?: boolean | null;
  blogs?: boolean | null;
  videos?: boolean | null;
  industries_targeted?: string[];
  technologies_mentioned?: string[];
  thought_leadership_score?: number | null;
  business_signals?: string[];
  linkedin_analysis?: ApiUserLinkedIn["analysis"];
  playwright_error?: string | null;
  social_handles?: Record<string, string | null | undefined>;
}

export interface ApiCompetitorLinkedInProfile {
  name?: string;
  linkedin_url?: string | null;
  followers?: number | null;
  employees?: ApiLinkedInEmployee[];
  employee_count?: number | null;
  company_size?: string | null;
  industry?: string | null;
  specialties?: string[] | null;
  headquarters?: string | null;
  website?: string | null;
  tagline?: string | null;
  hiring?: boolean | null;
  partnerships?: boolean | null;
  product_launches?: boolean | null;
  funding?: boolean | null;
  awards?: boolean | null;
  case_studies?: boolean | null;
  ai_posts?: boolean | null;
  blogs?: boolean | null;
  videos?: boolean | null;
  thought_leadership_score?: number | null;
  post_count?: number | null;
  content_themes?: ApiLinkedInTheme[] | string[];
  business_signals?: string[];
}

export interface ApiCompanySocialAnalysis {
  company_dna?: ApiCompanyDna;
  user_instagram?: ApiUserInstagram;
  user_linkedin?: ApiUserLinkedIn;
  social_handles?: {
    instagram_username?: string;
    instagram_url?: string;
    linkedin_url?: string;
  };
  detected_niche?: string;
  audience_pain_points?: string[];
}

export interface ApiFiltersApplied {
  region?: string;
  competitors?: string[];
  competitor_limit?: number;
  competitor_target?: number;
  matching_mode?: string;
  discovery_source?: string;
  discovery_warnings?: string[];
  reasoning?: string;
  openai_returned?: number;
  openai_accepted?: number;
  verified_count?: number;
  candidate_pool_size?: number;
}

export interface ApiMeta {
  status?: string;
  duration_sec?: number;
  timestamp?: string;
  created_at?: string;
  platform?: string;
  platforms?: string[];
  agent_mode?: string;
  discovery_source?: string;
  skip_linkedin?: boolean;
  serverless?: boolean;
  competitor_limit?: number;
  post_limit?: number;
  analysis_id?: string;
  prompt_id?: string;
  success?: boolean;
  tavily_calls?: number;
  linkedin_calls?: number;
  firecrawl_calls?: number;
  instagram_calls?: number;
  api_call_breakdown?: Record<string, number>;
}

export interface ApiCompanySignals {
  name?: string | null;
  summary?: string | null;
  keywords?: string[];
  services?: string[];
  technologies?: string[];
  flagship_services?: string[];
  target_industries?: string[];
  instagram_username?: string | null;
  instagram_url?: string | null;
  linkedin_url?: string | null;
  linkedin_username?: string | null;
}

export interface ApiCompanyProfile {
  name?: string | null;
  website?: string | null;
  description?: string | null;
  profile?: string | null;
  industry?: string | null;
  category?: string | null;
  niche?: string | null;
  business_model?: string | null;
  pricing_model?: string | null;
  target_audience?: string[];
  products?: string[];
  services?: string[];
  features?: string[];
  technologies?: string[];
  keywords?: string[];
  extracted_keywords?: string[];
  positioning?: string | null;
  value_proposition?: string | null;
  countries?: string[];
  country?: string | null;
  city?: string | null;
  region?: string | null;
  confidence?: number;
  source?: string | null;
  embeddings?: unknown[];
  company_signals?: ApiCompanySignals;
  target_industries?: string[];
  competitors_hint?: string[];
  instagram_username?: string | null;
  instagram_url?: string | null;
  linkedin_url?: string | null;
  linkedin_username?: string | null;
  flagship_services?: string[];
}

export interface ApiJobOpening {
  source?: string;
  snippet?: string;
  location?: string | null;
  job_title?: string;
  linkedin_url?: string | null;
}

export interface ApiSearchResultHit {
  url?: string;
  score?: number;
  title?: string;
  source?: string;
  snippet?: string;
}

export interface ApiCompanyIntelligence {
  name?: string;
  socials?: string[];
  website?: string | null;
  reasoning?: string;
  confidence?: number;
  competitors?: string[];
  search_results?: ApiSearchResultHit[];
}

export interface ApiCompanyAnalysis {
  name?: string | null;
  website?: string | null;
  description?: string | null;
  industry?: string | null;
  category?: string | null;
  niche?: string | null;
  region?: string | null;
  country?: string | null;
  city?: string | null;
  source?: string | null;
  business_model?: string | null;
  pricing_model?: string | null;
  positioning?: string | null;
  value_proposition?: string | null;
  confidence?: number;
  services?: string[];
  technologies?: string[];
  keywords?: string[];
  products?: string[];
  features?: string[];
  countries?: string[];
  target_audience?: string[];
  competitors_hint?: string[];
  detected_niche?: string | null;
  detected_category?: string | null;
  company_size?: string | null;
  employees?: ApiLinkedInEmployee[] | number;
  employee_count?: number;
  is_hiring?: boolean | null;
  job_openings?: ApiJobOpening[];
  company_dna?: ApiCompanyDna;
  intelligence?: ApiCompanyIntelligence;
  social_handles?: {
    instagram_username?: string;
    instagram_url?: string;
    linkedin_url?: string;
  };
  user_instagram?: ApiUserInstagram & Record<string, unknown>;
  user_linkedin?: ApiUserLinkedIn & Record<string, unknown>;
  instagram?: unknown;
  instagram_posts?: unknown[];
  linkedin_url?: string | null;
  linkedin_posts_url?: string | null;
  linkedin_analysis?: ApiUserLinkedIn["analysis"] & {
    b2b_signals?: string[];
    sample_posts?: unknown[];
    active_hiring?: boolean;
    positioning_focus?: string[];
    job_openings_count?: number;
    thought_leadership_posts?: number;
    signals?: string[];
  };
  linkedin_content_themes?: ApiLinkedInTheme[];
  embeddings?: unknown[];
}

export interface ApiSearchIntelligence {
  confidence?: number;
  company_name?: string;
  product_terms?: string[];
  audience_terms?: string[];
  excluded_terms?: string[];
  industry_terms?: string[];
  search_queries?: string[];
  search_keywords?: string[];
  alternative_names?: string[];
  competitor_patterns?: string[];
}

export interface ApiAiReport {
  summary?: string;
  company?: unknown;
  gap_analysis?: ApiGapAnalysis | Record<string, unknown>;
  competitor_gaps?: {
    summary?: string;
    services?: string[];
    technologies?: string[];
    content_types?: { content_type?: string; competitor_count?: number }[];
    business_signals?: { signal?: string; competitor_count?: number }[];
    review_platforms?: { platform?: string; competitor_count?: number }[];
    industries_targeted?: { industry?: string; competitor_count?: number }[];
  };
  recommendations?: ApiRecommendation[];
  competitor_count?: number;
  similarity_scores?: ApiSimilarityScore[];
  average_similarity?: ApiSimilarityBreakdown;
  competitor_intelligence_report?: ApiCompetitorIntelligenceReport;
}

export interface ApiGapAnalysis {
  service_gaps?: string[];
  keyword_gaps?: string[];
  technology_gaps?: string[];
  competitor_count?: number;
  summary?: string;
  dominant_competitor_formats?: { format: string; count: number }[];
  dominant_competitor_themes?: { theme: string; count: number }[];
  dominant_competitor_categories?: { category: string; count: number }[];
  content_profiles_analyzed?: number;
  websites_analyzed?: number;
}

export interface ApiRecommendation {
  type?: string;
  priority?: string;
  title?: string;
  detail?: string;
}

export interface ApiSimilarityScore {
  name?: string;
  username?: string | null;
  website?: string | null;
  similarity?: ApiSimilarityBreakdown;
  match_score?: number;
}

export interface ApiSwot {
  strengths?: string[];
  weaknesses?: string[];
  opportunities?: string[];
  threats?: string[];
}

export interface ApiAnalysisBundle {
  pipeline?: {
    order?: string[];
    stages?: unknown[];
    description?: string;
    platforms?: string[];
  };
  user_profile?: {
    company_understood?: boolean;
    website_crawled?: boolean;
    instagram_analyzed?: boolean;
    linkedin_analyzed?: boolean;
    services?: string[];
    technologies?: string[];
    detected_niche?: string;
    warnings?: string[];
  };
  company?: {
    name?: string;
    website?: string;
    industry?: string;
    description?: string;
    services?: string[];
    technologies?: string[];
    target_audience?: string[];
    region?: string;
    positioning?: string;
    value_proposition?: string;
  };
  swot?: ApiSwot;
  gaps?: { type?: string; item?: string; priority?: string }[];
  recommendations?: ApiRecommendation[];
  seo?: {
    keywords?: string[];
    keyword_gaps?: string[];
  };
  linkedin?: {
    scope?: string;
    user?: ApiUserLinkedIn;
    competitors?: ApiCompetitorLinkedInProfile[];
  };
  instagram?: ApiUserInstagram & {
    posts?: ApiCompetitorPost[];
    scope?: string;
  };
  competitors?: ApiCompetitorProfile[];
  similarity?: {
    average?: ApiSimilarityBreakdown;
    vs_competitors?: ApiSimilarityScore[];
  };
  marketing_strategy?: {
    positioning?: string;
    value_proposition?: string;
    target_audience?: string[];
    audience_terms?: string[];
    channels?: string[];
    dominant_market_themes?: (string | { theme: string; count: number })[];
    dominant_market_hashtags?: (string | { tag: string; count: number })[];
    marketing_similarity_avg?: number;
    thought_leadership_score?: number;
  };
  technology?: {
    user_technologies?: string[];
    technologies_mentioned?: string[];
    technology_gaps?: string[];
    competitor_technologies?: string[];
  };
  business_signals?: unknown;
  reviews?: unknown;
  content_strategy?: unknown;
  website?: {
    url?: string;
    web_crawl?: unknown;
    intelligence?: unknown;
    competitor_sites?: unknown[];
  };
}

export interface ApiCompetitorIntelligenceReport {
  user_company?: {
    name?: string;
    website?: string;
    industry?: string;
    services?: string[];
    technologies?: string[];
    target_audience?: string[];
    region?: string;
  };
  competitor_count?: number;
  similarity_vs_competitors?: ApiSimilarityScore[];
  average_similarity?: ApiSimilarityBreakdown;
  gaps?: {
    services?: string[];
    technologies?: string[];
    summary?: string;
    content_types?: { content_type?: string; competitor_count?: number }[];
    business_signals?: { signal?: string; competitor_count?: number }[];
    review_platforms?: { platform?: string; competitor_count?: number }[];
    industries_targeted?: { industry?: string; competitor_count?: number }[];
  };
  linkedin_analysis?: {
    user?: ApiUserLinkedIn & ApiCompetitorLinkedInProfile;
    competitors?: ApiCompetitorLinkedInProfile[];
  };
  business_signals?: unknown;
  review_intelligence?: unknown;
  summary?: string;
}

export interface CompetitorAnalysisResponse {
  success: boolean;
  error?: string | null;
  summary?: string;
  company?: ApiCompany;
  company_social_analysis?: ApiCompanySocialAnalysis;
  filters_applied?: ApiFiltersApplied;
  matching_mode?: string;
  discovery_warnings?: string[];
  competitor_intelligence?: unknown;
  competitor_count?: number;
  post_count?: number;
  competitors?: ApiCompetitorProfile[];
  analysis?: ApiAnalysisBundle;
  market_insights?: ApiMarketInsights;
  meta?: ApiMeta;
  company_profile?: ApiCompanyProfile;
  search_intelligence?: ApiSearchIntelligence;
  gap_analysis?: ApiGapAnalysis | Record<string, never>;
  company_analysis?: ApiCompanyAnalysis;
  competitor_intelligence_report?: ApiCompetitorIntelligenceReport | Record<string, never>;
  recommendations?: ApiRecommendation[];
  ai_report?: ApiAiReport;
  similarity_scores?: ApiSimilarityScore[];
  competitor_website_intel?: unknown[];
  web_crawl?: Record<string, unknown> | unknown;
}

/** Latest saved competitor analysis from GET /competitor-analysis/results */
export type CompetitorAnalysisResultsResponse = CompetitorAnalysisResponse;

/** List payload from GET /competitor-analysis/results/all */
export interface CompetitorAnalysisResultsAllResponse {
  success: boolean;
  count?: number;
  total?: number;
  limit?: number;
  offset?: number;
  results: CompetitorAnalysisResponse[];
  error?: string | null;
}
