// Source: Google Maps Platform Code Assist
import { useHydrated } from "@tanstack/react-router";
import { HUB } from "@/lib/data";
import { mapsAllowedHere } from "@/lib/maps-origin";
import { useLang } from "@/lib/i18n";

/** Keyless OpenStreetMap embed centred on the hub, for origins where Google's key can't run. */
function osmEmbedUrl() {
  const { lat, lng } = HUB.coordinates;
  const params = new URLSearchParams({
    bbox: [lng - 0.006, lat - 0.004, lng + 0.006, lat + 0.004].map((n) => n.toFixed(6)).join(","),
    layer: "mapnik",
    marker: `${lat},${lng}`,
  });
  return `https://www.openstreetmap.org/export/embed.html?${params}`;
}

export function OfficeMap() {
  const hydrated = useHydrated();
  const { lang, t } = useLang();
  const key = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"];
  const authorized = hydrated && mapsAllowedHere();
  const params = new URLSearchParams({
    key: key ?? "",
    q: HUB.address,
    zoom: "16",
    language: lang,
    region: "BD",
    solution_id: "gmp_lovable_agentskills_v1",
  });
  const directions = (
    <a
      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(HUB.address)}`}
      target="_blank"
      rel="noreferrer"
      className="text-secondary underline underline-offset-4"
    >
      {t("Get directions", "দিকনির্দেশনা")}
    </a>
  );
  return (
    <div className="h-80 overflow-hidden rounded-lg border border-border bg-muted">
      {authorized && key ? (
        <iframe
          title="Google Maps — Gawsia Twin Peak, Dhaka"
          src={`https://www.google.com/maps/embed/v1/place?${params}`}
          width="100%"
          height="320"
          className="h-full w-full border-0"
          loading="lazy"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : hydrated ? (
        // Lovable's Google key only works on *.lovable.app, so other origins (local development,
        // custom domains) get a keyless OpenStreetMap embed. No referrer is sent, so preview
        // hostnames never reach a third party.
        <div className="relative h-full">
          <iframe
            title={`OpenStreetMap — ${HUB.address}`}
            src={osmEmbedUrl()}
            width="100%"
            height="320"
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <p className="absolute left-2 top-2 rounded-md bg-background/90 px-2.5 py-1.5 text-xs font-semibold shadow">
            {directions}
          </p>
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
          <p className="font-semibold">{HUB.address}</p>
          {directions}
        </div>
      )}
    </div>
  );
}
