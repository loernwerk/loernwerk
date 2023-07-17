<template>
  <ContainerComponent class="h-full">
    <template #Header>
      <h1 class="underline text-xl">{{ name }}</h1>
    </template>

    <template #default>
      <div class="mt-2" v-for="sequence in sequences" :key="sequence.name">
        <SequenceDisplayPreview
          :sequence="sequence"
          @reload-sequences="$emit('reloadSequences')"
        ></SequenceDisplayPreview>
      </div>
    </template>
  </ContainerComponent>
</template>

<script setup lang="ts">
import SequenceDisplayPreview from '../contentDisplay/SequenceDisplayPreview.vue';
import { ISequence } from '../../../../model/sequence/ISequence';
import ContainerComponent from '../ContainerComponent.vue';

defineProps({
  /**
   * Array of all sequences which should be displayed in the overview
   */
  sequences: {
    type: Array<ISequence>,
    required: true,
  },
  /**
   * Title to describe the overview
   */
  name: {
    type: String,
    required: true,
  },
});

defineEmits([
  /**
   * Triggers SequenceOverview to reload sequences
   */
  'reloadSequences',
]);
</script>
