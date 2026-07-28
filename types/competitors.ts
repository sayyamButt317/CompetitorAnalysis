import type { ChartSegment, CompetitorRow, HashtagItem, StatMetric } from "@/types/dashboard";

export interface CompetitorListContentStrategy {
  themes?: { theme: string; count: number; share_pct?: number }[];
  post_count?: number;
  media_types?: { type: string; count: number; share_pct?: number }[];
  top_hashtags?: string[];
  caption_style?: Record<string, number>;
  content_focus?: string;
  primary_format?: string;
  content_categories?: { category: string; count: number; share_pct?: number }[];
  avg_engagement_rate?: number;
  best_performing_format?: {
    format?: string;
    post_count?: number;
    avg_engagement_rate?: number;
  };
  primary_content_category?: string;
}

export interface CompetitorListItem {
  analysis_id?: string;
  prompt_id?: string;
  created_at?: string;
  company_name?: string;
  username?: string;
  name?: string;
  followers?: number;
  profile_url?: string;
  profile_picture_url?: string;
  image_url?: string;
  bio?: string;
  website?: string | null;
  discovered_by?: string;
  match_score?: number;
  match_reasons?: string[];
  content_strategy?: CompetitorListContentStrategy;
  post_count?: number;
}

export interface CompetitorsListResponse {
  success: boolean;
  analysis_id?: string | null;
  analysis_count?: number;
  count?: number;
  competitors?: CompetitorListItem[];
  error?: string;
}

export interface CompetitorDetailRow {
  username: string;
  handle: string;
  name: string;
  imageUrl?: string;
  followers: number;
  posts: number;
  avgEngagement: number;
  reelsPct: string;
  carouselPct: string;
  imagePct: string;
  videoPct: string;
  primaryTheme: string;
  primaryFormat: string;
  primaryCategory: string;
  matchScore: number;
  profileUrl?: string;
}

export interface CompetitorsPageData {
  company: {
    name: string;
    subtitle: string;
    logoInitials: string;
  };
  lastUpdated: string;
  stats: StatMetric[];
  topCompetitors: CompetitorRow[];
  contentTypes: ChartSegment[];
  contentThemes: ChartSegment[];
  hashtags: HashtagItem[];
  trendingTopics: string[];
  competitorDetails: CompetitorDetailRow[];
  aiInsights: string[];
}
