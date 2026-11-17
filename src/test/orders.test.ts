import { describe, expect, it } from "vitest";
import { MENU } from "@/lib/data";
import { orderStage, unitPrice } from "@/lib/orders";

const item = (id: string) => MENU.find((m) => m.id === id)!;

describe("menu prices from the brief", () => {
  it("lunch menu prices", () => {
    expect([
      item("chicken-curry").price,
      item("beef-curry").price,
      item("fish-curry").price,
      item("veg-meal").price,
    ]).toEqual([220, 280, 240, 180]);
  });
  it("dinner menu prices", () => {
    expect([
      item("chicken-biryani").price,
      item("beef-tehari").price,
      item("khichuri").price,
      item("combo").price,
    ]).toEqual([250, 300, 200, 320]);
  });
});

describe("order pricing", () => {
  it("adds extras and large size", () => {
    expect(unitPrice(item("latte"), { Size: "Large (+৳40)" }, ["extra-shot"])).toBe(190 + 40 + 40);
  });
});

describe("prep tracker", () => {
  it("is ready after its duration", () => {
    expect(orderStage({ createdAt: 0, durationSec: 40 }, 41_000).stage).toBe(3);
    expect(orderStage({ createdAt: 0, durationSec: 40 }, 1_000).stage).toBe(0);
  });
});
