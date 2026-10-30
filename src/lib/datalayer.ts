export type DataLayerEvent = { event: string } & Record<string, unknown>;

const recentViews = new Map<string, number>();

export function shouldTrackView(id: string, now = Date.now(), windowMs = 1500): boolean {
  const last = recentViews.get(id);
  if (last !== undefined && now - last < windowMs) return false;
  recentViews.set(id, now);
  return true;
}

export function resetViewTracking(): void {
  recentViews.clear();
}

export function pushDataLayer(payload: DataLayerEvent): void {
  if (typeof window === "undefined") return;
  const layer = (window.dataLayer ??= []);
  layer.push(payload);
  window.dispatchEvent(new CustomEvent("kodeva:datalayer", { detail: payload }));
}

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}
