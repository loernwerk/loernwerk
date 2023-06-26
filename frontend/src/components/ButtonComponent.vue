<template>
  <InteractableComponent @click="(e) => $emit('click', e)">
    <slot></slot>
  </InteractableComponent>
</template>

<script setup lang="ts">
import InteractableComponent from './InteractableComponent.vue';

defineEmits(['click']);
</script>
