import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { DistrictHubLocation, RolloutPhase } from "./district-hub-plan";

export const getDistrictHubs = createServerFn({ method: "GET" }).handler(
  async (): Promise<DistrictHubLocation[]> => {
    const url = process.env["SUPABASE_URL"];
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
    if (!url || !key) throw new Error("The district map is not configured.");

    const supabasePublic = createClient<Database>(url, key, {
      auth: { persistSession: false },
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
            headers.delete("Authorization");
          }
          headers.set("apikey", key);
          return fetch(input, { ...init, headers });
        },
      },
    });

    const { data, error } = await supabasePublic
      .from("district_hub_locations")
      .select(
        "district_id, district_name, geocode_query, rollout_phase, latitude, longitude, geocoded_at",
      )
      .order("district_name");
    if (error) {
      console.error("District hub lookup failed", error.message);
      throw new Error("District locations are temporarily unavailable.");
    }
    if (data.length !== 64) throw new Error("The national district map is incomplete.");

    return data.map((row) => ({
      id: row.district_id,
      name: row.district_name,
      query: row.geocode_query,
      phase: row.rollout_phase as RolloutPhase,
      lat: row.latitude,
      lng: row.longitude,
      geocodedAt: row.geocoded_at,
    }));
  },
);
