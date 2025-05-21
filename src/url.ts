export function getParamsFromUrl(url: string) {
  const params = new URLSearchParams(url.split("?")[1]);
  return {
    lines: params.get("lines")?.split(","),
    stop: params.get("stop") || undefined,
    platforms: params.get("platforms")?.split(","),
  };
}
