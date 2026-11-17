import { describe, expect, it } from "vitest";
import { estimateRoi } from "@/lib/roi";

describe("ROI calculator", () => {
  it("growth kit saves 25% of manual hours", () => {
    const r = estimateRoi({
      staff: 10,
      manualHoursPerWeek: 10,
      hourlyCost: 200,
      monthlyRevenue: 0,
      packageId: "growth",
    });
    expect(Math.round(r.hoursSaved)).toBe(108);
  });
  it("uses package midpoint as investment", () => {
    expect(
      estimateRoi({
        staff: 1,
        manualHoursPerWeek: 1,
        hourlyCost: 1,
        monthlyRevenue: 0,
        packageId: "launch",
      }).investment,
    ).toBe(15000);
  });
});
