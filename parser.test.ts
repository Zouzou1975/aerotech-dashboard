import { describe, expect, it } from "vitest";
import * as XLSX from "xlsx";
import { parseReporting } from "../lib/parse/reporting";

describe("parseReporting", () => {
  it("parses the demo Reporting by labels, not fixed row positions", () => {
    const rows = [
      ["x"], ["Indicateur","Unité","Repère","Janvier","Décembre","Année 2023"],
      ["1. Élasticité CA / REX — test"], ["Chiffre d'affaires","MAD",null,6460000,8220000,87975000],
      ["Marge d'exploitation (REX / CA)","%","10 % à 15 %",0.0847,0.1383,0.12608]
    ] as (string|number|null)[][];
    const parsed = parseReporting(rows);
    expect(parsed.find(r => r.label === "Chiffre d'affaires")?.values["Année 2023"]).toBe(87975000);
  });

  it("keeps parsing when a line is inserted", () => {
    const rows = [
      ["Indicateur","Unité","Repère","Janvier","Année 2023"],
      ["1. Section"], ["Ligne ajoutée",null,null,123,123],
      ["Chiffre d'affaires","MAD",null,6460000,87975000]
    ] as (string|number|null)[][];
    const parsed = parseReporting(rows);
    expect(parsed.some(r => r.label === "Chiffre d'affaires")).toBe(true);
  });
});
