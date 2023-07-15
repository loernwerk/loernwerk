<template>
  <ContainerComponent class="h-full">
    <template #Header>
      <h1 class="underline text-xl">{{ name }}</h1>

      <div class="mt-2" v-for="sequence in sequences" :key="sequence.name">
        <SequenceDisplayPreview :sequence="sequence" name="sequence.name"  ></SequenceDisplayPreview>
      </div>
    </template>
  </ContainerComponent>
</template>

<script setup lang="ts">
import SequenceDisplayPreview from '../contentDisplay/SequenceDisplayPreview.vue';
import { ISequence } from '../../../../model/sequence/ISequence';
import ContainerComponent from '../ContainerComponent.vue';

defineProps({
  sequences: Object as () => ISequence[],
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
