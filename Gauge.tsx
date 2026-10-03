import { thresholds } from "../../config/thresholds";

export function Gauge({ label, value, kind }: { label: string; value: number; kind: "margin"|"growth"|"personnel"|"localVA"|"dso"|"ccc" }) {
  const isPercent = ["margin","growth","personnel","localVA"].includes(kind);
  const max = kind === "dso" ? 120 : kind === "ccc" ? 120 : 1;
  const ratio = Math.max(0, Math.min(1, value / max));
  const angle = -135 + ratio * 270;
  const status =
    kind === "margin" ? (value >= thresholds.operatingMargin.targetMin ? "Dans la cible" : value >= thresholds.operatingMargin.red ? "Vigilance" : "Alerte") :
    kind === "growth" ? (value >= .05 && value <= .10 ? "Dans la cible" : "Vigilance") :
    kind === "personnel" ? (value <= .65 ? "Sain" : value <= .80 ? "Tendu" : "Alerte") :
    kind === "localVA" ? (value >= .40 ? "Dans la cible" : "Vigilance") :
    kind === "dso" ? (Math.abs(value - 60) <= 10 ? "Dans la cible" : "Vigilance") : "Cycle cash";
  return <div className="gauge">
    <svg viewBox="0 0 180 110" role="img" aria-label={`${label}: ${value}`}>
      <path d="M20 90 A70 70 0 0 1 160 90" fill="none" stroke="currentColor" strokeOpacity=".1" strokeWidth="12" strokeLinecap="round"/>
      <path d="M20 90 A70 70 0 0 1 160 90" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round"
        pathLength="1" strokeDasharray={`${ratio} 1`} />
      <line x1="90" y1="90" x2="90" y2="34" stroke="currentColor" strokeWidth="3" transform={`rotate(${angle} 90 90)`}/>
    </svg>
    <strong>{isPercent ? new Intl.NumberFormat("fr-MA",{style:"percent",maximumFractionDigits:1}).format(value) : `${value.toFixed(0)} j`}</strong>
    <span>{label}</span><small>{status}</small>
  </div>;
}
