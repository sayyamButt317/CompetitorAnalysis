import type { NextRequest } from "next/server";
import { COMPETITORANALYSISAPI } from "@/routes/endpoint";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const response = await fetch(COMPETITORANALYSISAPI, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    return Response.json(
      { error: data?.detail ?? "Competitor analysis request failed" },
      { status: response.status },
    );
  }

  return Response.json(data);
}
