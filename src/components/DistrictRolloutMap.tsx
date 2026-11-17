import { useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { BadgeCheck, Building2, CircleDashed, Info, MapPin, Navigation, Search } from "lucide-react";
import { DistrictGoogleMap } from "./DistrictGoogleMap";
import { KeyScrollRegion } from "./KeyScrollRegion";
import { HUB, MIN_HUB_SQFT } from "@/lib/data";
import { districtHubStatus, PHASE_INFO, type DistrictHubLocation, type RolloutPhase } from "@/lib/district-hub-plan";
import { cn } from "@/lib/utils";

const PHASE_BADGES: Record<RolloutPhase, string> = {
  1: "border-gold/30 bg-gold/10 text-gold",
  2: "border-secondary/30 bg-secondary/10 text-secondary",
  3: "border-primary/30 bg-primary/10 text-primary-glow",
};

const PHASE_DOTS: Record<RolloutPhase, string> = {
  1: "bg-gold",
  2: "bg-secondary",
  3: "bg-primary-glow",
};

function MapFallback() {
  return (
    <div
      className="h-[430px] animate-pulse rounded-2xl border border-border bg-muted md:h-[560px]"
      aria-label="Loading district map"
    />
  );
}

export function DistrictRolloutMap({ locations }: { locations: readonly DistrictHubLocation[] }) {
  const [phase, setPhase] = useState<"all" | RolloutPhase>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("dhaka");
  const phaseLocations =
    phase === "all" ? locations : locations.filter((location) => location.phase === phase);
  const normalizedSearch = search.trim().toLocaleLowerCase();
  const visibleLocations = phaseLocations.filter((location) =>
    location.name.toLocaleLowerCase().includes(normalizedSearch),
  );
  const selected = locations.find((location) => location.id === selectedId) ?? locations[0];

  const choosePhase = (nextPhase: "all" | RolloutPhase) => {
    setPhase(nextPhase);
    const nextLocations =
      nextPhase === "all"
        ? locations
        : locations.filter((location) => location.phase === nextPhase);
    const firstMatch = nextLocations.find((location) =>
      location.name.toLocaleLowerCase().includes(normalizedSearch),
    );
    if (firstMatch) setSelectedId(firstMatch.id);
  };

  const updateSearch = (value: string) => {
    setSearch(value);
    const normalized = value.trim().toLocaleLowerCase();
    const matches = phaseLocations.filter((location) =>
      location.name.toLocaleLowerCase().includes(normalized),
    );
    const firstMatch = matches[0];
    if (firstMatch && !matches.some((location) => location.id === selectedId)) {
      setSelectedId(firstMatch.id);
    }
  };

  return (
    <div className="mt-8">
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Filter districts by rollout phase"
      >
        <button
          type="button"
          onClick={() => choosePhase("all")}
          aria-pressed={phase === "all"}
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            phase === "all"
              ? "border-foreground/40 bg-foreground/10"
              : "border-border text-muted-foreground",
          )}
        >
          All districts <span className="ml-1 text-xs">64</span>
        </button>
        {([1, 2, 3] as const).map((phaseNumber) => (
          <button
            key={phaseNumber}
            type="button"
            onClick={() => choosePhase(phaseNumber)}
            aria-pressed={phase === phaseNumber}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              PHASE_BADGES[phaseNumber],
              phase !== phaseNumber && "bg-transparent opacity-70",
            )}
          >
            Phase {phaseNumber}{" "}
            <span className="ml-1 text-xs">
              {locations.filter((location) => location.phase === phaseNumber).length}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
        {([1, 2, 3] as const).map((phaseNumber) => (
          <span key={phaseNumber} className="inline-flex items-center gap-2">
            <span className={cn("h-2.5 w-2.5 rounded-full", PHASE_DOTS[phaseNumber])} />
            {PHASE_INFO[phaseNumber].timing} · {PHASE_INFO[phaseNumber].title}
          </span>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs" aria-label="Hub confirmation status legend">
        <span className="inline-flex items-center gap-2 text-secondary"><BadgeCheck className="h-4 w-4" />C · Confirmed flagship (Dhaka)</span>
        <span className="inline-flex items-center gap-2 text-muted-foreground"><CircleDashed className="h-4 w-4" />P · Proposed hub (63 districts)</span>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(330px,0.8fr)]">
        <div>
          <ClientOnly fallback={<MapFallback />}>
            <DistrictGoogleMap
              locations={locations}
              visibleLocations={visibleLocations}
              selectedId={selected?.id ?? ""}
              onSelect={setSelectedId}
            />
          </ClientOnly>
          <p className="mt-3 flex gap-2 text-xs leading-5 text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            <span>
              <strong className="text-foreground">Illustrative rollout scenario:</strong> phase
              assignments are proposed, not approved. Dhaka is the confirmed flagship; all other
              markers are district reference points, not selected venues. Phase 4 connects all 64
              hubs into the national ecosystem and adds no separate locations.
            </span>
          </p>
        </div>

        <aside className="glass min-w-0 rounded-2xl p-4" aria-label="District explorer">
          <label
            htmlFor="district-search"
            className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
          >
            Find a district
          </label>
          <div className="relative mt-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="district-search"
              type="search"
              value={search}
              onChange={(event) => updateSearch(event.target.value)}
              placeholder="Search all 64 districts"
              className="h-11 w-full rounded-xl border border-border bg-background/60 pl-10 pr-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground" aria-live="polite">
            Showing {visibleLocations.length} of 64 planned district hubs
          </p>

          {selected && (
            <div
              className="mt-4 rounded-xl border border-primary/30 bg-primary/5 p-4"
              aria-live="polite"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-extrabold">{selected.name} AI Hub</p>
                  <p className={cn("mt-2 inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-bold", districtHubStatus(selected.id).confirmed ? "border-secondary/30 bg-secondary/10 text-secondary" : "border-border text-muted-foreground")}>
                    {districtHubStatus(selected.id).confirmed ? <BadgeCheck className="h-3.5 w-3.5 shrink-0" /> : <CircleDashed className="h-3.5 w-3.5 shrink-0" />}
                    {districtHubStatus(selected.id).label}
                  </p>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold",
                    PHASE_BADGES[selected.phase],
                  )}
                >
                  Phase {selected.phase}
                </span>
              </div>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                {PHASE_INFO[selected.phase].description}
              </p>
              <div className="mt-3 grid gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-secondary" />
                  Minimum {MIN_HUB_SQFT.toLocaleString("en-US")} sq ft
                </span>
                <span className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  {selected.id === "dhaka"
                    ? HUB.address
                    : "District reference point · exact venue to be confirmed"}
                </span>
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selected.id === "dhaka" ? HUB.address : `${selected.lat},${selected.lng}`)}`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-secondary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                View reference point <Navigation className="h-3.5 w-3.5" />
              </a>
            </div>
          )}

          <KeyScrollRegion
            label="District location list"
            positionLabel={(position) => `District list scrolled to ${position}%`}
            className="mt-4 max-h-80 overflow-y-auto pr-1 xl:max-h-[310px]"
          >
            {visibleLocations.length > 0 ? (
              <ul className="grid gap-1.5" aria-label="Planned district hubs">
                {visibleLocations.map((location) => (
                  <li key={location.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(location.id)}
                      aria-pressed={selected?.id === location.id}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        selected?.id === location.id
                          ? "border-primary/50 bg-primary/10"
                          : "border-transparent hover:border-border hover:bg-card/60",
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          className={cn(
                            "h-2 w-2 shrink-0 rounded-full",
                            PHASE_DOTS[location.phase],
                          )}
                        />
                        <span className="min-w-0"><span className="block font-semibold">{location.name}</span><span className={cn("block text-[11px]", districtHubStatus(location.id).confirmed ? "text-secondary" : "text-muted-foreground")}>{districtHubStatus(location.id).label}</span></span>
                      </span>
                      <span className="text-xs text-muted-foreground">Phase {location.phase}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-xl border border-dashed border-border p-5 text-center text-sm text-muted-foreground">
                No districts match “{search}”. Try another name or phase.
              </div>
            )}
          </KeyScrollRegion>
          <p className="mt-3 border-t border-border pt-3 text-[11px] leading-4 text-muted-foreground">
            District reference coordinates: Google Maps Platform. Rollout phases: AI HUB BD planning
            scenario.
          </p>
        </aside>
      </div>
    </div>
  );
}
