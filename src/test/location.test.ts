import { describe, expect, it } from "vitest";
import { HUB } from "@/lib/data";

it("uses the owner's confirmed location", () => {
  expect(HUB.address).toBe("Gawsia Twin Peak, 30 N Circular Rd, Dhaka 1205");
});

describe("district maps", () => {
  it("loads Google Maps only on Lovable app origins", async () => {
    const { mapsAllowedOn } = await import("@/lib/maps-origin");
    expect(mapsAllowedOn("ai-meets-robotic-dining.lovable.app")).toBe(true);
    expect(mapsAllowedOn("localhost")).toBe(false);
    expect(mapsAllowedOn("lovable.app.evil.com")).toBe(false);
  });
  it("places every cached district inside the built-in map", async () => {
    const { projectToMap, MAP_WIDTH, MAP_HEIGHT } = await import("@/lib/district-map-projection");
    const { INITIAL_DISTRICT_COORDINATES } = await import("@/lib/district-hub-coordinates.server");
    const points = Object.values(INITIAL_DISTRICT_COORDINATES);
    expect(points).toHaveLength(64);
    for (const { lat, lng } of points) {
      const { x, y } = projectToMap(lat, lng);
      expect(x).toBeGreaterThan(0);
      expect(x).toBeLessThan(MAP_WIDTH);
      expect(y).toBeGreaterThan(0);
      expect(y).toBeLessThan(MAP_HEIGHT);
    }
  });
});

it("keeps the office map pin on the geocoded flagship coordinates", async () => {
  const { INITIAL_DISTRICT_COORDINATES } = await import("@/lib/district-hub-coordinates.server");
  expect(HUB.coordinates).toEqual(INITIAL_DISTRICT_COORDINATES["dhaka"]);
});
