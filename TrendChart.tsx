import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { ReportingRow } from "../../types/finance";
import { periodColumn } from "../../hooks/usePeriod";

const months = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"] as const;

export function TrendChart({ title, row }: { title: string; row?: ReportingRow }) {
  const data = useMemo(() => row ? months.map((m) => ({ month:m.slice(0,3), value: typeof row.values[m] === "number" ? row.values[m] : null })) : [], [row]);
  return <div className="chart-card">
    <div className="chart-title">{title}</div>
    {row ? <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{left:10,right:10,top:10,bottom:0}}>
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={.12}/>
        <XAxis dataKey="month" tickLine={false} axisLine={false}/>
        <YAxis hide/>
        <Tooltip formatter={(v) => [typeof v === "number" ? new Intl.NumberFormat("fr-MA",{maximumFractionDigits:0}).format(v) : v, row.unit ?? ""]}/>
        <Line type="monotone" dataKey="value" stroke="#001152" strokeWidth={2.5} dot={false}/>
      </LineChart>
    </ResponsiveContainer> : <div className="missing">Donnée absente : {title}</div>}
  </div>;
}
