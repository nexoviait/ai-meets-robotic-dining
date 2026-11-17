import { describe, expect, it } from "vitest";
import { DISTRICT_HUB_PLAN } from "@/lib/district-hub-plan";
import { INITIAL_DISTRICT_COORDINATES } from "@/lib/district-hub-coordinates.server";

describe("national district rollout plan", () => {
  it("contains exactly 64 unique districts and coordinates", () => {
    expect(DISTRICT_HUB_PLAN).toHaveLength(64);
    expect(new Set(DISTRICT_HUB_PLAN.map((district) => district.id)).size).toBe(64);
    expect(Object.keys(INITIAL_DISTRICT_COORDINATES)).toHaveLength(64);
    for (const district of DISTRICT_HUB_PLAN) {
      expect(INITIAL_DISTRICT_COORDINATES[district.id]).toBeDefined();
      expect(district.query).toContain("Bangladesh");
    }
  });

  it("assigns 6 pilot, 18 regional and 40 national candidates", () => {
    expect(DISTRICT_HUB_PLAN.filter((district) => district.phase === 1)).toHaveLength(6);
    expect(DISTRICT_HUB_PLAN.filter((district) => district.phase === 2)).toHaveLength(18);
    expect(DISTRICT_HUB_PLAN.filter((district) => district.phase === 3)).toHaveLength(40);
  });

  it("keeps Dhaka in the pilot and uses the confirmed flagship address", () => {
    const dhaka = DISTRICT_HUB_PLAN.find((district) => district.id === "dhaka");
    expect(dhaka?.phase).toBe(1);
    expect(dhaka?.query).toBe("Gawsia Twin Peak, 30 N Circular Rd, Dhaka 1205, Bangladesh");
    expect(
      DISTRICT_HUB_PLAN.filter((district) => district.phase === 1).map((district) => district.name),
    ).toEqual(["Barishal", "Chattogram", "Dhaka", "Khulna", "Rajshahi", "Sylhet"]);
  });

  it("rotates all districts through eight bounded nightly refresh batches", () => {
    const batches = Array.from({ length: 8 }, (_, batch) =>
      DISTRICT_HUB_PLAN.filter((_, index) => index % 8 === batch),
    );
    expect(batches.every((batch) => batch.length === 8)).toBe(true);
    expect(new Set(batches.flat().map((district) => district.id)).size).toBe(64);
  });
});
