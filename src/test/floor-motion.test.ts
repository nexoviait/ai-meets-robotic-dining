import { expect, it } from "vitest";
import { floorMotionEnabled } from "@/lib/floor-motion";

it("follows the device preference by default", () => {
  expect(floorMotionEnabled(null, true)).toBe(false);
  expect(floorMotionEnabled(null, false)).toBe(true);
});
it("allows the visitor to override either device setting", () => {
  expect(floorMotionEnabled(true, true)).toBe(true);
  expect(floorMotionEnabled(false, false)).toBe(false);
});