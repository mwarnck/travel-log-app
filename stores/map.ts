import type { LngLatBounds } from "maplibre-gl";

import type { MapPoint } from "../app/lib/types";

export const useMapStore = defineStore("useMapStore", () => {
  const mapPoints = ref<MapPoint[]>([]);
  const selectedMapPoint = ref<MapPoint | null>(null);
  const withFlyTo = ref(true);

  function selectMapPointWithoutFlyTo(mapPoint: MapPoint | null) {
    withFlyTo.value = false;
    selectedMapPoint.value = mapPoint;
  }

  async function init() {
    const { useMap } = await import("@indoorequal/vue-maplibre-gl");
    const { LngLatBounds } = await import("maplibre-gl");

    const map = useMap();

    let bounds: LngLatBounds | null = null;

    effect(() => {
      const firstMapPoint = mapPoints.value[0];
      if (!firstMapPoint) {
        return;
      }
      bounds = mapPoints.value.reduce((bounds, mapPoint) => {
        return bounds.extend([mapPoint.long, mapPoint.lat]);
      }, new LngLatBounds([firstMapPoint.long, firstMapPoint.lat], [firstMapPoint.long, firstMapPoint.lat],
      ));
      map.map?.fitBounds(bounds, {
        padding: 60,
      });
    });

    effect(() => {
      if (selectedMapPoint.value) {
        if (withFlyTo.value) {
          map.map?.flyTo({
            center: [selectedMapPoint.value.long, selectedMapPoint.value.lat],
            speed: 0.6,
          });
        }
        withFlyTo.value = true;
      }
      else if (bounds) {
        map.map?.fitBounds(bounds, {
          padding: 60,
        });
      }
    });
  }

  return {
    init,
    mapPoints,
    selectedMapPoint,
    selectMapPointWithoutFlyTo,
  };
});
