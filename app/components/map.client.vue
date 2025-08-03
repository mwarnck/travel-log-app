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
      v-for="mapPoint in mapStore.mapPoints"
      :key="mapPoint.id"
      :coordinates="[mapPoint.long, mapPoint.lat]"
    >
      <template #marker>
        <div class="tooltip tooltip-top" :data-tip="mapPoint.label">
          <Icon
            name="tabler:map-pin-filled"
            size="32"
            class="text-secondary"
          />
        </div>
      </template>
    </MglMarker>
  </MglMap>
</template>
