<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg p-6 shadow-xl">
      <slot></slot>
      <ButtonComponent
        @click="close"
        class="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
      >
        Close
      </ButtonComponent>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ButtonComponent from './ButtonComponent.vue';

defineEmits(['closed']);

let isOpen = ref('false');

/**
 *  const open = function containerOpen():void {
 *   isOpen = ref('true');
 * };
 */

/**
 * Sets popup to closed
 */
function close(): void {
  isOpen = ref('false');
}
</script>

<style scoped></style>
