import { expect, it } from "vitest";
import { HUB } from "@/lib/data";

it("uses the owner's confirmed location", () => {
  expect(HUB.address).toBe("Gawsia Twin Peak, 30 N Circular Rd, Dhaka 1205");
});