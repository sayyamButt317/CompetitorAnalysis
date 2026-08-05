import { DashboardDetailPage } from "@/components/dashboard/DashboardDetailPage";

interface DashboardByIdPageProps {
  params: Promise<{ Id: string }>;
}

export default async function DashboardByIdPage({ params }: DashboardByIdPageProps) {
  const { Id } = await params;
  return <DashboardDetailPage analysisId={Id} />;
}
