import { lazy, Suspense, useEffect } from "react";
import { AnimatedLenses } from "./components/layout/AnimatedLenses";
import { Header } from "./components/layout/Header";
import { PeriodSlicer } from "./components/layout/PeriodSlicer";
import { Sidebar } from "./components/layout/Sidebar";
import { KpiCard } from "./components/kpi/KpiCard";
import { Gauge } from "./components/kpi/Gauge";
import { ReadingBadge } from "./components/kpi/ReadingBadge";
import { Sparkline } from "./components/kpi/Sparkline";
import { useExcelSync } from "./hooks/useExcelSync";
import { useSectionRows } from "./hooks/useFinanceSelectors";
import { periodColumn } from "./hooks/usePeriod";
import { useFinanceStore } from "./store/useFinanceStore";

const TrendChart = lazy(() => import("./components/charts/TrendChart").then((m) => ({ default: m.TrendChart })));
const WaterfallChart = lazy(() => import("./components/charts/WaterfallChart").then((m) => ({ default: m.WaterfallChart })));

const demoRows = (section: number) => section === 1
  ? ["Chiffre d'affaires","Résultat d'exploitation (REX)","Marge d'exploitation (REX / CA)","Élasticité REX / CA","Lecture de l'élasticité"]
  : section === 2 ? ["Résultat net","Taux de croissance du résultat net (vs N-1)","CAF / CA"]
  : section === 3 ? ["Valeur ajoutée","Taux de valeur ajoutée locale (VA / Production)","Poids du personnel dans la valeur ajoutée","REX corrigé du change"]
  : ["BFR d'exploitation (mensuel)","DSO — délai de paiement clients","DPO — délai de paiement fournisseurs","CCC — cycle de conversion du cash (DSO + DIO − DPO)"];

function App() {
  const model = useFinanceStore((s) => s.model);
  const section = useFinanceStore((s) => s.section);
  const period = useFinanceStore((s) => s.period);
  const setModel = useFinanceStore((s) => s.setModel);
  const rows = useSectionRows();
  const { fallbackUpload } = useExcelSync();

  useEffect(() => {
    if (model) return;
    void fetch(`${import.meta.env.BASE_URL}data/Plan_Financier_AeroTech_Maroc.xlsx`)
      .then((r) => r.arrayBuffer())
      .then((buffer) => {
        const worker = new Worker(new URL("./workers/parseWorkbook.worker.ts", import.meta.url), { type: "module" });
        worker.onmessage = (e) => { if (e.data.model) setModel(e.data.model); worker.terminate(); };
        worker.postMessage({ buffer, sourceName: "Plan_Financier_AeroTech_Maroc.xlsx" }, [buffer]);
      })
      .catch(console.error);
  }, [model, setModel]);

  useEffect(() => {
    const input = document.getElementById("fallback-excel-input") as HTMLInputElement | null;
    if (!input) return;
    const onChange = () => { const file = input.files?.[0]; if (file) void fallbackUpload(file); };
    input.addEventListener("change", onChange);
    return () => input.removeEventListener("change", onChange);
  }, [fallbackUpload]);

  if (!model) return <div className="loading-shell"><AnimatedLenses/><div className="loading-card">Chargement du modèle financier…</div></div>;

  const col = periodColumn(period);
  const sectionRows = rows.length ? rows : [];
  const find = (label: string) => sectionRows.find((r) => r.label === label);
  const value = (label: string) => find(label)?.values[col] ?? null;
  const annual = period === "Année";
  const margin = typeof value("Marge d'exploitation (REX / CA)") === "number" ? value("Marge d'exploitation (REX / CA)") as number : null;
  const growth = typeof value("Taux de croissance du résultat net (vs N-1)") === "number" ? value("Taux de croissance du résultat net (vs N-1)") as number : null;
  const personnel = typeof value("Poids du personnel dans la valeur ajoutée") === "number" ? value("Poids du personnel dans la valeur ajoutée") as number : null;
  const localVA = typeof value("Taux de valeur ajoutée locale (VA / Production)") === "number" ? value("Taux de valeur ajoutée locale (VA / Production)") as number : null;
  const dso = typeof value("DSO — délai de paiement clients") === "number" ? value("DSO — délai de paiement clients") as number : null;
  const ccc = typeof value("CCC — cycle de conversion du cash (DSO + DIO − DPO)") === "number" ? value("CCC — cycle de conversion du cash (DSO + DIO − DPO)") as number : null;

  const chartRow = (label: string) => model.reporting.find((r) => r.label === label);
  const esgRows = model.esg.rows;

  return <div className="app-shell">
    <AnimatedLenses />
    <Sidebar />
    <main className="main">
      <Header />
      <div className="topbar"><div className="section-caption">Section {section} · {["","Élasticité CA / REX","Rentabilité et performance","Indicateurs spécifiques aéronautique","Financement, BFR & cash"][section]}</div><PeriodSlicer/></div>
      <section className="content">
        <div className="kpi-grid">
          {sectionRows.map((row) => <KpiCard key={row.label} row={row} value={row.values[col] ?? null} />)}
        </div>
        {section === 1 && find("Lecture de l'élasticité")?.values[col] && typeof find("Lecture de l'élasticité")?.values[col] === "string" &&
          <div className="reading-line"><span>Lecture</span><ReadingBadge value={String(find("Lecture de l'élasticité")?.values[col])}/></div>}
        <div className="gauge-grid">
          {section === 1 && margin !== null && <Gauge label="Marge d'exploitation" value={margin} kind="margin" />}
          {section === 2 && growth !== null && <Gauge label="Croissance du résultat net" value={growth} kind="growth" />}
          {section === 3 && personnel !== null && <Gauge label="Personnel / VA" value={personnel} kind="personnel" />}
          {section === 3 && localVA !== null && <Gauge label="Valeur ajoutée locale" value={localVA} kind="localVA" />}
          {section === 4 && dso !== null && <Gauge label="DSO" value={dso} kind="dso" />}
          {section === 4 && ccc !== null && <Gauge label="CCC" value={ccc} kind="ccc" />}
        </div>
        {!annual && <div className="comparison">
          <div><strong>Comparaison</strong><span>Variation vs mois précédent · données issues directement du Reporting Excel</span></div>
          <Sparkline values={sectionRows.find((r) => r.label === "Chiffre d'affaires")?.values ? Object.values(sectionRows.find((r) => r.label === "Chiffre d'affaires")!.values).filter((v): v is number => typeof v === "number") : []}/>
        </div>}
        {annual && <Suspense fallback={<div className="chart-loading">Préparation des graphiques…</div>}>
          <div className="charts-grid">
            <TrendChart title="Chiffre d'affaires" row={chartRow("Chiffre d'affaires")}/>
            <TrendChart title="Résultat net" row={chartRow("Résultat net")}/>
            <TrendChart title="Valeur ajoutée" row={chartRow("Valeur ajoutée")}/>
            <TrendChart title="Résultat d'exploitation" row={chartRow("Résultat d'exploitation (REX)")}/>
          </div>
          <WaterfallChart rows={esgRows}/>
        </Suspense>}
        {model.warnings.length > 0 && <div className="warning-card">{model.warnings.join(" · ")}</div>}
      </section>
    </main>
  </div>;
}

export default App;
