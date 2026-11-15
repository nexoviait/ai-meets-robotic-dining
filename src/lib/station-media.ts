import coffee from "@/assets/coffee-tea-bar.jpg.asset.json";
import snack from "@/assets/snack-station.jpg.asset.json";
import meals from "@/assets/lunch-dinner-station.jpg.asset.json";
import integrated from "@/assets/food-service-station.jpg.asset.json";
import type { StationId } from "./data";

export const STATION_IMG: Record<StationId, string> = {
  coffee: coffee.url,
  snack: snack.url,
  meals: meals.url,
  integrated: integrated.url,
};
