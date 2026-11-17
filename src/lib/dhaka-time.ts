import { SLOTS } from "./data";

/** Bangladesh Standard Time is UTC+6 with no daylight saving. */
const DHAKA_OFFSET_MS = 6 * 3600_000;

/** Today's date (YYYY-MM-DD) and hour at the hub, independent of the visitor's or server's time zone. */
export function dhakaNow(now = Date.now()) {
  const d = new Date(now + DHAKA_OFFSET_MS);
  return { date: d.toISOString().slice(0, 10), hour: d.getUTCHours() };
}

/** The instant a slot starts at the hub on the given Dhaka date. */
export function dhakaSlotStart(date: string, startHour: number) {
  return new Date(`${date}T${String(startHour).padStart(2, "0")}:00:00+06:00`);
}

/** Whether a same-day slot has already ended at the hub. Night Owl runs past midnight, so it never ends "today". */
export function slotHasPassed(slotId: string, date: string, now = dhakaNow()) {
  if (date !== now.date) return false;
  const slot = SLOTS.find((s) => s.id === slotId);
  if (!slot) return false;
  const end = slot.id === "night" ? 30 : slot.id === "evening" ? 23 : slot.start + 5;
  return now.hour >= end;
}
