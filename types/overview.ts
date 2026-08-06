import type {
  ChartSegment,
  GapAnalysisView,
  LineChartPoint,
  RecommendationItem,
  SearchIntelligenceView,
  SimilarityRow,
  SwotView,
} from "@/types/dashboard";

export interface OverviewSocialLink {
  label: string;
  href: string;
  kind: "instagram" | "linkedin" | "website";
}

export interface OverviewHeroData {
  name: string;
  initials: string;
  badge?: string;
  industry?: string;
  niche?: string;
  region?: string;
  foundedHint?: string;
  description?: string;
  positioning?: string;
  valueProposition?: string;
  socialLinks: OverviewSocialLink[];
}

export interface OverviewMetricCard {
  id: string;
  label: string;
  value: string;
  hint?: string;
  trend?: string;
  trendPositive?: boolean;
  accent?: "indigo" | "emerald" | "amber" | "sky";
}

export interface OverviewDnaColumn {
  id: string;
  title: string;
  variant: "checklist" | "tags";
  items: string[];
  moreLabel?: string;
}

export interface OverviewMediaPost {
  id: string;
  caption: string;
  mediaType: string;
  isVideo: boolean;
  mediaUrl?: string;
  thumbnailUrl?: string;
  permalink?: string;
  likes: number;
  comments: number;
  views?: number;
  engagementRate?: number;
  hashtags: string[];
  timestamp?: string;
  ownerHandle?: string;
  ownerName?: string;
}

export interface OverviewInstagramSection {
  username?: string;
  name?: string;
  bio?: string;
  website?: string;
  niche?: string;
  followers: number;
  postCount: number;
  avgEngagement: number;
  totalInteractions: number;
  primaryFormat?: string;
  primaryCategory?: string;
  contentFocus?: string;
  bestFormat?: string;
  bestFormatEngagement?: number;
  postingFrequency?: {
    postsPerWeek?: number;
    avgDaysBetween?: number;
    dateRangeDays?: number;
  };
  captionStyle?: {
    avgLength?: number;
    questionPct?: number;
    ctaPct?: number;
    emojiPct?: number;
  };
  nicheKeywords: string[];
  contentCategories: { label: string; share: number }[];
  engagementTrend: LineChartPoint[];
  mediaMix: ChartSegment[];
  topHashtags: string[];
  posts: OverviewMediaPost[];
}

export interface OverviewLinkedInSection {
  url?: string;
  postsUrl?: string;
  employeeCount: number;
  postCount: number;
  avgPostLength?: number;
  isHiring: boolean;
  openRoles: number;
  thoughtLeadershipLabel: string;
  thoughtLeadershipScore: number;
  thoughtLeadershipPosts?: number;
  isThoughtLeader: boolean;
  companySize?: string;
  industry?: string;
  tagline?: string;
  headquarters?: string;
  website?: string;
  followers?: number;
  specialties: string[];
  signalFlags: { label: string; active: boolean }[];
  positioningFocus: string[];
  businessSignals: string[];
  themes: { theme: string; count: number; share: number }[];
  employees: { name: string; designation: string; url?: string; initials: string; source?: string }[];
  samplePosts: { text: string; url?: string; source?: string }[];
  jobOpenings: { title: string; location?: string; url?: string; snippet?: string }[];
  hiringSignals: string[];
  warnings: string[];
}

export interface OverviewWebsiteSection {
  url?: string;
  pagesLabel: string;
  blogLabel: string;
  servicesLabel: string;
  ctaLabel: string;
  topPages: { path: string; value: number }[];
  technologies: string[];
  seoMetrics: { label: string; value: string; score: number }[];
  seoKeywords: string[];
  seoKeywordGaps: string[];
  seoIndustryTerms: string[];
  seoProductTerms: string[];
  seoAudienceTerms: string[];
  seoCompetitorPatterns: string[];
  seoSearchQueries: string[];
  webCrawlAvailable: boolean;
  available: boolean;
}

export interface OverviewCompetitorCard {
  id: string;
  name: string;
  initials: string;
  matchPct?: number;
  industry?: string;
  region?: string;
  href?: string;
  imageUrl?: string;
}

export interface OverviewExecutiveCompetitorHighlight {
  id: string;
  name: string;
  username?: string;
  relevanceScore: number;
  primaryFormat?: string;
  formatShare?: number;
  topTheme?: string;
  themeShare?: number;
  contentCategory?: string;
  categoryShare?: number;
  profileUrl?: string;
  imageUrl?: string;
}

