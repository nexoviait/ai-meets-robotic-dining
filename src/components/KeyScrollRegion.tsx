import { useRef, useState, type ReactNode } from "react";
import { nextScrollTop, scrollPercent } from "@/lib/scroll-keys";
import { cn } from "@/lib/utils";

export function KeyScrollRegion({ label, positionLabel, className, children }: { label: string; positionLabel: (pct: number) => string; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [msg, setMsg] = useState("");
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.target !== el || e.altKey || e.ctrlKey || e.metaKey) return;
    const max = el.scrollHeight - el.clientHeight;
    const top = nextScrollTop(e.key, el.scrollTop, el.clientHeight, max);
    if (top === null) return;
    e.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
    setMsg(positionLabel(scrollPercent(top, max)));
  };
  return (
    <>
      <div ref={ref} tabIndex={0} role="region" aria-label={label} aria-keyshortcuts="ArrowUp ArrowDown PageUp PageDown Home End" onKeyDown={onKeyDown} className={cn("nice-scroll", className)}>
        {children}
      </div>
      <span className="sr-only" aria-live="polite" aria-atomic="true">{msg}</span>
    </>
  );
}
