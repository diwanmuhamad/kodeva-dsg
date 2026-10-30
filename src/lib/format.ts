/** Deterministic IDR string (avoids Intl NBSP hydration mismatches). */
export function formatIdr(value: number): string {
  const rounded = Math.round(value);
  const digits = String(Math.abs(rounded));
  const withDots = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${rounded < 0 ? "-" : ""}Rp ${withDots}`;
}

const monthsId = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
] as const;

/** Fixed Indonesian date string so server/client hydration always matches. */
export function formatDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return value;
  const year = match[1];
  const month = Number(match[2]);
  const day = Number(match[3]);
  const monthName = monthsId[month - 1];
  if (!monthName || !Number.isFinite(day)) return value;
  return `${day} ${monthName} ${year}`;
}

export function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const day = date.getUTCDate();
  const monthName = monthsId[date.getUTCMonth()] ?? "";
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  return `${day} ${monthName} ${year}, ${hours}.${minutes}`;
}

export function cycleLabel(cycle: "monthly" | "yearly"): string {
  return cycle === "yearly" ? "Tahunan" : "Bulanan";
}
