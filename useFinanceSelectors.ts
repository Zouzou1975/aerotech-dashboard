import { useMemo } from "react";
import { useFinanceStore } from "../store/useFinanceStore";

export function useSectionRows() {
  const model = useFinanceStore((s) => s.model);
  const section = useFinanceStore((s) => s.section);
  return useMemo(
    () => model?.reporting.filter((row) => row.section === section) ?? [],
    [model, section]
  );
}
