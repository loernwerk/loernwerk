<template>
  <div class="absolute top-0 bottom-0 left-0 right-0 flex flex-col">
    <div class="relative top-0 left-0 bottom-0 right-0 p-5 flex flex-grow">
      <ContainerComponent class="flex-1">
        <template #Header>
          <h1 class="text-2xl font-bold">Main View</h1>
        </template>
        <template #default>
          <TextInputComponent placeHolder="Test123" />
          <div v-for="i in 100" :key="i">i</div>
        </template>
      </ContainerComponent>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Text } from 'vue';
import ContainerComponent from '../components/ContainerComponent.vue';
import InteractableComponent from '../components/InteractableComponent.vue';
import TextInputComponent from '../components/TextInputComponent.vue';
</script>
