export function firstQuery(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function pageNumber(value: string | undefined): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return 1;
  return parsed;
}

export const PAGE_SIZE = 6;

export function paginate<T>(items: T[], page: number, pageSize = PAGE_SIZE) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(page, 1), totalPages);
  const start = (current - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    current,
    totalPages,
    total,
  };
}
