import type { ChartSegment } from "@/types/dashboard";

export interface HashtagApiItem {
  tag: string;
  count: number;
}

export interface HashtagByAnalysis {
  analysis_id?: string;
  prompt_id?: string;
  created_at?: string;
  company_name?: string;
  hashtags?: HashtagApiItem[];
}

export interface HashtagListResponse {
  success: boolean;
  analysis_id?: string | null;
  analysis_count?: number;
  total_unique?: number;
  hashtags?: HashtagApiItem[];
  by_analysis?: HashtagByAnalysis[];
  error?: string;
}

export interface HashtagCompetitorRef {
  username: string;
  name: string;
  imageUrl?: string;
}

export interface HashtagRow {
  rank: number;
  tag: string;
  displayTag: string;
  frequency: number;
  percentOfTotal: number;
  trend: number[];
  topCompetitors: HashtagCompetitorRef[];
}

export interface HashtagCloudItem {
  tag: string;
  displayTag: string;
  count: number;
  size: "xl" | "lg" | "md" | "sm" | "xs";
}

export interface HashtagStatMetric {
  id: string;
  label: string;
  value: string;
  subtitle: string;
  icon: "unique" | "uses" | "top" | "avg" | "diversity";
}

export type HashtagSortOption = "frequency-desc" | "frequency-asc" | "alpha";

export interface HashtagPageData {
  company: {
    name: string;
    subtitle: string;
    logoInitials: string;
  };
  dateRange: string;
  stats: HashtagStatMetric[];
  overviewSegments: ChartSegment[];
  overviewCenterValue: string;
  cloudTags: HashtagCloudItem[];
  rows: HashtagRow[];
  totalUnique: number;
  totalUses: number;
}
