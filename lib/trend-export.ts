import type { TrendsPageData } from "@/types/trends";

export function exportTrendsToCsv(data: TrendsPageData): void {
  const csvRows: string[][] = [
    ["Rank", "Title", "Type", "Metric", "Source", "Verify URL"],
    ...data.allTrendScores.map((row) => [
      String(row.rank),
      row.displayLabel,
      row.typeLabel ?? "",
      row.metric,
      row.sourceName ?? "",
      row.verifyUrl ?? row.sourceUrl ?? "",
    ]),
    ...data.googleTrends.map((row) => [
      String(row.rank),
      row.title,
      "Google Trend",
      row.traffic,
      row.country,
      row.exploreUrl ?? row.newsUrl ?? "",
    ]),
    ...data.platformSections.flatMap((section) =>
      section.items.map((item, i) => [
        String(i + 1),
        item.title,
        item.type,
        item.metric ?? "",
        `${section.label} · ${item.source}`,
        item.url ?? "",
      ]),
    ),
  ];

  const csv = csvRows
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `trends-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
