import { MENU, type MenuItem } from "./data";

export interface CartLine {
  key: string;
  itemId: string;
  qty: number;
  options: Record<string, string>;
  extras: string[];
  unitPrice: number;
}

export interface Order {
  id: string;
  token: string;
  lines: CartLine[];
  total: number;
  payment: string;
  customer: string;
  phone: string;
  createdAt: number;
  counter: number;
  durationSec: number;
}

export const EXTRAS: Record<string, { id: string; name: string; price: number }[]> = {
  coffee: [
    { id: "extra-shot", name: "Extra shot", price: 40 },
    { id: "oat", name: "Oat milk", price: 50 },
  ],
  tea: [{ id: "ginger", name: "Ginger & lemon", price: 15 }],
  snacks: [
    { id: "fries-side", name: "Side fries", price: 60 },
    { id: "drink", name: "Soft drink", price: 50 },
    { id: "cheese", name: "Extra cheese", price: 30 },
  ],
  lunch: [
    { id: "egg", name: "Boiled egg", price: 25 },
    { id: "salad", name: "Extra salad", price: 30 },
    { id: "borhani", name: "Borhani", price: 60 },
  ],
  dinner: [
    { id: "egg", name: "Boiled egg", price: 25 },
    { id: "borhani", name: "Borhani", price: 60 },
    { id: "firni", name: "Firni dessert", price: 70 },
  ],
};

export const OPTIONS: Record<string, { name: string; values: string[] }[]> = {
  coffee: [
    { name: "Size", values: ["Regular", "Large (+৳40)"] },
    { name: "Sugar level", values: ["No sugar", "Less", "Normal", "Extra"] },
  ],
  tea: [{ name: "Sugar level", values: ["No sugar", "Less", "Normal", "Extra"] }],
  snacks: [{ name: "Serve", values: ["Fresh hot", "Packed to-go"] }],
  lunch: [{ name: "Spice level", values: ["Mild", "Medium", "Hot", "Extra hot"] }],
  dinner: [{ name: "Spice level", values: ["Mild", "Medium", "Hot", "Extra hot"] }],
};

export function unitPrice(item: MenuItem, options: Record<string, string>, extras: string[]) {
  const extraTotal = (EXTRAS[item.category] ?? []).filter((e) => extras.includes(e.id)).reduce((s, e) => s + e.price, 0);
  const sizeUp = options["Size"]?.startsWith("Large") ? 40 : 0;
  return item.price + extraTotal + sizeUp;
}

export const cartTotal = (lines: CartLine[]) => lines.reduce((s, l) => s + l.unitPrice * l.qty, 0);
export const findItem = (id: string) => MENU.find((m) => m.id === id);

/** Simulated prep time: the slowest item plus a little per extra item, scaled down for demo pacing. */
export function prepDuration(lines: CartLine[]) {
  const slowest = Math.max(30, ...lines.map((l) => findItem(l.itemId)?.prepSeconds ?? 60));
  const count = lines.reduce((s, l) => s + l.qty, 0);
  return Math.round(Math.min(90, slowest / 4 + count * 3));
}

export const STAGES = ["Order Placed", "Robotic Arms Preparing", "Quality Check Tray", "Ready at Smart Counter"] as const;

export function orderStage(order: Pick<Order, "createdAt" | "durationSec">, now: number) {
  const elapsed = (now - order.createdAt) / 1000;
  const d = order.durationSec;
  if (elapsed >= d) return { stage: 3, progress: 1 };
  if (elapsed >= d * 0.75) return { stage: 2, progress: elapsed / d };
  if (elapsed >= d * 0.1) return { stage: 1, progress: elapsed / d };
  return { stage: 0, progress: Math.max(0, elapsed / d) };
}
