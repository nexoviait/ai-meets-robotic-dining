import {
  districtHubStatus,
  PHASE_INFO,
  type DistrictHubLocation,
  type RolloutPhase,
} from "@/lib/district-hub-plan";
import {
  BANGLADESH_OUTLINE,
  MAP_HEIGHT,
  MAP_WIDTH,
  projectToMap,
} from "@/lib/district-map-projection";

/** Same phase colours as the Google Map markers. */
const PHASE_COLORS: Record<RolloutPhase, string> = {
  1: "#F59E0B",
  2: "#38BDF8",
  3: "#A855F7",
};

interface DistrictSchematicMapProps {
  locations: readonly DistrictHubLocation[];
  visibleLocations: readonly DistrictHubLocation[];
  selectedId: string;
  onSelect: (id: string) => void;
}

/**
 * Offline district map drawn from the cached coordinates. Shown wherever Google Maps can't load
 * (local development, non-Lovable origins, or a Maps outage) so the rollout network stays visible.
 * Keyboard and screen-reader selection stays in the district list beside the map.
 */
export function DistrictSchematicMap({
  locations,
  visibleLocations,
  selectedId,
  onSelect,
}: DistrictSchematicMapProps) {
  const visible = new Set(visibleLocations.map((location) => location.id));
  const selected = locations.find((location) => location.id === selectedId);
  // Draw the selected marker last so it sits on top.
  const ordered = [...locations]
    .filter((location) => visible.has(location.id))
    .sort((a, b) => Number(a.id === selectedId) - Number(b.id === selectedId));
  const label =
    selected && visible.has(selected.id) ? projectToMap(selected.lat, selected.lng) : null;

  return (
    <svg
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`Map of Bangladesh showing ${visible.size} of ${locations.length} planned AI Hub locations${selected ? `; ${selected.name} selected` : ""}`}
      className="h-full w-full"
    >
      <path
        d={BANGLADESH_OUTLINE}
        className="fill-card stroke-secondary/60"
        strokeWidth={3}
        strokeLinejoin="round"
      />
      {ordered.map((location) => {
        const { x, y } = projectToMap(location.lat, location.lng);
        const status = districtHubStatus(location.id);
        const isSelected = location.id === selectedId;
        return (
          <g key={location.id} onClick={() => onSelect(location.id)} className="cursor-pointer">
            <title>{`${location.name} AI Hub — ${status.label} — ${PHASE_INFO[location.phase].timing}`}</title>
            {isSelected && (
              <circle cx={x} cy={y} r={40} fill={PHASE_COLORS[location.phase]} opacity={0.25} />
            )}
            <circle
              cx={x}
              cy={y}
              r={isSelected ? 26 : 19}
              fill={PHASE_COLORS[location.phase]}
              fillOpacity={status.confirmed ? 1 : 0.55}
              stroke={isSelected ? "#F5F7FF" : "#111629"}
              strokeWidth={isSelected ? 5 : 3}
            />
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={isSelected ? 24 : 19}
              fontWeight={700}
              className="pointer-events-none fill-foreground"
            >
              {status.pinLabel}
            </text>
          </g>
        );
      })}
      {selected && label && (
        <text
          x={label.x + (label.x > MAP_WIDTH * 0.7 ? -40 : 40)}
          y={label.y}
          textAnchor={label.x > MAP_WIDTH * 0.7 ? "end" : "start"}
          dominantBaseline="central"
          fontSize={34}
          fontWeight={800}
          className="pointer-events-none fill-foreground"
          stroke="#111629"
          strokeWidth={8}
          paintOrder="stroke"
        >
          {selected.name}
        </text>
      )}
    </svg>
  );
}
