import type { ParseWorkbookResult } from "../../types/finance";
import WorkerUrl from "../../workers/parseWorkbook.worker?worker";

export type ExcelSyncCallback = (result: ParseWorkbookResult) => void;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function readWithRetry(handle: FileSystemFileHandle): Promise<File> {
  let lastError: unknown;
  for (const delay of [0, 300, 600, 1200]) {
    if (delay) await sleep(delay);
    try {
      return await handle.getFile();
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Lecture Excel impossible.");
}

export class ExcelSync {
  private worker: Worker;
  private interval: number | undefined;
  private lastSignature = "";

  constructor(private readonly onResult: ExcelSyncCallback) {
    this.worker = new WorkerUrl();
    this.worker.onmessage = (event: MessageEvent<ParseWorkbookResult>) => this.onResult(event.data);
  }

  async parseFile(file: File): Promise<void> {
    const buffer = await file.arrayBuffer();
    this.worker.postMessage({ buffer, sourceName: file.name }, [buffer]);
  }

  start(handle: FileSystemFileHandle): void {
    this.stop();
    const tick = async () => {
      try {
        const file = await readWithRetry(handle);
        const signature = `${file.lastModified}:${file.size}`;
        if (signature === this.lastSignature) return;
        this.lastSignature = signature;
        await sleep(400);
        const stable = await readWithRetry(handle);
        await this.parseFile(stable);
      } catch (error) {
        this.onResult({ error: error instanceof Error ? error.message : "Erreur de lecture." });
      }
    };
    void tick();
    this.interval = window.setInterval(() => void tick(), 1000);
  }

  stop(): void {
    if (this.interval !== undefined) window.clearInterval(this.interval);
    this.interval = undefined;
  }

  dispose(): void {
    this.stop();
    this.worker.terminate();
  }
}
