import { Endpoint } from "@/routes/endpoint";

export async function GET() {
  const response = await fetch(Endpoint.COMPETITORS, {
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    return Response.json(
      { error: data?.error ?? "Failed to fetch competitors" },
      { status: response.status },
    );
  }

  return Response.json(data);
}
