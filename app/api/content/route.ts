import { Endpoint } from "@/routes/endpoint";

async function fetchContentFrom(url: string) {
  const response = await fetch(url, { cache: "no-store" });
  const data = await response.json();
  return { response, data };
}

export async function GET() {
  const endpoints = [Endpoint.CONTENT, Endpoint.CONTENT_LOCAL];

  for (const url of endpoints) {
    try {
      const { response, data } = await fetchContentFrom(url);
      if (response.ok) {
        return Response.json(data);
      }
    } catch {
      continue;
    }
  }

  try {
    const { response, data } = await fetchContentFrom(Endpoint.CONTENT_LOCAL || Endpoint.CONTENT);
    return Response.json(
      { error: data?.error ?? "Failed to fetch content" },
      { status: response.status },
    );
  } catch {
    return Response.json({ error: "Failed to fetch content" }, { status: 502 });
  }
}
