<script setup lang="ts">
const props = defineProps<{
  label: string;
  name: string;
  type: "text" | "textarea" | "number";
  error?: string;
  disabled?: boolean;
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
      :disabled="props.disabled"
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
