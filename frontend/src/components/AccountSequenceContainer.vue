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
            <div v-if="showError">Löschen fehlgeschlagen</div>
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
import { PropType, ref, watch } from 'vue';
import { ISequence } from '../../../model/sequence/ISequence';
import ContainerComponent from './ContainerComponent.vue';
import ButtonComponent from './ButtonComponent.vue';
import { SequenceRestInterface } from '../restInterfaces/SequenceRestInterface';
import { router } from '../router';

const props = defineProps({
  sequences: {
    type: Object as PropType<Array<ISequence>>,
    required: true,
  },
});

const emit = defineEmits(['sequenceDelete']);

const sequencesArray = ref(props.sequences);

watch(
  () => props.sequences,
  (newVal) => {
    sequencesArray.value = newVal;
    console.log(newVal);
  }
);

const showError = ref(false);
/**
 * Shows the selected Sequence
 * @param code the code of the sequence
 */
function showSequence(code: string): void {
  void code;
  router.push('/'.concat(code));
}

/**
 * Deletes the sequence
 * @param code the code of the sequence
 */
function deleteSequence(code: string): void {
  try {
    SequenceRestInterface.deleteSequence(code);
    emit('sequenceDelete');
  } catch {
    showError.value = true;
  }
}
</script>
