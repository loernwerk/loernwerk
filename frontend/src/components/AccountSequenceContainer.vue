<template>
  <ContainerComponent>
    <div v-for="sequence in sequencesArray" :key="sequence.code">
      <ContainerComponent>
        <div class="flex flex-col">
          <div>
            {{ sequence.name }}
          </div>
          <div class="flex">
            <ButtonComponent> anzeigen </ButtonComponent>
            <ButtonComponent> löschen </ButtonComponent>
          </div>
        </div>
      </ContainerComponent>
    </div>
  </ContainerComponent>
</template>
<script setup lang="ts">
import { PropType, ref } from 'vue';
import { ISequence } from '../../../model/sequence/ISequence';
import ContainerComponent from './ContainerComponent.vue';
import ButtonComponent from './ButtonComponent.vue';

const props = defineProps({
  sequences: {
    type: Object as PropType<Array<ISequence>>,
    required: true,
  },
});

const sequencesArray = ref(props.sequences);
</script>
