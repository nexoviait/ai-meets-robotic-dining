// Bundled locally (not Lovable's /__l5e asset proxy) so images load on any host.
import coffee from "@/assets/coffee-tea-bar.jpg";
import snack from "@/assets/snack-station.jpg";
import meals from "@/assets/lunch-dinner-station.jpg";
import integrated from "@/assets/food-service-station.jpg";
import type { StationId } from "./data";

export const STATION_IMG: Record<StationId, string> = {
  coffee,
  snack,
  meals,
  integrated,
};
