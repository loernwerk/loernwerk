<template>
  <ContainerComponent
    class="bg-interactable border-interactable-border cursor-pointer !shadow-none !max-h-fit py-1"
  >
    <template #default>
      <slot></slot>
    </template>
  </ContainerComponent>
</template>

<script setup lang="ts">
import ContainerComponent from './ContainerComponent.vue';
</script>
