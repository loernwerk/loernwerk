<template>
  <TextInputComponent
    class="w-64 text-7xl font-mono"
    :max-length="codeLength"
    @input-changed="(text) => updateCode(text)"
  />
</template>

<script setup lang="ts">
import TextInputComponent from './TextInputComponent.vue';

const emit = defineEmits([
  /**
   * Event for when all digits have been entered
   *
   * @param code The code that was entered
   */
  'code-entered',
]);

const codeLength = 6;

/**
 * Function gets triggered by the TextInputComponent when the input was changed
 *
 * @param code The code that was entered
 */
function updateCode(code: string): void {
  if (code.length == codeLength) {
    emit('code-entered', code);
  }
}
</script>
