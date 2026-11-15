import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, Monitor, Users, Camera, Coffee, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useLocalStorage } from "@/lib/storage";
import { floorMotionEnabled } from "@/lib/floor-motion";
import { ZONES } from "@/lib/data";
import { cn } from "@/lib/utils";
import { click } from "@/lib/sound";
import workstations from "@/assets/floor-workstations.jpg";
import consultation from "@/assets/floor-consultation.jpg";
import studio from "@/assets/floor-studio.jpg";
import training from "@/assets/floor-training.jpg";
import cafe from "@/assets/floor-cafe.jpg";

const visuals = [
  { image: workstations, icon: Monitor, placement: "sm:col-span-3 sm:row-span-2", features: ["AI-enabled desks", "Premium AI tools", "Shared workspace"] },
  { image: consultation, icon: MessageSquare, placement: "", features: ["Private meeting space", "Human consultant review", "Solution planning"] },
  { image: studio, icon: Camera, placement: "", features: ["Photo & video", "Podcast recording", "Brand production"] },
  { image: training, icon: Users, placement: "sm:col-span-2", features: ["Workshops & clinics", "Community events", "Certification courses"] },
  { image: cafe, icon: Coffee, placement: "sm:col-span-2", features: ["Robotic coffee bar", "Automated meals", "24/7 service"] },
];

export function FloorZoneExplorer() {
  const [active, setActive] = useState(0);
  const [preference, setPreference] = useLocalStorage<boolean | null>("aihub.floorMotion", null);
  const [deviceReducedMotion, setDeviceReducedMotion] = useState(true);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setDeviceReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  const motion = floorMotionEnabled(preference, deviceReducedMotion);
  const zone = ZONES[active];
  const visual = visuals[active];
  if (!zone || !visual) return null;
  const Icon = visual.icon;
  return (
    <div className="floor-motion grid items-start gap-5 lg:gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]" data-motion={motion ? "on" : "off"}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 lg:col-span-2">
        <div className="min-w-0">
          <label htmlFor="floor-motion" className="text-sm font-semibold">Floor plan motion</label>
          <p id="floor-motion-status" aria-live="polite" className="mt-1 text-xs text-muted-foreground">{preference === null ? "Following system settings" : `Manual choice · Motion ${motion ? "on" : "off"}`}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {preference !== null && <Button variant="ghost" size="sm" aria-label="Reset floor plan motion to system settings" className="focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-4 focus-visible:ring-offset-background" onClick={() => setPreference(null)}>Use device setting</Button>}
          <Switch id="floor-motion" aria-label="Floor plan motion" aria-describedby="floor-motion-status" checked={motion} onCheckedChange={setPreference} className="transition-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-4 focus-visible:ring-offset-background [&>span]:transition-none" />
        </div>
      </div>
      <div role="group" aria-label="Floor plan zones" className="grid min-w-0 grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-4 sm:grid-rows-[180px_180px_220px]">
        {ZONES.map((z, i) => {
          const v = visuals[i];
          if (!v) return null;
          const ZoneIcon = v.icon;
          return (
            <Button key={z.id} variant="ghost" aria-pressed={i === active} aria-controls="floor-zone-details" onClick={() => { click(); setActive(i); }}
              className={cn("group relative flex h-40 min-w-0 flex-col items-stretch justify-end gap-0 overflow-hidden rounded-lg border p-0 text-left whitespace-normal transition-[border-color,box-shadow,background-color] duration-300 motion-reduce:transition-none sm:h-full hover:bg-card focus-visible:ring-2 focus-visible:ring-secondary", i === 0 && "col-span-2 sm:col-span-3", v.placement, i === active ? "border-secondary bg-card shadow-cyan" : "border-border bg-card")}>
              <img src={v.image} alt={`Sample ${z.name.toLowerCase()} concept`} loading="lazy" className="floor-zone-image min-h-0 w-full flex-1 object-cover transition-transform duration-500" />
              <span className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-md bg-background/90 text-secondary">{i === active ? <Check /> : <ZoneIcon />}</span>
              <span className="relative block min-h-16 bg-card px-2 py-2 sm:px-3 sm:py-3">
                <span className="block text-[11px] font-semibold text-gold">{z.sqft.toLocaleString()} SQ FT</span>
                <span className="mt-1 block text-sm font-bold leading-snug">{z.name}</span>
              </span>
            </Button>
          );
        })}
      </div>
      <div id="floor-zone-details" aria-live="polite" className="min-w-0 border-t border-secondary pt-4 lg:sticky lg:top-24">
        <div className="relative mb-5 aspect-[16/9] overflow-hidden rounded-lg bg-muted" aria-label={`${zone.name} visual preview`}>
          {visuals.map((v, i) => <img key={v.image} src={v.image} alt={i === active ? `Selected sample ${zone.name.toLowerCase()} visual` : ""} aria-hidden={i !== active} className={cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-500 motion-reduce:transition-none", i === active ? "opacity-100" : "opacity-0")} />)}
        </div>
        <div key={zone.id} className="floor-detail-enter sm:min-h-[420px]">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3"><Icon className="h-6 w-6 shrink-0 text-secondary" /><span className="shrink-0 text-xs text-muted-foreground">ZONE 0{active + 1} / 05</span></div>
        <p className="mt-6 text-xs font-bold text-gold">{zone.sqft.toLocaleString()} SQ FT</p>
        <h3 className="mt-2 text-2xl font-extrabold">{zone.name}</h3>
        <p className="mt-4 leading-relaxed text-muted-foreground">{zone.desc}</p>
        <ul className="mt-6 grid gap-3 border-y border-border py-5 text-sm">{visual.features.map(f => <li key={f} className="flex items-center gap-2"><Check className="h-4 w-4 text-secondary" />{f}</li>)}</ul>
        <p className="mt-5 text-xs text-muted-foreground">Open 6:00 AM – 11:00 PM · Café 24/7</p>
        <Button asChild className="mt-6 w-full bg-gradient-brand text-primary-foreground"><Link to="/book">Reserve your seat <ArrowUpRight /></Link></Button>
        </div>
      </div>
    </div>
  );
}