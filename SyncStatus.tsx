import { useFinanceStore } from "../../store/useFinanceStore";
import { useExcelSync } from "../../hooks/useExcelSync";

export function SyncStatus() {
  const status = useFinanceStore((s) => s.syncStatus);
  const file = useFinanceStore((s) => s.linkedFileName);
  const last = useFinanceStore((s) => s.lastUpdated);
  const { reconnect } = useExcelSync();
  const label = status === "active" && last ? `Active · mise à jour ${new Date(last).toLocaleTimeString("fr-FR")}` :
    status === "paused" ? "Synchronisation en pause" :
    status === "reconnecting" ? "Permission requise" : "Aucun fichier lié";
  return <div className="sync-status">
    <span className="status-dot" /> <span>{label}</span>
    {status === "reconnecting" && <button onClick={() => void reconnect()}>Reconnecter</button>}
    {file && <small title={file}>{file}</small>}
  </div>;
}
