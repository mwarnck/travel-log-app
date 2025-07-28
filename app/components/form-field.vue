<script setup lang="ts">
const props = defineProps<{
  label: string;
  name: string;
  type: "text" | "textarea";
  error?: string;
}>();
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">
      {{ props.label }}
    </legend>
    <Field
      :as="props.type === 'textarea' ? 'textarea' : 'input'"
      :name="props.name"
      :type="props.type"
      class="w-full"
      :class="{
        'input-error': props.error,
        'input': props.type === 'text',
        'textarea': props.type === 'textarea',
      }"
    />
    <p v-if="props.error" class="fieldset-label text-error">
      {{ props.error }}
    </p>
  </fieldset>
</template>
