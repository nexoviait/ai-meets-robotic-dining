// Source: Google Maps Platform Code Assist
import { useHydrated } from "@tanstack/react-router";
import { HUB } from "@/lib/data";
import { useLang } from "@/lib/i18n";

export function OfficeMap() {
  const hydrated = useHydrated();
  const { lang, t } = useLang();
  const key = import.meta.env['VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY'];
  const authorized = hydrated && window.location.hostname.endsWith('.lovable.app');
  const params = new URLSearchParams({
    key: key ?? '', q: HUB.address, zoom: '16', language: lang, region: 'BD',
    solution_id: 'gmp_lovable_agentskills_v1',
  });
  return (
    <div className="h-80 overflow-hidden rounded-lg border border-border bg-muted">
      {authorized && key ? (
        <iframe title="Google Maps — Gawsia Twin Peak, Dhaka" src={`https://www.google.com/maps/embed/v1/place?${params}`} width="100%" height="320" className="h-full w-full border-0" loading="lazy" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
          <p className="font-semibold">{HUB.address}</p>
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(HUB.address)}`} target="_blank" rel="noreferrer" className="text-secondary underline underline-offset-4">{t("Get directions", "দিকনির্দেশনা")}</a>
        </div>
      )}
    </div>
  );
}