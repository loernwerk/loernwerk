<template>
  <div
    class="fixed z-50 bg-black bg-opacity-20 flex items-center justify-center inset-0"
  >
    <div class="relative">
      <FontAwesomeIcon
        icon="window-close"
        size="lg"
        class="absolute top-3 right-3 cursor-pointer"
        @click="$emit('closed')"
      />
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { library } from '@fortawesome/fontawesome-svg-core';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faWindowClose);

defineEmits([
  /**
   * Emitted when the popup is closed
   */
  'closed',
]);
</script>
