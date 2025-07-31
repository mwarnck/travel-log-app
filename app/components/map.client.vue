<script setup lang="ts">
import { CENTER_EUROPE } from "~/lib/constants";

const colorMode = useColorMode();
const style = computed(() => colorMode.value === "dark" ? "/styles/dark.json" : "https://tiles.openfreemap.org/styles/liberty",
);
const zoom = 5;
</script>

<template>
  <MglMap
    :map-style="style"
    :center="CENTER_EUROPE"
    :zoom="zoom"
  >
    <MglNavigationControl />
  </MglMap>
</template>