export interface OverviewExecutiveBrief {
  companyName: string;
  industry?: string;
  region?: string;
  competitorCount: number;
  postCount: number;
  matchingMode?: string;
  competitors: OverviewExecutiveCompetitorHighlight[];
}

export interface OverviewCompetitorDetail {
  id: string;
  name: string;
  username?: string;
  initials: string;
  imageUrl?: string;
  profileUrl?: string;
  website?: string;
  linkedinUrl?: string;
  bio?: string;
  followers: number;
  postCount: number;
  avgEngagement: number;
  matchScore?: number;
  matchReasons: string[];
  regionMatch: boolean;
  nicheMatch: boolean;
  authenticity?: string;
  discoveredBy?: string;
  linkedinUsername?: string;
  socialWarnings: string[];
  hiringSignals: string[];
  primaryFormat?: string;
  primaryCategory?: string;
  contentFocus?: string;
  bestFormat?: string;
  employeeCount: number;
  isHiring: boolean;
  companySize?: string;
  thoughtLeadershipScore: number;
  mediaMix: ChartSegment[];
  topHashtags: string[];
  contentThemes: string[];
  captionStyle?: {
    avgLength?: number;
    questionPct?: number;
    ctaPct?: number;
    emojiPct?: number;
  };
  similarity: {
    overall: number;
    services: number;
    technology: number;
    marketing: number;
    content: number;
    location: number;
    industry: number;
    pricing: number;
    products: number;
    audience: number;
    businessModel: number;
    positioning: number;
    geography: number;
    socialStrategy: number;
    contentStrategy: number;
    explanation?: string;
  };
  posts: OverviewMediaPost[];
  employees: { name: string; designation: string; url?: string }[];
  jobOpenings: { title: string; location?: string; url?: string }[];
  linkedinThemes: string[];
  linkedinSamplePosts: { text: string; url?: string }[];
}

export interface OverviewComparisonRow {
  label: string;
  you: string;
  competitors: string[];
}

export interface OverviewMarketInsights {
  topics: { topic: string; postCount?: number; creatorCount?: number }[];
  topHashtags: { tag: string; count: number }[];
  hashtagSummary: { tag: string; postCount: number; creatorCount: number }[];
  contentSummary?: string;
  mostUsedFormat?: string;
  mostUsedCategory?: string;
  dominantFormats: ChartSegment[];
  dominantThemes: ChartSegment[];
  dominantCategories: ChartSegment[];
  insights: string[];
}

export interface OverviewRunMeta {
  matchingMode?: string;
  region?: string;
  competitorLimit?: number;
  candidatePoolSize?: number;
  verifiedCount?: number;
  discoverySource?: string;
  competitorCount: number;
  postCount: number;
  postLimit?: number;
  analysisId?: string;
  promptId?: string;
  agentMode?: string;
  status?: string;
  serverless?: boolean;
  platforms: string[];
  durationSec?: number;
  skipLinkedIn?: boolean;
  timestamp?: string;
  selectedCompetitors: string[];
  apiCalls: { label: string; count: number }[];
  callBreakdown: { label: string; count: number }[];
}

export interface OverviewPriorityGap {
  item: string;
  type: string;
  priority: string;
}

export interface OverviewSignalParty {
  name: string;
  activeSignals: string[];
}

export interface OverviewBusinessSignals {
  yourSignals: string[];
  competitorOnlySignals: string[];
  marketPrevalence: { signal: string; count: number }[];
  competitors: OverviewSignalParty[];
}

export interface OverviewReviewIntel {
  yourPlatforms: string[];
  hasReviews: boolean;
  gaps: { platform: string; competitorCount: number }[];
  marketPresence: { platform: string; competitorCount: number }[];
  competitors: { name: string; platforms: string[] }[];
}

export interface OverviewTechnologyIntel {
  yourTechnologies: string[];
  technologyGaps: string[];
  technologiesMentioned: string[];
  competitorTechnologies: string[];
}

export interface OverviewMarketingIntel {
  channels: string[];
  positioning?: string;
  valueProposition?: string;
  targetAudience: string[];
  audienceTerms: string[];
  dominantThemes: { theme: string; count: number }[];
  dominantHashtags: { tag: string; count: number }[];
  marketingSimilarityAvg?: number;
  thoughtLeadershipScore?: number;
}

