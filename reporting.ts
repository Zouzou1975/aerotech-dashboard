import type { ReportingRow, Scalar, SectionId, PeriodKey } from "../../types/finance";
import { asScalar, isSectionLabel } from "./normalize";

const PERIODS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
] as const;

export function parseReporting(rows: Scalar[][]): ReportingRow[] {
  const headerIndex = rows.findIndex((r) => String(r[0] ?? "").trim() === "Indicateur");
  if (headerIndex < 0) throw new Error("Reporting: en-tête « Indicateur » introuvable.");
  const header = rows[headerIndex];
  const periodCols = new Map<string, number>();
  PERIODS.forEach((p) => {
    const idx = header.findIndex((v) => String(v ?? "").trim() === p);
    if (idx >= 0) periodCols.set(p, idx);
  });
  const annualCol = header.findIndex((v) => String(v ?? "").trim() === "Année 2023");

  let section: SectionId | null = null;
  const output: ReportingRow[] = [];
  for (const row of rows.slice(headerIndex + 1)) {
    const label = String(row[0] ?? "").trim();
    if (!label) continue;
    if (isSectionLabel(label)) {
      const n = Number(label[0]);
      if (n >= 1 && n <= 4) section = n as SectionId;
      continue;
    }
    if (!section) continue;
    const values: Partial<Record<PeriodKey | "Année 2023", Scalar>> = {};
    periodCols.forEach((col, period) => {
      values[period as PeriodKey] = asScalar(row[col]);
    });
    if (annualCol >= 0) values["Année 2023"] = asScalar(row[annualCol]);
    output.push({
      label,
      unit: row[1] == null ? null : String(row[1]),
      benchmark: row[2] == null ? null : String(row[2]),
      values,
      section
    });
  }
  return output;
}
