import { useEffect } from "react";
import { fr } from "../../i18n/fr";
import { useFinanceStore } from "../../store/useFinanceStore";
import { SyncToggle } from "../sync/SyncToggle";
import { UploadButton } from "../sync/UploadButton";
import { SyncStatus } from "../sync/SyncStatus";

export function Sidebar() {
  const section = useFinanceStore((s) => s.section);
  const setSection = useFinanceStore((s) => s.setSection);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (/^[1-4]$/.test(e.key)) setSection(Number(e.key) as 1|2|3|4);
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const delta = e.key === "ArrowDown" ? 1 : -1;
        setSection(((section - 1 + delta + 4) % 4 + 1) as 1|2|3|4);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [section, setSection]);

  return (
    <aside className="sidebar glass-panel">
      <div className="brand-mark">AT</div>
      <nav aria-label="Sections">
        {fr.sections.map((label, i) => {
          const id = (i + 1) as 1|2|3|4;
          return <button key={label} className={section === id ? "nav-item active" : "nav-item"} onClick={() => setSection(id)}>
            <span className="nav-number">0{id}</span><span>{label}</span>
          </button>;
        })}
      </nav>
      <div className="sidebar-bottom">
        <SyncToggle />
        <SyncStatus />
        <UploadButton />
      </div>
    </aside>
  );
}
