import { useEffect } from "react";
import { useFinanceStore } from "../store/useFinanceStore";
import type { Period, PeriodKey } from "../types/finance";

export const periods: Period[] = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre", "Année"
];

export function usePeriod() {
  const period = useFinanceStore((s) => s.period);
  const setPeriod = useFinanceStore((s) => s.setPeriod);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "a") setPeriod("Année");
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        const idx = periods.indexOf(period);
        const delta = event.key === "ArrowRight" ? 1 : -1;
        const next = periods[(idx + delta + periods.length) % periods.length];
        if (next) setPeriod(next);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [period, setPeriod]);

  return { period, setPeriod, periods };
}

export const periodColumn = (period: Period): PeriodKey | "Année 2023" =>
  period === "Année" ? "Année 2023" : period;
