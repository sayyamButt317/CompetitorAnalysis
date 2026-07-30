import type { TrendsPageData } from "@/types/trends";

export function exportTrendsToCsv(data: TrendsPageData): void {
  const rows: string[][] = [
    ["Category", "Rank", "Label", "Metric", "Trend Score"],
    ...data.hashtags.map((item) => [
      "Hashtag",
      String(item.rank),
      item.displayLabel,
      item.metric,
      String(item.trendScore),
    ]),
    ...data.topics.map((item) => [
      "Topic",
      String(item.rank),
      item.displayLabel,
      item.metric,
      String(item.trendScore),
    ]),
    ...data.reelFormats.map((item) => [
      "Reel Format",
      String(item.rank),
      item.displayLabel,
      item.metric,
      String(item.trendScore),
    ]),
    ...data.allTrendScores.map((item) => [
      "Trend Score",
      String(item.rank),
      item.displayLabel,
      item.sublabel ?? "",
      item.metric,
    ]),
    ...data.googleTrends.map((item) => [
      "Google Trend",
      String(item.rank),
      item.title,
      item.traffic,
      item.country,
    ]),
    ...data.webSources.map((source) => ["Source", "", source.name, source.category, ""]),
  ];

  const csv = rows
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `trending-intelligence-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
