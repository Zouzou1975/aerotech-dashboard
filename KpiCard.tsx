import { usePointerGlow } from "../../hooks/usePointerGlow";
import type { ReportingRow, Scalar } from "../../types/finance";

const format = (v: Scalar, unit: string | null) => {
  if (v === null || v === undefined || v === "") return "–";
  if (typeof v === "string") return v;
  if (unit === "%") return new Intl.NumberFormat("fr-MA", { style:"percent", maximumFractionDigits:1 }).format(v);
  if (unit === "jours") return `${new Intl.NumberFormat("fr-MA", { maximumFractionDigits:0 }).format(v)} j`;
  if (unit === "x" || unit === "coef.") return `${new Intl.NumberFormat("fr-MA", { maximumFractionDigits:1 }).format(v)}x`;
  return new Intl.NumberFormat("fr-MA", { maximumFractionDigits:0 }).format(v);
};

export function KpiCard({ row, value }: { row: ReportingRow; value: Scalar }) {
  const { ref, onPointerMove } = usePointerGlow<HTMLDivElement>();
  const muted = value === "–" || value === "n.s.";
  return <article ref={ref} onPointerMove={onPointerMove} className={`kpi-card ${muted ? "muted" : ""}`}>
    <div className="kpi-glow" />
    <div className="kpi-label">{row.label}</div>
    <div className="kpi-value">{format(value, row.unit)}</div>
    {row.benchmark && <div className="kpi-benchmark">{row.benchmark}</div>}
  </article>;
}
