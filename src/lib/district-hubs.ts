import { queryOptions } from "@tanstack/react-query";
import { getDistrictHubs } from "./district-hubs.functions";

export const districtHubsQueryOptions = queryOptions({
  queryKey: ["district-hub-locations"],
  queryFn: () => getDistrictHubs(),
  staleTime: 6 * 60 * 60 * 1000,
});
