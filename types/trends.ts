import type { BarChartItem, ChartSegment, HashtagItem, StatMetric } from "@/types/dashboard";

export interface TrendNewsItem {
  title: string;
  url?: string;
  source?: string;
}

export interface TrendGroupItem {
  group_type?: string;
  key: string;
  post_count?: number;
  source_count?: number;
  source?: string;
  trend_score?: number;
  geo?: string;
  geo_label?: string;
  approx_traffic?: string;
  traffic_score?: number;
  published_at?: string;
  news_items?: TrendNewsItem[];
  type?: string;
  query_type?: string;
  explore_url?: string;
}

export interface GoogleTrendItem {
  topic?: string;
  key: string;
  query?: string;
  geo?: string;
  geo_label?: string;
  approx_traffic?: string;
  traffic_score?: number;
  value_score?: number | null;
  formatted_value?: string | null;
  published_at?: string;
  news_items?: TrendNewsItem[];
  seed_keyword?: string | null;
  source?: string;
  type?: string;
  query_type?: string;
  explore_url?: string;
  rising_score?: number;
}

export interface BreakdownReelFormat {
  name: string;
  category?: string;
}

export interface BreakdownHashtag {
  tag: string;
  post_count?: number;
  hashtag?: string;
  source?: string;
  type?: string;
}

export interface BreakdownTopic {
  topic: string;
  upvotes?: number | null;
  key?: string;
  source?: string;
  type?: string;
}

export interface BreakdownGoogleTrend {
  topic: string;
  geo?: string;
  key?: string;
}

export interface SourceBreakdownCounts {
  reel_formats?: number;
  hashtags?: number;
  topics?: number;
  google_trends?: number;
  total?: number;
}

export interface SourceBreakdownItem {
  source: string;
  platform?: string;
  url?: string;
  weight?: number;
  counts?: SourceBreakdownCounts;
  reel_formats?: BreakdownReelFormat[];
  hashtags?: BreakdownHashtag[];
  topics?: BreakdownTopic[];
  google_trends?: BreakdownGoogleTrend[];
}

export interface CountryGoogleTrends {
  geo: string;
  label: string;
  explore_url?: string;
  trending_url?: string;
  top_queries?: GoogleTrendItem[];
  rising_queries?: GoogleTrendItem[];
  all_queries?: GoogleTrendItem[];
  explore_api_available?: boolean;
  top_count?: number;
  rising_count?: number;
}

export interface CountryQueryBundle {
  geo?: string;
  country?: string;
  queries?: GoogleTrendItem[];
  count?: number;
  explore_url?: string;
  trending_url?: string;
}

export interface WebTrendReelFormat {
  name: string;
  category?: string;
  source?: string;
  type?: string;
}

export interface WebTrendsData {
  reel_formats?: WebTrendReelFormat[];
  hashtags?: TrendHashtagItem[];
  topics?: TrendTopicItem[];
  google_trends?: GoogleTrendItem[];
  trend_scores?: TrendGroupItem[];
  source_count?: number;
  source_breakdown?: SourceBreakdownItem[];
  google_trends_by_country?: Record<string, CountryGoogleTrends>;
  top_queries_by_country?: Record<string, CountryQueryBundle>;
  rising_queries_by_country?: Record<string, CountryQueryBundle>;
  songs?: unknown[];
}

export interface TrendHashtagItem {
  hashtag?: string;
  tag?: string;
  post_count?: number;
  source_count?: number;
  sources?: string[];
  source?: string;
  type?: string;
}

export interface TrendTopicItem {
  topic?: string;
  key?: string;
  source?: string;
  type?: string;
}

export interface PlatformSummaryItem {
  source_count: number;
  total_items: number;
  sources: string[];
  highlights: string[];
}

export interface PlatformSummary {
  google?: PlatformSummaryItem;
  x?: PlatformSummaryItem;
  reddit?: PlatformSummaryItem;
  linkedin?: PlatformSummaryItem;
  web?: PlatformSummaryItem;
  facebook?: PlatformSummaryItem;
  tavily?: PlatformSummaryItem;
}

export interface PlatformTrendsBundle {
  platform: string;
  source_count: number;
  post_count: number;
  total_items: number;
  sources: string[];
  topics: TrendTopicItem[];
  hashtags: TrendHashtagItem[];
  reel_formats: WebTrendReelFormat[];
}

export interface ViralCategory {
  category: string;
  source?: string;
  type?: string;
}

export interface TrendMeta {
  status?: string;
  duration_sec?: number;
  timestamp?: string;
  platform?: string;
  discovery_source?: string;
  agent_mode?: string;
}

