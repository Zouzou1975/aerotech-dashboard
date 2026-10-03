import type { Scalar, SheetMatrix } from "../../types/finance";
import { numberedPrefix } from "./normalize";

export function parseESG(rows: Scalar[][]): SheetMatrix {
  // ESG is retained as a raw matrix; semantic lookup uses numbered prefixes downstream.
  const selected = ["II.", "I.", "III.", "IV.", "8.", "9.", "10.", "V.", "VI.", "VII.", "IX.", "15.", "X."];
  const filtered = rows.filter((r) => {
    const p = numberedPrefix(r[1]);
    return p ? selected.includes(p) : false;
  });
  return { name: "ESG", rows: filtered.length ? rows : rows.slice(0, 1) };
}
