<template>
  <div class="h-5 w-full bg-neutral-300 dark:bg-neutral-600">
    <div
      class="h-5 bg-blue-900 p-0.5 text-center text-xs font-medium leading-none text-white"
      :style="{ width: checkValueRange + '%' }"
    >
      {{ checkValueRange }}%
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const prop = defineProps({
  /**
   * Percentage number of progressbar. Value between 0 and 1.
   */
  percentage: {
    type: Number,
    required: true,
  },
});

const checkValueRange = computed(() => {
  return Math.max(0, Math.min(prop.percentage, 1)) * 100;
});
</script>