export interface CompanyBasedTrendsRequest {
  company_data: string;
  region: string;
  instausername?: string;
  linkedinusername?: string;
  xusername?: string;
  facebookusername?: string;
  redditusername?: string;
  competitors?: string[];
  competitor_limit?: number;
  include_web_trends?: boolean;
}

export interface GlobalTrendsResponse {
  success: boolean;
  error?: string | null;
  mode?: string;
  company?: unknown;
  company_analysis?: unknown;
  detected_niche?: string | null;
  niche_keywords?: string[];
  company_posts?: unknown[];
  summary?: string;
  post_count?: number;
  competitor_count?: number;
  discovery_source?: string;
  web_sources?: string[];
  source_breakdown?: SourceBreakdownItem[];
  platform_summary?: PlatformSummary;
  reddit_trends?: PlatformTrendsBundle;
  x_trends?: PlatformTrendsBundle;
  linkedin_trends?: PlatformTrendsBundle;
  linkedin_posts?: unknown[];
  linkedin_content_themes?: unknown[];
  linkedin_pain_points?: unknown[];
  pain_points?: unknown[];
  audience_pain_points?: unknown[];
  audience_needs?: unknown[];
  instagram_insights?: unknown;
  instagram_niche_analysis?: unknown;
  analysis_warnings?: string[];
  warnings?: string[];
  tavily_skipped?: boolean;
  hashtags?: TrendHashtagItem[];
  topics?: TrendTopicItem[];
  web_trends?: WebTrendsData;
  trending_hashtags?: TrendGroupItem[];
  trending_topics?: TrendGroupItem[];
  trending_reel_formats?: TrendGroupItem[];
  trending_reels?: unknown[];
  trending_songs?: unknown[];
  google_trends?: GoogleTrendItem[];
  google_trends_by_country?: Record<string, CountryGoogleTrends>;
  top_queries_by_country?: Record<string, CountryQueryBundle>;
  rising_queries_by_country?: Record<string, CountryQueryBundle>;
  trend_scores?: TrendGroupItem[];
  viral_posts?: unknown[];
  viral_sounds?: unknown[];
  viral_categories?: ViralCategory[];
  market_insights?: unknown;
  competitor_strategies?: unknown;
  discovered_competitors?: unknown[];
  meta?: TrendMeta;
  saved_trend_id?: string;
}

export type TrendTab =
  | "all"
  | "google"
  | "hashtags"
  | "topics"
  | "reels"
  | "reddit"
  | "x"
  | "facebook"
  | "linkedin"
  | "web"
  | "tavily";

export type PlatformId =
  | "google"
  | "reddit"
  | "x"
  | "facebook"
  | "linkedin"
  | "web"
  | "tavily"
  | "instagram";

export interface TrendTableRow {
  id: string;
  rank: number;
  title: string;
  type: TrendTab;
  typeLabel: string;
  source: string;
  platform: string;
  platformId: PlatformId;
  score: number;
  metric: string;
  country?: string;
  url?: string;
  sourceUrl?: string;
}

export interface PlatformSection {
  id: PlatformId;
  label: string;
  color: string;
  sourceCount: number;
  totalSignals: number;
  items: PlatformTrendItem[];
  emptyMessage?: string;
}

export interface PlatformTrendItem {
  id: string;
  title: string;
  type: string;
  source: string;
  metric?: string;
  url?: string;
}

export interface GoogleTrendRow {
  rank: number;
  title: string;
  country: string;
  countryCode: string;
  traffic: string;
  queryType: string;
  exploreUrl?: string;
  newsTitle?: string;
  newsUrl?: string;
  newsSource?: string;
}

export interface CountryTrendSection {
  countryCode: string;
  country: string;
  exploreUrl?: string;
  trendingUrl?: string;
  topQueries: GoogleTrendRow[];
  risingQueries: GoogleTrendRow[];
}

export interface ReelFormatRow {
  rank: number;
  name: string;
  source: string;
  sourceUrl?: string;
  platform: string;
  platformId: PlatformId;
  score: number;
}

export interface PlatformStatRow {
  id: string;
  label: string;
  count: number;
  sourceCount: number;
  percentage: number;
  color: string;
}

export interface TrendStatMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  icon: "hashtags" | "topics" | "reels" | "google";
  sparkline: number[];
  accent: string;
}

export interface TrendRankedItem {
  rank: number;
  label: string;
  displayLabel: string;
  metric: string;
  sublabel?: string;
  typeLabel?: string;
  sourceName?: string;
  sourceUrl?: string;
  verifyUrl?: string;
  trendScore: number;
  sparkline: number[];
}

