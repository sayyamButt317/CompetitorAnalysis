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
  matchScore?: number;
  website?: string;
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

export interface CompanyProfileView {
  name: string;
  industry?: string;
  niche?: string;
  description?: string;
  positioning?: string;
  valueProposition?: string;
  region?: string;
  services: string[];
  technologies: string[];
  keywords: string[];
  targetAudience: string[];
  instagramUrl?: string;
  linkedinUrl?: string;
  website?: string;
}

export interface CompanyInstagramView {
  username?: string;
  name?: string;
  bio?: string;
  followers: number;
  postCount: number;
  avgEngagement: number;
  primaryFormat?: string;
  primaryCategory?: string;
  niche?: string;
  topHashtags: string[];
  mediaMix: ChartSegment[];
}

export interface CompanyLinkedInView {
  url?: string;
  postCount: number;
  employeeCount: number;
  followers?: number;
  isHiring: boolean;
  thoughtLeadershipScore: number;
  industry?: string;
  specialties: string[];
  businessSignals: string[];
  themes: { theme: string; count: number }[];
  employees: { name: string; designation: string; url?: string }[];
  jobOpenings: { title: string; location?: string; url?: string; snippet?: string }[];
  warnings: string[];
  skipped?: boolean;
}

export interface SearchIntelligenceView {
  companyName?: string;
  confidence?: number;
  searchKeywords: string[];
  searchQueries: string[];
  industryTerms: string[];
  productTerms: string[];
  audienceTerms: string[];
  competitorPatterns: string[];
  alternativeNames: string[];
  excludedTerms: string[];
}

export interface CompetitorLinkedInRow {
  name: string;
  url?: string;
  followers: number;
  employeeCount: number;
  postCount: number;
  isHiring: boolean;
  thoughtLeadershipScore: number;
  industry?: string;
  businessSignals: string[];
  themes: string[];
}

export interface RecommendationItem {
  type: string;
  priority: "high" | "medium" | "low";
  title: string;
  detail: string;
}

export interface GapAnalysisView {
  summary?: string;
  serviceGaps: string[];
  technologyGaps: string[];
  keywordGaps: string[];
  formats: ChartSegment[];
  themes: ChartSegment[];
  categories: ChartSegment[];
  competitorCount?: number;
  contentProfilesAnalyzed?: number;
  websitesAnalyzed?: number;
}

export interface SimilarityRow {
  name: string;
  username?: string;
  website?: string;
  overall: number;
  services: number;
  technology: number;
  marketing: number;
  content: number;
  location: number;
}

export interface SwotView {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface DashboardData {
  company: {
    name: string;
    subtitle: string;
    logoInitials: string;
  };
  lastUpdated: string;
  summary?: string;
  stats: StatMetric[];
  topCompetitors: CompetitorRow[];
  engagementShare: ChartSegment[];
  contentTypes: ChartSegment[];
  contentThemes: ChartSegment[];
  contentCategories: ChartSegment[];
  postingActivity: BarChartItem[];
  hashtags: HashtagItem[];
  trendingTopics: string[];
  engagementTrend: LineChartPoint[];
  comparisonCompetitors: { handle: string; name: string }[];
  comparisonMetrics: ComparisonMetric[];
  aiInsights: string[];
  topPosts: SocialPost[];
  competitorPosts: CompetitorPostsGroup[];
  companyProfile?: CompanyProfileView;
  companyInstagram?: CompanyInstagramView;
  companyLinkedIn?: CompanyLinkedInView;
  competitorLinkedIn: CompetitorLinkedInRow[];
  recommendations: RecommendationItem[];
  gapAnalysis?: GapAnalysisView;
  similarityScores: SimilarityRow[];
  swot?: SwotView;
  searchIntelligence?: SearchIntelligenceView;
  discoveryReasoning?: string;
  analysisError?: string | null;
  discoveryWarnings: string[];
  analysisSuccess: boolean;
}
