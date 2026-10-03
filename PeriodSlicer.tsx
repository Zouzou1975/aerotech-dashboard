import { periods, usePeriod } from "../../hooks/usePeriod";

const short: Record<string, string> = {
  Janvier:"Jan", Février:"Fév", Mars:"Mar", Avril:"Avr", Mai:"Mai", Juin:"Juin",
  Juillet:"Juil", Août:"Août", Septembre:"Sep", Octobre:"Oct", Novembre:"Nov", Décembre:"Déc", Année:"Année"
};

export function PeriodSlicer() {
  const { period, setPeriod } = usePeriod();
  return (
    <div className="period-slicer" role="group" aria-label="Période">
      {periods.map((p) => (
        <button key={p} className={period === p ? "active" : ""} onClick={() => setPeriod(p)}>{short[p]}</button>
      ))}
    </div>
  );
}
