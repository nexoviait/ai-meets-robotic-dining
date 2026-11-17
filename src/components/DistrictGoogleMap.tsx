import { useEffect, useRef, useState } from "react";
import { Map as MapIcon } from "lucide-react";
import { PHASE_INFO, type DistrictHubLocation, type RolloutPhase } from "@/lib/district-hub-plan";

const MARKER_COLORS: Record<RolloutPhase, string> = {
  1: "#F59E0B",
  2: "#38BDF8",
  3: "#A855F7",
};

const DARK_MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#111629" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#AAB3CB" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#111629" }] },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#2A3350" }],
  },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#202842" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#171D34" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#090B16" }] },
  { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#0D1324" }] },
];

function markerIcon(phase: RolloutPhase, selected: boolean): google.maps.Symbol {
  return {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: MARKER_COLORS[phase],
    fillOpacity: 1,
    strokeColor: selected ? "#F5F7FF" : "#111629",
    strokeWeight: selected ? 3 : 1.5,
    scale: selected ? 9 : 6.5,
  };
}

interface DistrictGoogleMapProps {
  locations: readonly DistrictHubLocation[];
  visibleLocations: readonly DistrictHubLocation[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function DistrictGoogleMap({
  locations,
  visibleLocations,
  selectedId,
  onSelect,
}: DistrictGoogleMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const infoRef = useRef<google.maps.InfoWindow | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const selectRef = useRef(onSelect);
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable" | "error">("loading");
  selectRef.current = onSelect;
  const visibleKey = visibleLocations.map((location) => location.id).join(",");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let cancelled = false;
    const listeners: google.maps.MapsEventListener[] = [];
    const key = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"];
    const channel = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID"] ?? "";
    const authorized = window.location.hostname.endsWith(".lovable.app");
    if (!authorized || !key) {
      setStatus("unavailable");
      return;
    }

    const initialize = () => {
      if (cancelled) return;
      const map = new google.maps.Map(container, {
        center: { lat: 23.75, lng: 90.38 },
        zoom: 7,
        minZoom: 6,
        maxZoom: 13,
        clickableIcons: false,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        styles: DARK_MAP_STYLES,
        restriction: {
          latLngBounds: { north: 27.2, south: 20.3, east: 93.2, west: 87.4 },
          strictBounds: false,
        },
      });
      mapRef.current = map;
      infoRef.current = new google.maps.InfoWindow();
      const markers = new Map<string, google.maps.Marker>();
      for (const location of locations) {
        const marker = new google.maps.Marker({
          map,
          position: { lat: location.lat, lng: location.lng },
          title: `${location.name} — ${PHASE_INFO[location.phase].timing}`,
          icon: markerIcon(location.phase, location.id === selectedId),
        });
        listeners.push(marker.addListener("click", () => selectRef.current(location.id)));
        markers.set(location.id, marker);
      }
      markersRef.current = markers;
      setStatus("ready");
    };

    if (window.google?.maps) {
      initialize();
    } else {
      const callbackName = "__aiHubBdDistrictMapInit";
      const callbackWindow = window as unknown as Record<string, () => void>;
      callbackWindow[callbackName] = initialize;
      const existing = document.getElementById("aihub-google-maps-script");
      if (!existing) {
        const script = document.createElement("script");
        script.id = "aihub-google-maps-script";
        script.async = true;
        script.src = `https://maps.googleapis.com/maps/api/js?${new URLSearchParams({ key, loading: "async", callback: callbackName, channel, language: "en", region: "BD" })}`;
        script.onerror = () => setStatus("error");
        document.head.appendChild(script);
      }
      return () => {
        cancelled = true;
        delete callbackWindow[callbackName];
        listeners.forEach((listener) => listener.remove());
        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current.clear();
      };
    }

    return () => {
      cancelled = true;
      listeners.forEach((listener) => listener.remove());
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current.clear();
    };
    // The map is created once per location collection; selection is handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations]);

  useEffect(() => {
    if (status !== "ready" || !mapRef.current) return;
    const visible = new Set(visibleKey ? visibleKey.split(",") : []);
    markersRef.current.forEach((marker, id) =>
      marker.setMap(visible.has(id) ? mapRef.current : null),
    );
    if (visibleLocations.length === 0) return;
    if (visibleLocations.length === 1) {
      mapRef.current.setCenter({ lat: visibleLocations[0]!.lat, lng: visibleLocations[0]!.lng });
      mapRef.current.setZoom(9);
      return;
    }
    const bounds = new google.maps.LatLngBounds();
    visibleLocations.forEach((location) => bounds.extend({ lat: location.lat, lng: location.lng }));
    mapRef.current.fitBounds(bounds, 32);
    // visibleKey tracks the same filtered collection without reinitializing the map.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, visibleKey]);

  useEffect(() => {
    if (status !== "ready") return;
    markersRef.current.forEach((marker, id) => {
      const location = locations.find((item) => item.id === id);
      if (location) marker.setIcon(markerIcon(location.phase, id === selectedId));
    });
    const selected = locations.find((location) => location.id === selectedId);
    const marker = markersRef.current.get(selectedId);
    if (!selected || !marker || !mapRef.current || !infoRef.current || !marker.getMap()) {
      infoRef.current?.close();
      return;
    }
    const content = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = `${selected.name} AI Hub`;
    const phase = document.createElement("p");
    phase.textContent = `${PHASE_INFO[selected.phase].timing} · ${PHASE_INFO[selected.phase].title}`;
    const note = document.createElement("p");
    note.textContent =
      selected.id === "dhaka"
        ? "Confirmed flagship address"
        : "Proposed district reference point · venue to be confirmed";
    content.append(title, phase, note);
    infoRef.current.setContent(content);
    infoRef.current.open({ map: mapRef.current, anchor: marker });
    mapRef.current.panTo({ lat: selected.lat, lng: selected.lng });
  }, [locations, selectedId, status]);

  return (
    <div className="relative h-[430px] overflow-hidden rounded-2xl border border-border bg-muted md:h-[560px]">
      <div
        ref={containerRef}
        className="absolute inset-0 h-full w-full"
        aria-label="Interactive Google Map of 64 proposed AI Hub district locations"
      />
      {status !== "ready" && (
        <div className="absolute inset-0 grid place-items-center bg-card/70 p-6 text-center backdrop-blur-sm">
          <div className="max-w-sm">
            <MapIcon className="mx-auto h-8 w-8 text-secondary" />
            <p className="mt-3 font-bold">
              {status === "loading" && "Loading the national district map…"}
              {status === "error" && "The map could not load"}
              {status === "unavailable" && "Interactive map available on the published site"}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {status === "error"
                ? "Use the district explorer to view every location and rollout phase."
                : "The district explorer includes all 64 locations, filters and selection details."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
