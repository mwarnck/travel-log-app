<script setup lang="ts">
import type { FetchError } from "ofetch";

import { toTypedSchema } from "@vee-validate/zod";
import { useMapStore } from "~~/stores/map";

import type { NominatimResult } from "~/lib/types";

import { CENTER_EUROPE } from "~/lib/constants";
import { InsertLocation } from "~/lib/db/schema";

const mapStore = useMapStore();

const { $csrfFetch } = useNuxtApp();
const router = useRouter();
const loading = ref(false);
const submitted = ref(false);
const submitError = ref("");
const { handleSubmit, errors, meta, setErrors, setFieldValue, controlledValues } = useForm({
  // @ts-expect-error lookup and fix later...
  validationSchema: toTypedSchema(InsertLocation),
  initialValues: {
    name: "",
    description: "",
    long: (CENTER_EUROPE as [number, number])[0],
    lat: (CENTER_EUROPE as [number, number])[1],
  },
});

const onSubmit = handleSubmit(async (values) => {
  try {
    submitError.value = "";
    loading.value = true;
    await $csrfFetch("/api/locations", {
      method: "post",
      body: values,
    });
    submitted.value = true;
    navigateTo("/dashboard");
  }
  catch (e) {
    const error = e as FetchError;
    if (error.data?.data) {
      setErrors(error.data?.data);
    }

    submitError.value = error.data?.statusMessage || error.statusMessage || "An unknown error occured!";
  }
  loading.value = false;
});

function formatNumber(value?: number) {
  if (!value)
    return 0;
  return value.toFixed(5);
}

function searchResultSelected(result: NominatimResult) {
  setFieldValue("name", result.display_name);
  mapStore.addedMapPoint = {
    id: 1,
    name: "Added map point",
    description: "",
    long: Number(result.lon),
    lat: Number(result.lat),
    centerMap: true,
  };
}

effect(() => {
  if (mapStore.addedMapPoint) {
    setFieldValue("long", mapStore.addedMapPoint.long);
    setFieldValue("lat", mapStore.addedMapPoint.lat);
  }
});

onMounted(() => {
  mapStore.addedMapPoint = {
    id: 1,
    name: "Added map point",
    description: "",
    long: (CENTER_EUROPE as [number, number])[0],
    lat: (CENTER_EUROPE as [number, number])[1],
  };
});

onBeforeRouteLeave(() => {
  if (meta.value.dirty && !submitted.value) {
    // eslint-disable-next-line no-alert
    const confirm = window.confirm("Are you sure you want to leave? All changes will be deleted.");
    if (!confirm) {
      return false;
    }
  }
  mapStore.addedMapPoint = null;
  return true;
});
</script>

<template>
  <div
    class="container max-w-md mx-auto p-4"
  >
    <div class="my-4">
      <h1 class="text-lg">
        Add Location
      </h1>
      <p class="text-sm">
        A location is a place you have traveled or will travel to. It can be city, country, state or point of interest. You can add specific times you visited this location after adding it.
      </p>
    </div>
    <div
      v-if="submitError"
      role="alert"
      class="alert alert-error"
    >
      <span>{{ submitError }}</span>
    </div>
    <form class="flex flex-col gap-2" @submit.prevent="onSubmit">
      <FormField
        name="name"
        label="Name"
        type="text"
        :error="errors.name"
        :disabled="loading"
      />
      <FormField
        name="description"
        label="Description"
        type="textarea"
        :error="errors.description"
        :disabled="loading"
      />
      <p class="text-xs text-gray-400">
        Current coordinates: {{ formatNumber(controlledValues.lat) }}, {{ formatNumber(controlledValues.long) }}
      </p>
      <p>To set location coordinates:</p>
      <ul class="list-disc ml-4 text-sm">
        <li>
          Drag the <Icon name="tabler:map-pin-filled" class="text-warning" /> marker on the map.
        </li>
        <li>Double click on the specific location on the map.</li>
        <li>Search for an location with the search bar below.</li>
      </ul>
      <div class="flex justify-end gap-2">
        <button
          :disabled="loading"
          type="button"
          class="btn btn-outline"
          @click="router.back()"
        >
          <Icon name="tabler:arrow-left" size="24" />
          Cancel
        </button>
        <button
          :disabled="loading"
          type="submit"
          class="btn btn-primary"
        >
          Add
          <span v-if="loading" class="loading loading-spinner loading-sm" />
          <Icon
            v-else
            name="tabler:circle-plus-filled"
            size="24"
          />
        </button>
      </div>
    </form>
    <div class="divider" />
    <LocationSearch @result-selected="searchResultSelected" />
  </div>
</template>
