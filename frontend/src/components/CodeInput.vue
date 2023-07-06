<template>
  <div class="relative">
    <div
      class="absolute w-full h-full text-center bg-gray-300 bg-opacity-70 rounded-md"
      v-if="disableInputShowSpinner"
    >
      <FontAwesomeIcon icon="spinner" size="3x" class="animate-spin mt-5" />
    </div>
    <TextInputComponent
      :uppercase="true"
      :disabled="disableInputShowSpinner"
      class="w-64 text-7xl font-mono border-2"
      :class="{ 'border-red-600': showRedBorder }"
      :max-length="codeLength"
      @input-changed="(text) => updateCode(text)"
    />
  </div>
</template>

<script setup lang="ts">
import TextInputComponent from './TextInputComponent.vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

library.add(faSpinner);

defineProps({
  /**
   * Display red border line
   */
  showRedBorder: {
    type: Boolean,
    required: true,
  },

  disableInputShowSpinner: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits([
  /**
   * Event for when all digits have been entered
   *
   * @param code The code that was entered
   */
  'code-entered',

  /**
   * Event for when code input field is emptied
   */
  'code-emptied',
]);

const codeLength = 6;

/**
 * Function gets triggered by the TextInputComponent when the input was changed
 *
 * @param code The code that was entered
 */
function updateCode(code: string): void {
  if (code.length == codeLength) {
    emit('code-entered', code.toUpperCase());
  }

  if (code.length == 0) {
    emit('code-emptied');
  }
}
</script>
