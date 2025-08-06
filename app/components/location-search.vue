<script setup lang="ts">
import type { FetchError } from "ofetch";

import type { NominatimResult } from "~/lib/types";

import { SearchSchema } from "~/lib/zod-schemas";

const emit = defineEmits<{
  resultSelected: [result: NominatimResult];
}>();

const searchResults = ref<NominatimResult[]>([]);
const form = useTemplateRef("searchForm");
const hasSearched = ref(false);
const loading = ref(false);
const searchError = ref("");

async function onSubmit(query: Record<string, string>) {
  try {
    searchResults.value = [];
    loading.value = true;
    searchError.value = "";
    const fetchResults = await $fetch("/api/search", {
      query,
    });
    hasSearched.value = true;
    searchResults.value = fetchResults as NominatimResult[];
  }
  catch (e) {
    const error = e as FetchError;
    searchError.value = error.data?.statusMessage || error.statusMessage || "An unknown error ocurred.";
  }
  loading.value = false;
}

function setLocation(location: NominatimResult) {
  emit("resultSelected", location);
  searchResults.value = [];
  loading.value = false;
  hasSearched.value = false;
  searchError.value = "";
  if (form.value)
    form.value?.resetForm();
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <Form
      ref="searchForm"
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
              :disabled="loading"
              type="text"
              name="q"
              placeholder="Search for locations..."
              :class="{ 'input-error': errors.q }"
            /></label>
          <div v-if="errors.q" class="validator-hint text-error">
            {{ errors.q }}
          </div>
        </div>
        <button :disabled="loading" class="btn btn-neutral join-item">
          Search
        </button>
      </div>
    </Form>
    <div
      v-if="!loading && searchError"
      class="alert alert-error"
      role="alert"
    >
      {{ searchError }}
    </div>
    <div v-if="loading" class="flex">
      <span class="loading loading-lg" />
    </div>
    <div
      v-if="!loading && hasSearched && searchResults.length === 0"
      class="alert alert-warning"
      role="alert"
    >
      No results found.
    </div>
    <div v-if="loading" class="flex">
      <span class="loading loading-lg" />
    </div>
    <div class="flex flex-col gap-2 overflow-auto max-h-60 mt-2">
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
            <button class="btn btn-warning btn-sm" @click="setLocation(result)">
              Set Location
              <Icon name="tabler:map-pin-share" size="20" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
