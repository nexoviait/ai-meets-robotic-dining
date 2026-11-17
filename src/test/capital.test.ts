import { describe, expect, it } from "vitest";
import {
  AVERAGE_HUB_USD,
  BDT_PER_USD,
  DISTRICT_HUB_COUNT,
  MIN_HUB_SQFT,
  NATIONAL_INVESTMENT_USD,
  PILOT_MAX_USD,
  PILOT_MIN_USD,
  ROADMAP,
  TOTAL_MIN_SQFT,
  crore,
  usdToBdtCrore,
} from "@/lib/data";

describe("national investment framework", () => {
  it("targets USD 100 million, not USD 1 billion", () => {
    expect(NATIONAL_INVESTMENT_USD).toBe(100_000_000);
    expect(NATIONAL_INVESTMENT_USD).not.toBe(1_000_000_000);
  });

  it("plans one minimum 8,000 sq ft hub in each of 64 districts", () => {
    expect(DISTRICT_HUB_COUNT).toBe(64);
    expect(MIN_HUB_SQFT).toBe(8_000);
    expect(TOTAL_MIN_SQFT).toBe(512_000);
    expect(AVERAGE_HUB_USD).toBe(1_562_500);
  });

  it("converts the national target at the indicative BDT 124.75 reference", () => {
    expect(BDT_PER_USD).toBe(124.75);
    expect(usdToBdtCrore(NATIONAL_INVESTMENT_USD)).toBe(1247.5);
    expect(crore(usdToBdtCrore(NATIONAL_INVESTMENT_USD))).toBe("1,247.50");
  });

  it("converts both USD 5–10 million pilot options correctly", () => {
    expect(PILOT_MIN_USD).toBe(5_000_000);
    expect(PILOT_MAX_USD).toBe(10_000_000);
    expect(crore(usdToBdtCrore(PILOT_MIN_USD))).toBe("62.375");
    expect(crore(usdToBdtCrore(PILOT_MAX_USD))).toBe("124.75");
    expect(PILOT_MIN_USD / NATIONAL_INVESTMENT_USD).toBe(0.05);
    expect(PILOT_MAX_USD / NATIONAL_INVESTMENT_USD).toBe(0.1);
  });

  it("makes national network development the third proposed phase", () => {
    const nationalPhase = ROADMAP.find((phase) => phase.phase === "Phase 3");
    expect(nationalPhase?.title).toBe("Connect all 64 districts");
    expect(nationalPhase?.points.join(" ")).toContain("one national AI ecosystem");
  });
});
