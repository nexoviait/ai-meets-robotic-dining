import { describe, expect, it } from "vitest";
import { dhakaNow, dhakaSlotStart, slotHasPassed } from "@/lib/dhaka-time";
import { buildIcs, escapeIcsText } from "@/lib/ics";

describe("Dhaka time", () => {
  it("uses the hub's date even when UTC is still on the previous day", () => {
    // 20:30 UTC on 16 Nov is 02:30 on 17 Nov in Dhaka.
    expect(dhakaNow(Date.UTC(2026, 10, 16, 20, 30))).toEqual({ date: "2026-11-17", hour: 2 });
  });
  it("anchors slot starts to UTC+6", () => {
    expect(dhakaSlotStart("2026-11-17", 6).toISOString()).toBe("2026-11-17T00:00:00.000Z");
  });
  it("only marks same-day slots that have ended", () => {
    const now = { date: "2026-11-17", hour: 12 };
    expect(slotHasPassed("morning", "2026-11-17", now)).toBe(true);
    expect(slotHasPassed("afternoon", "2026-11-17", now)).toBe(false);
    expect(slotHasPassed("morning", "2026-11-18", now)).toBe(false);
    expect(slotHasPassed("night", "2026-11-17", { date: "2026-11-17", hour: 23 })).toBe(false);
  });
});

describe("calendar export", () => {
  it("escapes commas, semicolons and newlines", () => {
    expect(escapeIcsText("a, b; c\\d\ne")).toBe("a\\, b\\; c\\\\d\\ne");
  });
  it("produces folded lines no longer than 75 octets", () => {
    const ics = buildIcs({
      id: "HUB-1",
      title: "AI HUB BD session — Standard AI Workstation",
      start: dhakaSlotStart("2026-11-17", 6),
      hours: 5,
      location: "Gawsia Twin Peak, 30 N Circular Rd, Dhaka 1205",
      description: "Ticket HUB-1 · Focus: Idea Discovery ".repeat(5),
    });
    expect(ics).toContain("LOCATION:Gawsia Twin Peak\\, 30 N Circular Rd\\, Dhaka 1205");
    expect(ics).toContain("DTSTART:20261117T000000Z");
    const enc = new TextEncoder();
    for (const line of ics.split("\r\n")) expect(enc.encode(line).length).toBeLessThanOrEqual(75);
  });
});
