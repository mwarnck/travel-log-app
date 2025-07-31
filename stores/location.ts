import { useSidebarStore } from "./sidebar";

type Locations = {
  id: string;
  name: string;
  description: string;
}[];

export const useLocationStore = defineStore("useLocationStore", () => {
  const { data, status, refresh } = useFetch<Locations>("/api/locations", {
    lazy: true,
  });

  const sidebarStore = useSidebarStore();

  watchEffect(() => {
    if (data.value) {
      sidebarStore.loading = false;
      sidebarStore.sidebarItems = data.value.map((location: { name: any; id: any }) => ({
        id: `location-${location.id}`,
        label: location.name,
        icon: "tabler:map-pin-filled",
        href: "#",
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
