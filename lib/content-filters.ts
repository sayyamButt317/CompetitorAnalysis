import type { ContentPost, ContentTab } from "@/types/content";

export function filterContentPosts(
  posts: ContentPost[],
  tab: ContentTab,
  search: string,
): ContentPost[] {
  let filtered = [...posts];

  if (tab === "reel" || tab === "image" || tab === "carousel") {
    filtered = filtered.filter((post) => post.type === tab);
  } else if (tab === "top") {
    filtered = filtered.sort((a, b) => b.engagementRate - a.engagementRate);
  }

  const query = search.trim().toLowerCase();
  if (query) {
    filtered = filtered.filter((post) => {
      const haystack = [
        post.caption,
        post.username,
        post.competitorName,
        post.handle,
        ...post.hashtags,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }

  return filtered;
}

export function paginatePosts<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function exportPostsToCsv(posts: ContentPost[], filename = "content-export.csv") {
  const headers = [
    "username",
    "competitor_name",
    "media_type",
    "caption",
    "likes",
    "comments",
    "engagement_rate",
    "timestamp",
    "permalink",
    "hashtags",
  ];

  const rows = posts.map((post) => [
    post.username,
    post.competitorName,
    post.typeLabel,
    post.caption.replace(/"/g, '""'),
    String(post.likes),
    String(post.comments),
    String(post.engagementRate),
    post.timestamp ?? "",
    post.permalink ?? "",
    post.hashtags.join(" "),
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
