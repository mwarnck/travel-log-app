import type { MapPoint } from "../app/lib/types";

export const useMapStore = defineStore("useMapStore", () => {
  const mapPoints = ref<MapPoint[]>([]);

  async function init() {
    const { useMap } = await import("@indoorequal/vue-maplibre-gl");
    const { LngLatBounds } = await import("maplibre-gl");

    const map = useMap();

    effect(() => {
      const firstMapPoint = mapPoints.value[0];
      if (!firstMapPoint) {
        return;
      }
      const bounds = mapPoints.value.reduce((bounds, mapPoint) => {
        return bounds.extend([mapPoint.long, mapPoint.lat]);
      }, new LngLatBounds([firstMapPoint.long, firstMapPoint.lat], [firstMapPoint.long, firstMapPoint.lat],
      ));
      map.map?.fitBounds(bounds, {
        padding: 60,
      });
    });
  }

  return {
    init,
    mapPoints,
  };
});
