import { useExcelSync } from "../../hooks/useExcelSync";
import { useFinanceStore } from "../../store/useFinanceStore";

export function UploadButton() {
  const file = useFinanceStore((s) => s.linkedFileName);
  const { linkFile, fallbackUpload, unlink } = useExcelSync();
  return (
    <>
      <input id="fallback-excel-input" type="file" accept=".xlsx,.xlsm" hidden
        onChange={(e) => { const f = e.target.files?.[0]; if (f) void fallbackUpload(f); }} />
      <div className="upload-row">
        <button className="link-button" onClick={() => void linkFile()}>
          <span>⇪</span> {file ? file : "Lier / Uploader un fichier Excel"}
        </button>
        {file && <button className="change-button" onClick={() => void linkFile()} aria-label="Changer de fichier">Changer</button>}
      </div>
      {!("showOpenFilePicker" in window) && <small className="browser-note">Synchronisation automatique disponible sur Chrome / Edge.</small>}
      {file && <button className="unlink-button" onClick={() => void unlink()}>Délier le fichier</button>}
    </>
  );
}
