import type { HashtagRow, HashtagSortOption } from "@/types/hashtag";

export function filterHashtagRows(
  rows: HashtagRow[],
  search: string,
  sort: HashtagSortOption,
): HashtagRow[] {
  let filtered = [...rows];

  const query = search.trim().toLowerCase().replace(/^#/, "");
  if (query) {
    filtered = filtered.filter((row) => row.tag.includes(query));
  }

  filtered.sort((a, b) => {
    if (sort === "frequency-asc") return a.frequency - b.frequency;
    if (sort === "alpha") return a.tag.localeCompare(b.tag);
    return b.frequency - a.frequency;
  });

  return filtered.map((row, index) => ({ ...row, rank: index + 1 }));
}

export function paginateItems<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function exportHashtagsToCsv(rows: HashtagRow[], filename = "hashtags-export.csv") {
  const headers = ["rank", "hashtag", "frequency", "percent_of_total", "top_competitors"];

  const csvRows = rows.map((row) => [
    String(row.rank),
    row.displayTag,
    String(row.frequency),
    row.percentOfTotal.toFixed(2),
    row.topCompetitors.map((item) => item.username).join(" "),
  ]);

  const csv = [headers, ...csvRows]
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
