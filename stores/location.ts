import { useMapStore } from "./map";
import { useSidebarStore } from "./sidebar";

type Locations = {
  id: string;
  name: string;
  description: string;
  lat: number;
  long: number;
}[];

export const useLocationStore = defineStore("useLocationStore", () => {
  const { data, status, refresh } = useFetch<Locations>("/api/locations", {
    lazy: true,
  });

  const sidebarStore = useSidebarStore();
  const mapStore = useMapStore();

  effect(() => {
    if (data.value) {
      sidebarStore.loading = false;
      sidebarStore.sidebarItems = data.value.map(location => ({
        id: `location-${location.id}`,
        label: location.name,
        icon: "tabler:map-pin-filled",
        href: "#",
      }));
      mapStore.mapPoints = data.value.map(location => ({
        id: location.id,
        label: location.name,
        description: location?.description,
        lat: location.lat,
        long: location.long,
      }));
    }

    sidebarStore.loading = status.value === "pending";
  });

  return {
    locations: data,
    status,
    refresh,
  };
});
