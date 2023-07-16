<template>
  <ContainerComponent>
    <template #Header>
      <h1 class="underline text-xl">Sequenzen des Nutzers:</h1>
    </template>
    <div v-for="sequence in sequences" :key="sequence.code">
      <ContainerComponent>
        <div class="flex flex-col">
          <div>
            {{ sequence.name }}
          </div>
          <div class="flex">
            <ButtonComponent @click="showSequence(sequence.code)">
              Anzeigen
            </ButtonComponent>
            <div class="flex-grow text-red-500">
              <div v-if="showError">Löschen fehlgeschlagen</div>
            </div>
            <ButtonComponent @click="deleteSequence(sequence.code)">
              Löschen
            </ButtonComponent>
          </div>
        </div>
      </ContainerComponent>
    </div>
  </ContainerComponent>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { ISequence } from '../../../model/sequence/ISequence';
import ContainerComponent from './ContainerComponent.vue';
import ButtonComponent from './ButtonComponent.vue';
import { SequenceRestInterface } from '../restInterfaces/SequenceRestInterface';
import { router } from '../router';

defineProps({
  sequences: {
    type: Array<ISequence>,
    required: true,
  },
});

const emit = defineEmits(['sequenceDelete']);

const showError = ref(false);
/**
 * Shows the selected Sequence
 * @param code the code of the sequence
 */
function showSequence(code: string): void {
  router.push('/'.concat(code));
}

/**
 * Deletes the sequence
 * @param code the code of the sequence
 */
async function deleteSequence(code: string): Promise<void> {
  try {
    await SequenceRestInterface.deleteSequence(code);
    emit('sequenceDelete');
  } catch {
    showError.value = true;
  }
}
</script>
