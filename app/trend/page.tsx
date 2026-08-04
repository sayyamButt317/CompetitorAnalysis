import { Suspense } from "react";
import { TrendPageClient } from "@/components/trend/TrendPageClient";

export default function TrendPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-100">
          <p className="text-sm text-slate-500">Loading trending intelligence...</p>
        </div>
      }
    >
      <TrendPageClient />
    </Suspense>
  );
}
