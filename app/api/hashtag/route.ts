import { Endpoint } from "@/routes/endpoint";
import { parseJsonResponse } from "@/lib/parse-json-response";

async function fetchHashtagsFrom(url: string) {
  const response = await fetch(url, { cache: "no-store" });
  const data = await parseJsonResponse<{ error?: string }>(response);
  return { response, data };
}

export async function GET() {
  const endpoints = [Endpoint.HASHTAGS, Endpoint.HASHTAGS_LOCAL];

  for (const url of endpoints) {
    try {
      const { response, data } = await fetchHashtagsFrom(url);
      if (response.ok) {
        return Response.json(data);
      }
    } catch {
      continue;
    }
  }

  try {
    const { response, data } = await fetchHashtagsFrom(Endpoint.HASHTAGS);
    return Response.json(
      { error: data?.error ?? "Failed to fetch hashtags" },
      { status: response.status },
    );
  } catch {
    return Response.json({ error: "Failed to fetch hashtags" }, { status: 502 });
  }
}
