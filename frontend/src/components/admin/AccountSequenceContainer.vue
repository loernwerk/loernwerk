<template>
  <ContainerComponent>
    <template #Header>
      <h1 class="underline text-xl mb-2">Sequenzen des Nutzers:</h1>
    </template>
    <div v-for="sequence in sequences" :key="sequence.code" class="mb-2">
      <ContainerComponent>
        <div class="flex flex-col space-y-2">
          <h3 class="text-3xl text-center">{{ sequence.name }}</h3>
          <div class="flex">
            <ButtonComponent @click="showSequence(sequence.code)">
              Anzeigen
            </ButtonComponent>
            <div class="flex-grow text-error">
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
import { ISequence } from '../../../../model/sequence/ISequence';
import ContainerComponent from '../ContainerComponent.vue';
import ButtonComponent from '../ButtonComponent.vue';
import { SequenceRestInterface } from '../../restInterfaces/SequenceRestInterface';
import { useRouter } from 'vue-router';

defineProps({
  sequences: {
    type: Array<ISequence>,
    required: true,
  },
});

const router = useRouter();
const emit = defineEmits(['delete']);

const showError = ref(false);
/**
 * Shows the selected Sequence
 * @param code the code of the sequence
 */
function showSequence(code: string): void {
  router.push({ name: 'Slide', params: { sequenceCode: code } });
}

/**
 * Deletes the sequence
 * @param code the code of the sequence
 */
async function deleteSequence(code: string): Promise<void> {
  try {
    await SequenceRestInterface.deleteSequence(code);
    emit('delete');
  } catch {
    showError.value = true;
  }
}
</script>
