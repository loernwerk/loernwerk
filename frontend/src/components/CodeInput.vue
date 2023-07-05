<template>
  <TextInputComponent
    uppercase
    class="w-64 text-7xl font-mono border-2"
    :class="{ 'border-red-600': showRedBorder }"
    :max-length="codeLength"
    @input-changed="(text) => updateCode(text)"
  />
</template>

<script setup lang="ts">
import TextInputComponent from './TextInputComponent.vue';

defineProps({
  /**
   * Display red border line
   */
  showRedBorder: {
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
