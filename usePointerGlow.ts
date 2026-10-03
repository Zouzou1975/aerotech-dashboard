import { useRef } from "react";

export function usePointerGlow<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const onPointerMove = (event: React.PointerEvent<T>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    el.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };
  return { ref, onPointerMove };
}
