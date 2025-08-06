<script setup lang="ts">
import type { NominatimResult } from "~/lib/types";

import { SearchSchema } from "~/lib/zod-schemas";

const searchResults = ref<NominatimResult[]>([]);

async function onSubmit(query: Record<string, string>) {
  try {
    const fetchResults = await $fetch("/api/search", {
      query,
    });
    searchResults.value = fetchResults as NominatimResult[];
  }
  catch (e) {
    console.log(e);
  }
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <Form
      v-slot="{ errors }"
      class="flex flex-col gap-2 items-center"
      :validation-schema="toTypedSchema(SearchSchema)"
      :initial-values="{ q: '' }"
      @submit="onSubmit"
    >
      <div class="join mt-4">
        <div>
          <label class="input join-item">
            <Icon name="tabler:search" />
            <Field
              type="text"
              name="q"
              placeholder="Search for locations..."
              :class="{ 'input-error': errors.q }"
            /></label>
          <div v-if="errors.q" class="validator-hint text-error">
            {{ errors.q }}
          </div>
        </div>
        <button class="btn btn-neutral join-item">
          Search
        </button>
      </div>
    </Form>
    <div class="flex flex-col gap-2 overflow-auto max-h-72 mt-2">
      <div
        v-for="result in searchResults"
        :key="result.place_id"
        class="card card-sm bg-base-100"
      >
        <div class="card-body">
          <h4 class="card-title">
            {{ result.display_name }}
          </h4>
          <div class="card-actions justify-end">
            <button class="btn btn-primary btn-sm">
              Set Location
              <Icon name="tabler:map-pin-share" size="20" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
