import { describe, expect, it } from "vitest";
import { FUNDS, RAISE_CR, BREAK_EVEN_MONTHLY_CR, ROADMAP, cr } from "@/lib/data";

describe("capital plan", () => {
  it("raises BDT 12,200 Cr in total", () => {
    expect(RAISE_CR).toBe(12200);
    expect(FUNDS.reduce((s, f) => s + f.value, 0)).toBe(12200);
  });
  it("splits the raise across six funds in crore", () => {
    expect(FUNDS.find((f) => f.name === "Facility fit-out")?.value).toBe(3050);
    expect(FUNDS.find((f) => f.name === "Reserve")?.value).toBe(1220);
    expect(cr(3050)).toBe("3,050");
    expect(cr(12200)).toBe("12,200");
  });
  it("sets the break-even run-rate at BDT 872 Cr a month", () => {
    expect(BREAK_EVEN_MONTHLY_CR).toBe(872);
    const last = ROADMAP.find((r) => r.phase === "Phase 4");
    expect(last?.points.join(" ")).toContain("BDT 872 Cr monthly revenue run-rate");
  });
});
