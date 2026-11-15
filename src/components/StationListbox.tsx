import { useId, useRef, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { STATIONS, type StationId } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function StationListbox({ value, onChange, className, kiosk = false }: {
  value: StationId;
  onChange: (station: StationId) => void;
  className?: string;
  kiosk?: boolean;
}) {
  const { t, lang } = useLang();
  const id = useId();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const selected = STATIONS.find((station) => station.id === value);
  const name = selected ? (lang === "bn" ? selected.bn : selected.name) : "";

  const navigate = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    let next = index;
    switch (event.key) {
      case "ArrowRight": next = Math.min(index + 1, STATIONS.length - 1); break;
      case "ArrowLeft": next = Math.max(index - 1, 0); break;
      case "Home": next = 0; break;
      case "End": next = STATIONS.length - 1; break;
      default: return;
    }
    event.preventDefault();
    const station = STATIONS[next];
    if (!station) return;
    refs.current[next]?.focus({ preventScroll: true });
    refs.current[next]?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" });
    if (station.id !== value) onChange(station.id);
  };

  return (
    <>
      <div role="listbox" aria-label={t("Food stations", "ফুড স্টেশনসমূহ")} aria-orientation="horizontal" aria-describedby={`${id}-selection`} className={cn("nice-scroll flex gap-2 overflow-x-auto pb-2", className)}>
        {STATIONS.map((station, index) => (
          <Button
            key={station.id}
            ref={(element) => { refs.current[index] = element; }}
            type="button"
            variant="ghost"
            role="option"
            aria-selected={value === station.id}
            tabIndex={value === station.id ? 0 : -1}
            onKeyDown={(event) => navigate(event, index)}
            onClick={() => onChange(station.id)}
            className={cn("h-auto min-h-11 shrink-0 rounded-xl border px-4 font-semibold transition focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background forced-colors:focus-visible:outline-2 forced-colors:focus-visible:outline-offset-2", kiosk ? "py-4 text-base" : "py-2.5 text-sm", value === station.id ? "border-primary bg-primary/15 text-foreground shadow-glow" : "border-border text-muted-foreground hover:text-foreground")}
          >
            {lang === "bn" ? station.bn : station.name.replace("Automated ", "")}
          </Button>
        ))}
      </div>
      <span id={`${id}-selection`} className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {t(`Selected station: ${name}`, `নির্বাচিত স্টেশন: ${name}`)}
      </span>
    </>
  );
}