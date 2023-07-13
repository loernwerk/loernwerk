<template>
  <ContainerComponent class="h-full">
    <template #Header>
      <h1 class="underline text-xl">{{ name }}</h1>

      <div class="mt-2" v-for="sequence in sequences" :key="sequence.name">
        <SequenceDisplayPreview :name="sequence.name" @popUpOpened="$emit('popUpOpened')"></SequenceDisplayPreview>
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

<style></style>
