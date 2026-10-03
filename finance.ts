export type Scalar = number | string | null;

export type PeriodKey =
  | "Janvier" | "Février" | "Mars" | "Avril" | "Mai" | "Juin"
  | "Juillet" | "Août" | "Septembre" | "Octobre" | "Novembre" | "Décembre";

export type Period = PeriodKey | "Année";

export type SectionId = 1 | 2 | 3 | 4;

export interface AccueilData {
  company: string;
  sector: string;
  date: string;
  department: string;
  manager: string;
  title: string;
  controlsOk: boolean;
}

export interface ReportingRow {
  label: string;
  unit: string | null;
  benchmark: string | null;
  values: Partial<Record<PeriodKey | "Année 2023", Scalar>>;
  section: SectionId | null;
}

export interface SheetMatrix {
  name: string;
  rows: Scalar[][];
}

export interface FinanceModel {
  accueil: AccueilData;
  reporting: ReportingRow[];
  esg: SheetMatrix;
  cpc: SheetMatrix;
  balance: SheetMatrix;
  dashboard: SheetMatrix;
  lecture: SheetMatrix;
  loadedAt: number;
  sourceName: string;
  warnings: string[];
  errors: string[];
}

export interface ParseWorkbookMessage {
  buffer: ArrayBuffer;
  sourceName: string;
}

export interface ParseWorkbookResult {
  model?: FinanceModel;
  error?: string;
}
