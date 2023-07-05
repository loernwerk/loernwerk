<!-- Button to interact with -->
<template>
  <div>
    <div class="relative">
      <div class="absolute w-full h-full text-center" v-if="loading">
        <div
          class="absolute h-full w-full bg-gray-300 opacity-70 rounded-md"
        ></div>
        <FontAwesomeIcon icon="spinner" size="1x" class="animate-spin mt-2" />
      </div>
      <InteractableComponent @click="(e) => $emit('click', e)">
        <!-- Slot for the text of the button -->
        <slot></slot>
      </InteractableComponent>
    </div>
  </div>
</template>

<script setup lang="ts">
import InteractableComponent from './InteractableComponent.vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

library.add(faSpinner);

defineProps({
  /**
   * Whether the button displays a loading spinner
   */
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
});

defineEmits([
  /**
   * Event for when the Button is clicked
   *
   * @param e The click event
   */
  'click',
]);
</script>
