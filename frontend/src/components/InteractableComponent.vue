<!-- Base for all interactable components -->
<template>
  <ContainerComponent
    class="bg-interactable border-interactable cursor-pointer !shadow-none !max-h-fit py-1"
  >
    <template #Header>
      <!-- Slot for the comtent of the component -->
      <slot></slot>
    </template>
  </ContainerComponent>
</template>

<script setup lang="ts">
import ContainerComponent from './ContainerComponent.vue';
</script>
