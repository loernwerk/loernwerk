<!-- Component for inputing text -->
<template>
  <InteractableComponent class="!cursor-default">
    <input
      :type="hidden ? 'password' : 'text'"
      :maxLength="maxLength"
      :placeholder="placeHolder"
      v-model="inputText"
      class="cursor-pointer w-full placeholder:text-gray-500"
    />
  </InteractableComponent>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import InteractableComponent from './InteractableComponent.vue';

defineProps({
  /**
   * The placeholder text for the input
   */
  placeHolder: {
    type: String,
    required: false,
    default: '',
  },

  /**
   * The maximum length of the input
   */
  maxLength: {
    type: Number,
    required: false,
    default: -1,
  },

  /**
   * Whether the input should be hidden
   */
  hidden: {
    type: Boolean,
    required: false,
    default: false,
  },
});
const emit = defineEmits([
  /**
   * Event for when the input was changed
   *
   * @param inputText The text in the input
   */
  'input-changed',
]);

const inputText = ref('');

watch(inputText, (newValue) => {
  emit('input-changed', newValue);
});
</script>
