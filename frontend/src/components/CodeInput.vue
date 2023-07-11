<!-- Component to enter code for sequence execution -->
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
      v-model:input="code"
    />
  </div>
</template>

<script setup lang="ts">
import TextInputComponent from './TextInputComponent.vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ref, watch } from 'vue';

library.add(faSpinner);

defineProps({
  /**
   * Display red border line
   */
  showRedBorder: {
    type: Boolean,
    required: true,
  },

  /**
   * Disable input and display spinner
   */
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
const code = ref('');

watch(code, (codeEntered) => {
  if (codeEntered.length == codeLength) {
    emit('code-entered', codeEntered.toUpperCase());
  }

  if (codeEntered.length == 0) {
    emit('code-emptied');
  }
});
</script>
