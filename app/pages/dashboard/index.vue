<script setup lang="ts">
// const { data, status } = await useFetch("/api/locations", {
//   lazy: true,
// });

// v-if="status === 'pending'"
// v-else-if="data && data.length > 0"
// v-for="location in data"
//  :key="location.id"
// {{ location.name }}
// {{ location.description }}
</script>

<template>
  <div class="p-4">
    <h2 class="text-2xl">
      Locations
    </h2>
    <div>
      <span class="loading loading-spinner loading-xl" />
    </div>
    <div

      class="flex flex-wrap mt-4 gap-2"
    >
      <div

        class="card card-compact bg-base-300 h-40 w-72"
      >
        <div class="card-body">
          <h3 class="text-xl">
            New York
          </h3>
          <p>Cool city</p>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-2 mt-4">
      <p>Add a location to get started</p>
      <NuxtLink to="/dashboard/add" class="btn btn-primary w-40">
        Add Location
        <Icon name="tabler:circle-plus-filled" size="24" />
      </NuxtLink>
    </div>
  </div>
</template>