export interface OverviewContentStrategyIntel {
  contentTypeGaps: { type: string; competitorCount: number }[];
  yourThemes: string[];
  yourHashtags: string[];
  competitorProfiles: {
    username?: string;
    primaryFormat?: string;
    primaryCategory?: string;
    avgEngagement: number;
    postCount: number;
    topHashtags: string[];
  }[];
}

export interface OverviewCompetitorGaps {
  summary?: string;
  services: string[];
  technologies: string[];
  contentTypes: { type: string; competitorCount: number }[];
  businessSignals: { signal: string; competitorCount: number }[];
  reviewPlatforms: { platform: string; competitorCount: number }[];
  industriesTargeted: { industry: string; competitorCount: number }[];
}

export interface OverviewWebsiteIntelCard {
  id: string;
  name: string;
  website?: string;
  username?: string;
  companyName?: string;
  description?: string;
  positioning?: string;
  businessModel?: string;
  pricingModel?: string;
  confidence?: number;
  services: string[];
  technologies: string[];
  products: string[];
  industries: string[];
  targetAudience: string[];
  keywords: string[];
  features: string[];
  socialLinks: string[];
}

export interface OverviewPipelineStatus {
  companyUnderstood: boolean;
  websiteCrawled: boolean;
  instagramAnalyzed: boolean;
  linkedinAnalyzed: boolean;
  detectedNiche?: string;
  warnings: string[];
  services: string[];
  technologies: string[];
}

export interface OverviewAverageSimilarity {
  overall: number;
  services: number;
  technology: number;
  marketing: number;
  content: number;
  location: number;
  industry: number;
  pricing: number;
  targetAudience: number;
  products?: number;
  audience?: number;
  businessModel?: number;
  positioning?: number;
  geography?: number;
  socialStrategy?: number;
  contentStrategy?: number;
}

export interface OverviewCompanyExtras {
  businessModel?: string;
  pricingModel?: string;
  confidence?: number;
  city?: string;
  country?: string;
  source?: string;
  linkedinUsername?: string;
  competitorsHint: string[];
  targetIndustries: string[];
  countries: string[];
  companySignals: string[];
  extractedKeywords: string[];
  flagshipServices: string[];
  audiencePainPoints: string[];
  services: string[];
  technologies: string[];
}

export interface OverviewLinkedInMarketRow {
  name: string;
  url?: string;
  industry?: string;
  employeeCount: number;
  followers?: number;
  isHiring: boolean;
  thoughtLeadershipScore: number;
  specialties: string[];
  signals: string[];
}

export interface OverviewReportExtras {
  intelligenceSummary?: string;
  webCrawlKeys: string[];
  competitorIntelligencePresent: boolean;
  competitorIntelligencePreview?: string;
}

export interface OverviewPageData {
  hero: OverviewHeroData;
  metrics: OverviewMetricCard[];
  dna: OverviewDnaColumn[];
  instagram?: OverviewInstagramSection;
  linkedin?: OverviewLinkedInSection;
  website: OverviewWebsiteSection;
  executiveSummary?: string;
  executiveBrief?: OverviewExecutiveBrief;
  swot?: SwotView;
  topCompetitors: OverviewCompetitorCard[];
  competitors: OverviewCompetitorDetail[];
  comparisonRows: OverviewComparisonRow[];
  comparisonHandles: string[];
  similarityScores: SimilarityRow[];
  averageSimilarity?: OverviewAverageSimilarity;
  gapAnalysis?: GapAnalysisView;
  priorityGaps: OverviewPriorityGap[];
  recommendations: RecommendationItem[];
  marketInsights?: OverviewMarketInsights;
  searchIntelligence?: SearchIntelligenceView;
  runMeta: OverviewRunMeta;
  companyKeywords: string[];
  companyProducts: string[];
  companyFeatures: string[];
  companyExtras: OverviewCompanyExtras;
  linkedInMarket?: OverviewLinkedInMarketRow[];
  reportExtras: OverviewReportExtras;
  businessSignals?: OverviewBusinessSignals;
  reviewIntel?: OverviewReviewIntel;
  technologyIntel?: OverviewTechnologyIntel;
  marketingIntel?: OverviewMarketingIntel;
  contentStrategyIntel?: OverviewContentStrategyIntel;
  competitorGaps?: OverviewCompetitorGaps;
  competitorWebsiteIntel: OverviewWebsiteIntelCard[];
  pipelineStatus?: OverviewPipelineStatus;
  lastUpdated: string;
  analysisError?: string | null;
  discoveryWarnings: string[];
  analysisSuccess: boolean;
}
