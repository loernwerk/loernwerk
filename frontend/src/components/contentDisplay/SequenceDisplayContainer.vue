<template>
  <ContainerComponent class="h-full">
    <template #Header>
      <h1 class="underline text-xl">{{ name }}</h1>

      <div class="mt-2" v-for="sequence in sequences" :key="sequence.name">
        <SequenceDisplayPreview :name="sequence.name"></SequenceDisplayPreview>
      </div>
    </template>
  </ContainerComponent>
</template>

<script setup lang="ts">
import SequenceDisplayPreview from '../contentDisplay/SequenceDisplayPreview.vue';
import { ISequence } from '../../../../model/sequence/ISequence';
import ContainerComponent from '../ContainerComponent.vue';

defineProps({
  sequences: {
    type: Object as () => ISequence[],
    required: false,
  },
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});
</script>

<style>
.left-container {
  position: absolute;
  top: 20%;
  left: 1%;
  bottom: 1%;
  width: 49%; /* Set the width of the left container */
  background-color: #f2f2f2; /* Example background color */
  padding: 10px; /* Padding for the containers */
  border: 1px solid #ccc; /* Grey border */
  border-radius: 10px; /* Rounded border */
  overflow: hidden; /* Hide overflowing content */
}

.container-pair {
  display: flex;
}
</style>
