import { create } from "zustand";
import type { FinanceModel, Period, SectionId } from "../types/finance";

interface FinanceState {
  model: FinanceModel | null;
  section: SectionId;
  period: Period;
  syncEnabled: boolean;
  linkedFileName: string | null;
  syncStatus: "none" | "paused" | "active" | "reconnecting";
  lastUpdated: number | null;
  setModel: (model: FinanceModel) => void;
  setSection: (section: SectionId) => void;
  setPeriod: (period: Period) => void;
  setSyncEnabled: (enabled: boolean) => void;
  setLinkedFileName: (name: string | null) => void;
  setSyncStatus: (status: FinanceState["syncStatus"]) => void;
}

export const useFinanceStore = create<FinanceState>((set) => ({
  model: null,
  section: 1,
  period: "Décembre",
  syncEnabled: false,
  linkedFileName: null,
  syncStatus: "none",
  lastUpdated: null,
  setModel: (model) => set({ model, lastUpdated: model.loadedAt }),
  setSection: (section) => set({ section }),
  setPeriod: (period) => set({ period }),
  setSyncEnabled: (syncEnabled) => set({ syncEnabled }),
  setLinkedFileName: (linkedFileName) => set({ linkedFileName }),
  setSyncStatus: (syncStatus) => set({ syncStatus })
}));
