/**
 * Whether Google Maps may load on this origin with Lovable's managed connector key.
 *
 * Only Lovable app origins (*.lovable.app) qualify: the key is referrer-restricted to them
 * (Google answers RefererNotAllowedMapError elsewhere, including localhost), and other origins
 * must not receive credential-bearing preview hostnames through referrers. Everywhere else the
 * district map falls back to DistrictSchematicMap and the office map to a directions link.
 */
export function mapsAllowedOn(hostname: string) {
  return hostname.endsWith(".lovable.app");
}

export const mapsAllowedHere = () =>
  typeof window !== "undefined" && mapsAllowedOn(window.location.hostname);
