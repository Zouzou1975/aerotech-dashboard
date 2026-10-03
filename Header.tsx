import { useFinanceStore } from "../../store/useFinanceStore";

export function Header() {
  const model = useFinanceStore((s) => s.model);
  if (!model) return null;
  const a = model.accueil;
  return (
    <header className="glass-panel header">
      <div>
        <h1>{a.company}</h1>
        <p>{a.title}</p>
      </div>
      <div className="identity">
        <span>{a.sector}</span><span>{a.date}</span><span>{a.department}</span><span>{a.manager}</span>
        <span className={`control-badge ${a.controlsOk ? "ok" : "warn"}`}>
          {a.controlsOk ? "✓ Contrôles Excel" : "⚠ Contrôles Excel"}
        </span>
      </div>
    </header>
  );
}
