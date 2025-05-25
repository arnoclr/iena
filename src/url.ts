export function getParamsFromUrl(url: string) {
  const params = new URLSearchParams(url.split("?")[1]);
  return {
    lines: params.get("lines")?.split(","),
    stop: params.get("stop") || undefined,
    platforms: params.get("platforms")?.split(","),
    coordinates: params.get("coordinates") || "48,2",
    aimedDepartureCount: parseInt(params.get("aimedDepartureCount") || "5"),
  };
}
