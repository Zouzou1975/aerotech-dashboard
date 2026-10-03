import { useExcelSync } from "../../hooks/useExcelSync";
import { useFinanceStore } from "../../store/useFinanceStore";

export function SyncToggle() {
  const enabled = useFinanceStore((s) => s.syncEnabled);
  const setEnabled = useFinanceStore((s) => s.setSyncEnabled);
  const { toggle } = useExcelSync();
  const onChange = async () => {
    const next = !enabled;
    setEnabled(next);
    await toggle(next);
  };
  return (
    <button className={`sync-toggle ${enabled ? "on" : ""}`} onClick={onChange} aria-pressed={enabled}>
      <span className="switch"><span /></span>
      <span>{enabled ? "Synchronisation Excel" : "Synchronisation Excel"}</span>
    </button>
  );
}
