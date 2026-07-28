import { Badge } from "@/components/ui/Badge";

interface TrendingTopicsProps {
  topics: string[];
}

export function TrendingTopics({ topics }: TrendingTopicsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {topics.map((topic) => (
        <Badge key={topic} variant="topic">
          {topic}
        </Badge>
      ))}
    </div>
  );
}
