<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";

import { InsertLocation } from "~/lib/db/schema";

const { handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(InsertLocation),
});

const onSubmit = handleSubmit((values) => {
  console.log(values);
});
</script>

<template>
  <div
    class="container max-w-md mx-auto"
  >
    <div class="my-4">
      <h1 class="text-lg">
        Add Location
      </h1>
      <p class="text-sm">
        A location is a place you have traveled or will travel to. It can be city, country, state or point of interest. You can add specific times you visited this location after adding it.
      </p>
    </div>
    <form class="flex flex-col gap-2" @submit.prevent="onSubmit">
      <FormField
        name="name"
        label="Name"
        type="text"
        :error="errors.name"
      />
      <FormField
        name="description"
        label="Description"
        type="textarea"
        :error="errors.description"
      />
      <FormField
        name="lat"
        label="Latitude"
        type="text"
        :error="errors.lat"
      />
      <FormField
        name="long"
        label="Longitude"
        type="text"
        :error="errors.long"
      />
      <div class="flex justify-end gap-2">
        <button type="button" class="btn btn-outline">
          <Icon name="tabler:arrow-left" size="24" />
          Cancel
        </button>
        <button type="submit" class="btn btn-primary">
          Add
          <Icon name="tabler:circle-plus-filled" size="24" />
        </button>
      </div>
    </form>
  </div>
</template>
