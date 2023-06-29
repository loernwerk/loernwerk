<!-- Button to interact with -->
<template>
  <InteractableComponent @click="(e) => $emit('click', e)">
    <!-- Slot for the text of the button -->
    <slot></slot>
  </InteractableComponent>
</template>

<script setup lang="ts">
import InteractableComponent from './InteractableComponent.vue';

defineEmits([
  /**
   * Event for when the Button is clicked
   *
   * @param e The click event
   */
  'click',
]);
</script>
