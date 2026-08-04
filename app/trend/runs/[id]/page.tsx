import { TrendRunDetailClient } from "@/components/trend/TrendRunDetailClient";

interface TrendRunDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TrendRunDetailPage({ params }: TrendRunDetailPageProps) {
  const { id } = await params;
  return <TrendRunDetailClient trendId={id} />;
}
