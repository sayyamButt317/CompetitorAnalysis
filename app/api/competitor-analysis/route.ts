import type { NextRequest } from "next/server";
import { Endpoint } from "@/routes/endpoint";
import { formatApiError } from "@/lib/format-api-error";
import { parseJsonResponse } from "@/lib/parse-json-response";

export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(Endpoint.COMPETITORANALYSISAPI, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await parseJsonResponse<{ detail?: unknown; error?: string }>(response);

    if (!response.ok) {
      return Response.json(
        { error: formatApiError(data) },
        { status: response.status },
      );
    }

    return Response.json(data);
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Competitor analysis request failed",
      },
      { status: 502 },
    );
  }
}
