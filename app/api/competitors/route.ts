import { Endpoint } from "@/routes/endpoint";
import { parseJsonResponse } from "@/lib/parse-json-response";

export async function GET() {
  const response = await fetch(Endpoint.COMPETITORS, {
    cache: "no-store",
  });

  const data = await parseJsonResponse<{ error?: string }>(response);

  if (!response.ok) {
    return Response.json(
      { error: data?.error ?? "Failed to fetch competitors" },
      { status: response.status },
    );
  }

  return Response.json(data);
}
