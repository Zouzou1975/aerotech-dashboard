import { useEffect, useRef } from "react";
import { clearFileHandle, getFileHandle, requestReadPermission, saveFileHandle } from "../lib/sync/fileHandleStore";
import { ExcelSync } from "../lib/sync/excelSync";
import { useFinanceStore } from "../store/useFinanceStore";

export function useExcelSync() {
  const syncRef = useRef<ExcelSync | null>(null);
  const enabled = useFinanceStore((s) => s.syncEnabled);
  const setModel = useFinanceStore((s) => s.setModel);
  const setStatus = useFinanceStore((s) => s.setSyncStatus);
  const setFileName = useFinanceStore((s) => s.setLinkedFileName);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const handle = await getFileHandle();
      if (!handle || cancelled) return;
      setFileName(handle.name);
      const permission = await handle.queryPermission({ mode: "read" });
      if (permission === "granted" && enabled) {
        const sync = new ExcelSync((result) => {
          if (result.model) {
            setModel(result.model);
            setStatus("active");
          } else if (result.error) console.error(result.error);
        });
        syncRef.current = sync;
        sync.start(handle);
      } else if (permission === "prompt") {
        setStatus("reconnecting");
      }
    })();
    return () => {
      cancelled = true;
      syncRef.current?.dispose();
      syncRef.current = null;
    };
  }, [enabled, setFileName, setModel, setStatus]);

  const linkFile = async () => {
    if ("showOpenFilePicker" in window) {
      const [handle] = await window.showOpenFilePicker({
        multiple: false,
        types: [{ description: "Excel", accept: { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"], "application/vnd.ms-excel.sheet.macroEnabled.12": [".xlsm"] } }]
      });
      await requestReadPermission(handle);
      await saveFileHandle(handle);
      setFileName(handle.name);
      const sync = new ExcelSync((result) => {
        if (result.model) {
          setModel(result.model);
          setStatus("active");
        } else if (result.error) console.error(result.error);
      });
      syncRef.current?.dispose();
      syncRef.current = sync;
      await sync.parseFile(await handle.getFile());
      if (enabled) sync.start(handle);
      else setStatus("paused");
      return;
    }
    document.getElementById("fallback-excel-input")?.click();
  };

  const reconnect = async () => {
    const handle = await getFileHandle();
    if (!handle) return linkFile();
    const permission = await requestReadPermission(handle);
    if (permission !== "granted") return;
    setFileName(handle.name);
    setStatus("paused");
  };

  const toggle = async (next: boolean) => {
    const handle = await getFileHandle();
    if (!next) {
      syncRef.current?.stop();
      setStatus("paused");
      return;
    }
    if (!handle) {
      setStatus("none");
      return;
    }
    const permission = await requestReadPermission(handle);
    if (permission !== "granted") {
      setStatus("reconnecting");
      return;
    }
    if (!syncRef.current) {
      syncRef.current = new ExcelSync((result) => {
        if (result.model) {
          setModel(result.model);
          setStatus("active");
        } else if (result.error) console.error(result.error);
      });
    }
    syncRef.current.start(handle);
    setStatus("active");
  };

  const fallbackUpload = async (file: File) => {
    if (!file) return;
    const sync = new ExcelSync((result) => {
      if (result.model) {
        setModel(result.model);
        setFileName(file.name);
        setStatus("paused");
      } else if (result.error) console.error(result.error);
    });
    await sync.parseFile(file);
    sync.dispose();
  };

  const unlink = async () => {
    syncRef.current?.dispose();
    syncRef.current = null;
    await clearFileHandle();
    setFileName(null);
    setStatus("none");
  };

  return { linkFile, reconnect, toggle, fallbackUpload, unlink };
}
