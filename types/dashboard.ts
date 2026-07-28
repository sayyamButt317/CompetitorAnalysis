export interface NavItem {
  id: string;
  label: string;
  href: string;
  active?: boolean;
}

export interface StatMetric {
  id: string;
  label: string;
  value: string;
  subtitle: string;
  iconVariant: "competitors" | "posts" | "engagement" | "calendar";
}

export interface CompetitorRow {
  rank: number;
  handle: string;
  name: string;
  followers: number;
  avgEngagement: number;
  posts: number;
  growth: number;
  imageUrl?: string;
}

export interface ChartSegment {
  label: string;
  value: number;
  color: string;
}

export interface BarChartItem {
  label: string;
  value: number;
}

export interface LineChartPoint {
  label: string;
  value: number;
}

export interface HashtagItem {
  tag: string;
  count: number;
  maxCount: number;
}

export interface ComparisonMetric {
  label: string;
  values: (string | number)[];
}

export interface SocialPost {
  id: string;
  handle: string;
  name: string;
  title: string;
  type: "reel" | "carousel" | "image";
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
  postedAgo: string;
  gradient: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  permalink?: string;
}

export interface CompetitorPostsGroup {
  handle: string;
  name: string;
  posts: SocialPost[];
}

export interface DashboardData {
  company: {
    name: string;
    subtitle: string;
    logoInitials: string;
  };
  lastUpdated: string;
  stats: StatMetric[];
  topCompetitors: CompetitorRow[];
  engagementShare: ChartSegment[];
  contentTypes: ChartSegment[];
  contentThemes: ChartSegment[];
  postingActivity: BarChartItem[];
  hashtags: HashtagItem[];
  trendingTopics: string[];
  engagementTrend: LineChartPoint[];
  comparisonCompetitors: { handle: string; name: string }[];
  comparisonMetrics: ComparisonMetric[];
  aiInsights: string[];
  topPosts: SocialPost[];
  competitorPosts: CompetitorPostsGroup[];
}
