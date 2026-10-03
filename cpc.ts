import type { Scalar, SheetMatrix } from "../../types/finance";
export function parseCPC(rows: Scalar[][]): SheetMatrix {
  return { name: "CPC", rows };
}
