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
}

export interface TrendNewsItem {
  title: string;
  url?: string;
  source?: string;
}

export interface GoogleTrendItem {
  topic?: string;
  key: string;
  geo?: string;
  geo_label?: string;
  approx_traffic?: string;
  traffic_score?: number;
  published_at?: string;
  news_items?: TrendNewsItem[];
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

export interface GlobalTrendsResponse {
  success: boolean;
  error?: string | null;
  mode?: string;
  company?: unknown;
  summary?: string;
  post_count?: number;
  competitor_count?: number;
  discovery_source?: string;
  web_sources?: string[];
  warnings?: string[];
  tavily_skipped?: boolean;
  trending_hashtags?: TrendGroupItem[];
  trending_topics?: TrendGroupItem[];
  trending_reel_formats?: TrendGroupItem[];
  trending_songs?: unknown[];
  google_trends?: GoogleTrendItem[];
  trending_reels?: unknown[];
  trend_scores?: TrendGroupItem[];
  viral_posts?: unknown[];
  viral_sounds?: unknown[];
  viral_categories?: { category: string; source?: string; type?: string }[];
  hashtags?: TrendGroupItem[];
  topics?: TrendGroupItem[];
  web_trends?: Record<string, unknown>;
  market_insights?: unknown;
  competitor_strategies?: unknown;
  discovered_competitors?: { username?: string; name?: string; source?: string }[];
  meta?: TrendMeta;
  saved_trend_id?: string;
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
}

export interface TrendWebSource {
  name: string;
  category: "social_tool" | "platform" | "search" | "content" | "other";
}

export interface TrendsPageData {
  company: { name: string; logoInitials: string };
  lastUpdated: string;
  summary: string;
  sourceCount: number;
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
}
