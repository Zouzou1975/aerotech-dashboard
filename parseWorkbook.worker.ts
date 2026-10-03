import * as XLSX from "xlsx";
import type { FinanceModel, ParseWorkbookMessage, ParseWorkbookResult, Scalar } from "../types/finance";
import { parseAccueil } from "../lib/parse/accueil";
import { parseReporting } from "../lib/parse/reporting";
import { parseESG } from "../lib/parse/esg";
import { parseCPC } from "../lib/parse/cpc";
import { parseBalance } from "../lib/parse/balance";

const toMatrix = (sheet: XLSX.WorkSheet): Scalar[][] =>
  XLSX.utils.sheet_to_json<Scalar[]>(sheet, { header: 1, defval: null, raw: true });

self.onmessage = (event: MessageEvent<ParseWorkbookMessage>) => {
  try {
    const workbook = XLSX.read(event.data.buffer, { type: "array", cellFormula: false, cellHTML: false });
    const get = (name: string): Scalar[][] => {
      const sheet = workbook.Sheets[name];
      if (!sheet) throw new Error(`Onglet introuvable : ${name}`);
      return toMatrix(sheet);
    };
    const accueilRows = get("Accueil");
    const reportingRows = get("Reporting");
    const model: FinanceModel = {
      accueil: parseAccueil(accueilRows),
      reporting: parseReporting(reportingRows),
      esg: parseESG(get("ESG")),
      cpc: parseCPC(get("CPC")),
      balance: parseBalance(get("Balance")),
      dashboard: { name: "DASHBOARD", rows: get("DASHBOARD") },
      lecture: { name: "Lecture", rows: get("Lecture") },
      loadedAt: Date.now(),
      sourceName: event.data.sourceName,
      warnings: [],
      errors: []
    };
    self.postMessage({ model } satisfies ParseWorkbookResult);
  } catch (error) {
    self.postMessage({ error: error instanceof Error ? error.message : "Parsing Excel impossible." } satisfies ParseWorkbookResult);
  }
};