export interface TrendCountryItem {
  code: string;
  name: string;
  trendCount: number;
}

export interface TrendGoogleCard {
  rank: number;
  title: string;
  country: string;
  countryCode: string;
  traffic: string;
  timeAgo: string;
  exploreUrl?: string;
  newsTitle?: string;
  newsSource?: string;
  newsUrl?: string;
}

export interface TrendNewsEntry {
  id: string;
  time: string;
  platform: string;
  title: string;
  traffic: string;
  url?: string;
}

export interface TrendPlatformShare {
  platform: string;
  percentage: number;
  color: string;
  url?: string;
}

export interface TrendWebSource {
  name: string;
  category: "social_tool" | "platform" | "search" | "content" | "other";
  url?: string;
  platform?: string;
}

export interface TrendsPageData {
  company: { name: string; logoInitials: string; subtitle?: string };
  lastUpdated: string;
  summary: string;
  sourceCount: number;
  savedTrendId?: string;
  stats: TrendStatMetric[];
  hashtags: TrendRankedItem[];
  topics: TrendRankedItem[];
  reelFormats: TrendRankedItem[];
  allTrendScores: TrendRankedItem[];
  webSources: TrendWebSource[];
  sourceBreakdown: TrendPlatformShare[];
  topCountries: TrendCountryItem[];
  insights: string[];
  recommendations: string[];
  googleTrends: TrendGoogleCard[];
  newsTimeline: TrendNewsEntry[];
  platformBreakdown: TrendPlatformShare[];
  platformSections: PlatformSection[];
}

export interface RegionTrendRequest {
  region: string;
  company_data?: string;
}

export type RegionTrendResponse = GlobalTrendsResponse;

export interface NicheTrendRequest {
  company_data?: string;
  region?: string;
  competitors?: string[];
}

export type NicheTrendResponse = GlobalTrendsResponse;

export interface TrendRunSummary {
  trend_id: string;
  created_at?: string;
  summary?: string;
  duration_sec?: number;
  success?: boolean;
  status?: string;
  platform?: string;
  country?: string | null;
  category?: string | null;
  discovery_source?: string;
  post_count?: number;
  viral_post_count?: number;
}

export interface TrendListResponse {
  success: boolean;
  count: number;
  trends: TrendRunSummary[];
}

export interface TrendAnalyticsOverview {
  company_name?: string | null;
  detected_category?: string | null;
  region?: string | null;
  platform?: string;
  country?: string | null;
  category?: string | null;
  discovery_source?: string;
  post_count?: number;
  viral_post_count?: number;
  duration_sec?: number;
  summary?: string;
  created_at?: string;
  status?: string;
  success?: boolean;
}

export interface TrendViralPost {
  id?: string;
  username?: string;
  name?: string;
  caption?: string;
  likes?: number;
  like_count?: number;
  comments?: number;
  comments_count?: number;
  engagement_rate?: number;
  growth_rate?: number;
  permalink?: string;
  media_url?: string;
  thumbnail_url?: string;
  is_reel?: boolean;
  timestamp?: string;
  category?: string | null;
  trend_id?: string;
  followers?: number;
  interactions?: number;
}

export interface TrendHashtagAggregate {
  tag: string;
  count: number;
}

export interface TrendAnalyticsResponse {
  success: boolean;
  trend_id?: string;
  overview?: TrendAnalyticsOverview;
  trend_scores?: TrendGroupItem[];
  viral_posts?: TrendViralPost[];
  viral_sounds?: unknown[];
  viral_categories?: unknown[];
  hashtags?: TrendHashtagAggregate[];
  topics?: unknown[];
  discovered_influencers?: unknown[];
  audio_summary?: unknown;
  competitor_strategies?: unknown;
  market_insights?: unknown;
  recent_runs?: TrendRunSummary[];
}

export interface ListOfHashtagsResponse {
  success: boolean;
  trend_id?: string;
  run_count?: number;
  total_unique?: number;
  hashtags?: TrendHashtagAggregate[];
  by_run?: unknown[];
}

export interface ViralPostsResponse {
  success: boolean;
  trend_id?: string;
  run_count?: number;
  count?: number;
  viral_posts?: TrendViralPost[];
}

export interface TrendScoresResponse {
  success: boolean;
  trend_id?: string;
  run_count?: number;
  count?: number;
  trend_scores?: TrendGroupItem[];
}

export interface FetchTrendDataOptions {
  trendId?: string;
}
