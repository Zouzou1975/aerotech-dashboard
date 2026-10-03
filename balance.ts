import type { Scalar, SheetMatrix } from "../../types/finance";
export function parseBalance(rows: Scalar[][]): SheetMatrix {
  return { name: "Balance", rows };
}
