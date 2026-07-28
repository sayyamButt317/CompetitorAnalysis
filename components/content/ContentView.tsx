"use client";

import { useMemo, useState } from "react";
import { ContentHeader } from "@/components/content/ContentHeader";
import { ContentPagination } from "@/components/content/ContentPagination";
import { ContentPostGrid } from "@/components/content/ContentPostGrid";
import { ContentStatCards } from "@/components/content/ContentStatCards";
import { ContentToolbar } from "@/components/content/ContentToolbar";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  exportPostsToCsv,
  filterContentPosts,
  paginatePosts,
} from "@/lib/content-filters";
import { getNavItems } from "@/lib/nav-items";
import type { ContentPageData, ContentTab } from "@/types/content";

interface ContentViewProps {
  data: ContentPageData;
  onRefresh?: () => void;
}

export function ContentView({ data, onRefresh }: ContentViewProps) {
  const [activeTab, setActiveTab] = useState<ContentTab>("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const filteredPosts = useMemo(
    () => filterContentPosts(data.posts, activeTab, search),
    [data.posts, activeTab, search],
  );

  const paginatedPosts = useMemo(
    () => paginatePosts(filteredPosts, page, pageSize),
    [filteredPosts, page, pageSize],
  );

  const handleTabChange = (tab: ContentTab) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  return (
    <DashboardLayout navItems={getNavItems("content")} company={data.company}>
      <ContentHeader
        title="Content"
        subtitle={data.company.subtitle}
        dateRange={data.dateRange}
        onExport={() => exportPostsToCsv(filteredPosts)}
      />

      <div className="space-y-5 p-6 lg:p-8">
        <ContentStatCards metrics={data.stats} />

        <ContentToolbar
          activeTab={activeTab}
          search={search}
          viewMode={viewMode}
          onTabChange={handleTabChange}
          onSearchChange={handleSearchChange}
          onViewModeChange={setViewMode}
        />

        <ContentPostGrid posts={paginatedPosts} viewMode={viewMode} />

        <ContentPagination
          page={page}
          pageSize={pageSize}
          totalItems={filteredPosts.length}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
        />

        {onRefresh && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onRefresh}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Refresh data
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
