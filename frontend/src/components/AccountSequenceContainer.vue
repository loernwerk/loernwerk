<template>
  <ContainerComponent>
    <template #Header>
      <h1 class="underline text-xl">Sequenzen des Nutzers:</h1>
    </template>
    <div v-for="sequence in sequencesArray" :key="sequence.code">
      <ContainerComponent>
        <div class="flex flex-col">
          <div>
            {{ sequence.name }}
          </div>
          <div class="flex">
            <ButtonComponent @click="showSequence(sequence.code)">
              anzeigen
            </ButtonComponent>

            <ButtonComponent @click="deleteSequence(sequence.code)">
              löschen
            </ButtonComponent>
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
import { SequenceRestInterface } from '../restInterfaces/SequenceRestInterface';

const props = defineProps({
  sequences: {
    type: Object as PropType<Array<ISequence>>,
    required: true,
  },
});

/**
 * Shows the selected Sequence
 * @param code the code of the sequence
 */
function showSequence(code: string): void {
  void code;
  //redirect
}

/**
 * Deletes the sequence
 * @param code the code of the sequence
 */
function deleteSequence(code: string): void {
  SequenceRestInterface.deleteSequence(code);
}

const sequencesArray = ref(props.sequences);
</script>
