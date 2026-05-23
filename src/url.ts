export function getParamsFromUrl(url: string) {
  const params = new URLSearchParams(url.split("?")[1]);
  const directionParam = params.get("direction");
  const direction: "0" | "1" | undefined =
    directionParam === "0" || directionParam === "1"
      ? directionParam
      : undefined;

  return {
    lines: params.get("lines")?.split(","),
    stop: params.get("stop") || undefined,
    platforms: params.get("platforms")?.split(","),
    direction,
    coordinates: params.get("coordinates") || "48,2",
    aimedDepartureCount: parseInt(params.get("aimedDepartureCount") || "5"),
  };
}
