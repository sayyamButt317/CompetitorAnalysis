export function formatApiError(data: {
  error?: string;
  detail?: unknown;
}): string {
  if (typeof data.error === "string") return data.error;

  if (typeof data.detail === "string") return data.detail;

  if (Array.isArray(data.detail)) {
    return data.detail
      .map((item) => {
        if (typeof item === "object" && item && "msg" in item) {
          return String((item as { msg?: string }).msg ?? item);
        }
        return String(item);
      })
      .filter(Boolean)
      .join(", ");
  }

  return "Request failed";
}
