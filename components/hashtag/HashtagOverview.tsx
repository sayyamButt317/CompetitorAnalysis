import { DonutChart } from "@/components/charts/DonutChart";
import { HashtagCloud } from "@/components/hashtag/HashtagCloud";
import { Card, CardHeader } from "@/components/ui/Card";
import type { ChartSegment } from "@/types/dashboard";
import type { HashtagCloudItem } from "@/types/hashtag";

interface HashtagOverviewProps {
  segments: ChartSegment[];
  centerValue: string;
  cloudTags: HashtagCloudItem[];
}

export function HashtagOverview({
  segments,
  centerValue,
  cloudTags,
}: HashtagOverviewProps) {
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader title="Top Hashtags Overview" />
        <div className="px-1 pb-2">
          <DonutChart
            segments={segments}
            centerLabel="Total Uses"
            centerValue={centerValue}
            size={150}
          />
        </div>
      </Card>

      <Card>
        <CardHeader title="Hashtag Cloud" />
        <HashtagCloud tags={cloudTags} />
      </Card>
    </div>
  );
}
