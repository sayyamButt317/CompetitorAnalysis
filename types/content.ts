export type ContentMediaType = "reel" | "carousel" | "image";

export type ContentTab = "all" | "reel" | "image" | "carousel" | "top";

export interface ContentListItem {
  analysis_id?: string;
  prompt_id?: string;
  created_at?: string;
  company_name?: string;
  username?: string;
  competitor_name?: string;
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

export interface ContentListResponse {
  success: boolean;
  analysis_id?: string | null;
  analysis_count?: number;
  count?: number;
  content?: ContentListItem[];
  error?: string;
}

export interface ContentPost {
  id: string;
  username: string;
  competitorName: string;
  handle: string;
  caption: string;
  title: string;
  type: ContentMediaType;
  typeLabel: string;
  likes: number;
  comments: number;
  engagementRate: number;
  postedDate: string;
  postedAgo: string;
  hashtags: string[];
  mediaUrl?: string;
  thumbnailUrl?: string;
  permalink?: string;
  gradient: string;
  timestamp?: string;
}

export interface ContentStatMetric {
  id: string;
  label: string;
  value: string;
  subtitle: string;
  icon: "posts" | "reels" | "images" | "carousels" | "engagement" | "rate";
}

export interface ContentPageData {
  company: {
    name: string;
    subtitle: string;
    logoInitials: string;
  };
  dateRange: string;
  stats: ContentStatMetric[];
  posts: ContentPost[];
  analysisCount: number;
  totalCount: number;
}
