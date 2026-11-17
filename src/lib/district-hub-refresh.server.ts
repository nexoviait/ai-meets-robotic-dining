import { z } from "zod";
import { DISTRICT_HUB_PLAN, type DistrictHubPlan } from "./district-hub-plan";

const pointSchema = z.object({ lat: z.number().min(20).max(27), lng: z.number().min(87).max(94) });
const placesSchema = z.object({
  places: z
    .array(z.object({ location: z.object({ latitude: z.number(), longitude: z.number() }) }))
    .min(1),
});
const geocodeSchema = z.object({
  results: z.array(z.object({ geometry: z.object({ location: pointSchema }) })).min(1),
  status: z.string(),
});

async function locateDistrict(plan: DistrictHubPlan, gatewayKey: string, lovableKey: string) {
  const headers = {
    Authorization: `Bearer ${lovableKey}`,
    "X-Connection-Api-Key": gatewayKey,
  };
  const response =
    plan.id === "dhaka"
      ? await fetch(
          `https://connector-gateway.lovable.dev/google_maps/maps/api/geocode/json?${new URLSearchParams({ address: plan.query, components: "country:BD", region: "bd" })}`,
          { headers },
        )
      : await fetch(
          "https://connector-gateway.lovable.dev/google_maps/places/v1/places:searchText",
          {
            method: "POST",
            headers: {
              ...headers,
              "Content-Type": "application/json",
              "X-Goog-FieldMask": "places.location",
            },
            body: JSON.stringify({ textQuery: plan.query, pageSize: 1, regionCode: "bd" }),
          },
        );

  if (!response.ok) {
    const body = await response.text();
    console.error(`Google Maps district lookup failed [${response.status}]: ${body}`);
    if (response.status === 403) {
      throw new Error(
        `Google Maps request was denied (403). Check the server key restrictions. Provider response: ${body}`,
      );
    }
    throw new Error(`Google Maps provider request failed [${response.status}]: ${body}`);
  }

  const payload: unknown = await response.json();
  if (plan.id === "dhaka") {
    const parsed = geocodeSchema.parse(payload);
    if (parsed.status !== "OK") throw new Error(`Dhaka geocoding returned ${parsed.status}`);
    return parsed.results[0]!.geometry.location;
  }
  const parsed = placesSchema.parse(payload);
  const location = parsed.places[0]!.location;
  return pointSchema.parse({ lat: location.latitude, lng: location.longitude });
}

export async function refreshDistrictHubBatch(dayStamp: number) {
  const gatewayKey = process.env["GOOGLE_MAPS_API_KEY"];
  const lovableKey = process.env["LOVABLE_API_KEY"];
  if (!gatewayKey || !lovableKey)
    throw new Error("Google Maps connector credentials are not configured.");

  const batchIndex = Math.abs(Math.trunc(dayStamp)) % 8;
  const batch = DISTRICT_HUB_PLAN.filter((_, index) => index % 8 === batchIndex);
  if (batch.length !== 8) throw new Error("The district refresh batch is incomplete.");

  const refreshed: { id: string; lat: number; lng: number }[] = [];
  for (let index = 0; index < batch.length; index += 4) {
    const group = batch.slice(index, index + 4);
    const locations = await Promise.all(
      group.map(async (plan) => ({
        id: plan.id,
        ...(await locateDistrict(plan, gatewayKey, lovableKey)),
      })),
    );
    refreshed.push(...locations);
  }

  const geocodedAt = new Date().toISOString();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const rows = refreshed.map((point) => {
    const plan = DISTRICT_HUB_PLAN.find((district) => district.id === point.id)!;
    return {
      district_id: plan.id,
      district_name: plan.name,
      geocode_query: plan.query,
      rollout_phase: plan.phase,
      latitude: point.lat,
      longitude: point.lng,
      geocoded_at: geocodedAt,
    };
  });
  const { error } = await supabaseAdmin.from("district_hub_locations").upsert(rows);
  if (error) throw new Error(`Could not save refreshed district coordinates: ${error.message}`);

  return { batchIndex, count: refreshed.length, geocodedAt };
}
