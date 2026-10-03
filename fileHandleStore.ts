import { get, set, del } from "idb-keyval";

const KEY = "aerotech-excel-file-handle";

export async function saveFileHandle(handle: FileSystemFileHandle): Promise<void> {
  await set(KEY, handle);
}

export async function getFileHandle(): Promise<FileSystemFileHandle | undefined> {
  return get<FileSystemFileHandle>(KEY);
}

export async function clearFileHandle(): Promise<void> {
  await del(KEY);
}

export async function requestReadPermission(handle: FileSystemFileHandle): Promise<PermissionState> {
  const current = await handle.queryPermission({ mode: "read" });
  if (current !== "prompt") return current;
  return handle.requestPermission({ mode: "read" });
}
