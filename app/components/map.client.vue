<script setup lang="ts">
import { useMapStore } from "~~/stores/map";

import { CENTER_EUROPE } from "~/lib/constants";

const mapStore = useMapStore();

const colorMode = useColorMode();
const style = computed(() => colorMode.value === "dark" ? "/styles/dark.json" : "https://tiles.openfreemap.org/styles/liberty",
);
const zoom = 5;

onMounted(() => {
  mapStore.init();
});
</script>

<template>
  <MglMap
    :map-style="style"
    :center="CENTER_EUROPE"
    :zoom="zoom"
  >
    <MglNavigationControl />
    <MglMarker
      v-if="mapStore.addedMapPoint"
      draggable
      :coordinates="CENTER_EUROPE"
    >
      <template #marker>
        <div
          class="tooltip tooltip-top hover: cursor-pointer"
          data-tip="Drag to your desired location"
        >
          <Icon
            name="tabler:map-pin-filled"
            size="37"
            class="text-warning"
          />
        </div>
      </template>
    </MglMarker>
    <MglMarker
      v-for="mapPoint in mapStore.mapPoints"
      :key="mapPoint.id"
      :coordinates="[mapPoint.long, mapPoint.lat]"
    >
      <template #marker>
        <div
          class="tooltip tooltip-top hover: cursor-pointer"
          :data-tip="mapPoint.name"
          :class="{ 'tooltip-open': mapStore.selectedMapPoint === mapPoint }"
          @mouseenter="mapStore.selectMapPointWithoutFlyTo(mapPoint)"
          @mouseleave="mapStore.selectMapPointWithoutFlyTo(null)"
        >
          <Icon
            name="tabler:map-pin-filled"
            size="32"
            :class="mapStore.selectedMapPoint === mapPoint ? 'text-accent' : 'text-secondary'"
          />
        </div>
      </template>
      <MglPopup>
        <h3 class="text-xl">
          {{ mapPoint.name }}
        </h3>
        <p v-if="mapPoint.description">
          {{ mapPoint.description }}
        </p>
      </MglPopup>
    </MglMarker>
  </MglMap>
</template>
