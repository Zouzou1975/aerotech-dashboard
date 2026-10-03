import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const prefix = ["II.","I.","III.","IV.","8.","9.","10.","V.","VI.","VII.","IX.","15.","X."];

export function WaterfallChart({ rows }: { rows: (string | number | null)[][] }) {
  const data = useMemo(() => rows.map((r) => ({ label:String(r[1] ?? "").slice(0,18), value: typeof r[15] === "number" ? r[15] : 0 })), [rows]);
  const filtered = data.filter((d) => prefix.some((p) => d.label.startsWith(p)));
  return <div className="chart-card waterfall"><div className="chart-title">Formation du résultat · 2023</div>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={filtered} margin={{left:0,right:10,top:10,bottom:60}}>
        <XAxis dataKey="label" angle={-35} textAnchor="end" interval={0} tick={{fontSize:10}}/>
        <YAxis hide/><Tooltip formatter={(v) => [new Intl.NumberFormat("fr-MA",{maximumFractionDigits:0}).format(Number(v)),"MAD"]}/>
        <Bar dataKey="value">
          {filtered.map((_, i) => <Cell key={i} fill="#001152" fillOpacity={i % 2 ? .65 : 1}/>)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>;
}
