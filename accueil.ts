import type { AccueilData, Scalar } from "../../types/finance";
import { normalizeLabel } from "./normalize";

const getRows = (rows: Scalar[][]) =>
  new Map(rows.map((row) => [normalizeLabel(row[1]), row[2]]));

export function parseAccueil(rows: Scalar[][]): AccueilData {
  const map = getRows(rows);
  const value = (label: string) => String(map.get(normalizeLabel(label)) ?? "—");
  const controls = rows.flat().map((v) => String(v ?? "")).filter(Boolean);
  return {
    company: value("Nom de l'entreprise"),
    sector: value("Secteur"),
    date: value("Date"),
    department: value("Département"),
    manager: value("Responsable"),
    title: String(rows[1]?.[1] ?? "Plan financier"),
    controlsOk: controls.some((v) => v.includes("✔ OK")) && !controls.some((v) => v.includes("✖"))
  };
}
