import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useState } from "react";
import { StationListbox } from "@/components/StationListbox";
import type { StationId } from "@/lib/data";

vi.mock("@/lib/i18n", () => ({ useLang: () => ({ lang: "en", t: (english: string) => english }) }));
afterEach(cleanup);
beforeEach(() => { Element.prototype.scrollIntoView = vi.fn(); });

function setup() {
  const change = vi.fn();
  function Menu() {
    const [value, setValue] = useState<StationId>("coffee");
    return <StationListbox value={value} onChange={(next) => { setValue(next); change(next); }} />;
  }
  render(<Menu />);
  return change;
}

describe("station keyboard selection", () => {
  it("selects the next station with Right Arrow", () => {
    const change = setup();
    fireEvent.keyDown(screen.getByRole("option", { name: "Coffee & Tea Bar" }), { key: "ArrowRight" });
    expect(change).toHaveBeenLastCalledWith("snack");
  });
  it("selects the previous station with Left Arrow", () => {
    const change = setup();
    fireEvent.click(screen.getByRole("option", { name: "Lunch & Dinner Station" }));
    fireEvent.keyDown(screen.getByRole("option", { name: "Lunch & Dinner Station" }), { key: "ArrowLeft" });
    expect(change).toHaveBeenLastCalledWith("snack");
  });
  it("selects the final station with End", () => {
    const change = setup();
    fireEvent.keyDown(screen.getByRole("option", { name: "Coffee & Tea Bar" }), { key: "End" });
    expect(change).toHaveBeenLastCalledWith("integrated");
  });
  it("selects the first station with Home", () => {
    const change = setup();
    fireEvent.click(screen.getByRole("option", { name: "Food-Service Station" }));
    fireEvent.keyDown(screen.getByRole("option", { name: "Food-Service Station" }), { key: "Home" });
    expect(change).toHaveBeenLastCalledWith("coffee");
  });
});