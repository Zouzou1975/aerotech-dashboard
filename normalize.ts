export function normalizeLabel(value: unknown): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[−–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

export function numberedPrefix(value: unknown): string | null {
  const match = String(value ?? "").trim().match(/^([IVXLCDM]+\.|\d+\.)/i);
  return match?.[1]?.toUpperCase() ?? null;
}

export function asScalar(value: unknown): number | string | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  return String(value);
}

export function isSectionLabel(value: unknown): boolean {
  return /^[1-4]\./.test(String(value ?? "").trim());
}
