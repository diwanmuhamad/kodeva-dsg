export function createRateLimiter(limit: number, windowMs: number) {
  const hits = new Map<string, number[]>();

  return {
    isLimited(key: string, now: number) {
      const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return true;
      }
      recent.push(now);
      hits.set(key, recent);
      return false;
    },
  };
}

export const leadRateLimit = createRateLimiter(5, 10 * 60 * 1000);
