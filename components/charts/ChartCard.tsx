import type { ReactNode } from "react";
import { Card, CardHeader } from "@/components/ui/Card";

interface ChartCardProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ChartCard({ title, action, children, className = "" }: ChartCardProps) {
  return (
    <Card className={`flex flex-col ${className}`}>
      <CardHeader title={title} action={action} />
      <div className="flex flex-1 items-center">{children}</div>
    </Card>
  );
}
