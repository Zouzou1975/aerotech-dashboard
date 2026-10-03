const statusClass = (text: string) => {
  if (text.includes("n.s.") || text === "–") return "neutral";
  if (text.includes("Proportionnel")) return "blue";
  if (text.includes("Marge érodée")) return "orange";
  if (text.includes("Sens contraire") || text.includes("chute plus vite")) return "red";
  return "green";
};

export function ReadingBadge({ value }: { value: string }) {
  return <span className={`reading-badge ${statusClass(value)}`}>{value}</span>;
}
