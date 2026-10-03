/**
 * Seuils repris de la colonne « Repère » du Reporting et du cahier des charges.
 * Les données métier restent celles du classeur Excel ; ce fichier ne recalcule pas les KPI.
 */
export const thresholds = {
  operatingMargin: { red: 0.05, orange: 0.10, targetMin: 0.10, targetMax: 0.15 },
  netIncomeGrowth: { targetMin: 0.05, targetMax: 0.10 },
  personnelVA: { healthyMax: 0.65, tenseMax: 0.80 },
  localVA: { min: 0.40 },
  dso: { target: 60 },
  ccc: { lowerIsBetter: true },
  salaryCA: { max: 0.30 },
  cafCA: { min: 0.10 },
  externalChargesCA: { max: 0.10 },
  operatingLeverage: { min: 2, max: 4 },
  debtCost: { min: 0.04, max: 0.07 }
} as const;
