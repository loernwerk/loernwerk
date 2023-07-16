<template>
  <ContainerComponent>
    <h1>Sequenz löschen?</h1>
    <div class="columns-2">
      <ButtonComponent @click="deleteSequence">Ja</ButtonComponent>
      <ButtonComponent @click="closePopup">Nein</ButtonComponent>
      <!--@click=""-->
      <!-- Somehow close the PopUp-->
    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import ContainerComponent from '../ContainerComponent.vue';
import ButtonComponent from '../ButtonComponent.vue';
import { SequenceRestInterface } from '../../restInterfaces/SequenceRestInterface';
import useEventsBus from '../../eventBus';
import { toRaw, watch } from 'vue';
import { LoernwerkError } from '../../../../backend/loernwerkError';

const { emit } = useEventsBus();
const { bus } = useEventsBus();

let sequenceToBeModified;

function closePopup() {
  emit('close');
}

/**
 * This Method deletes the desired Sequence
 */
async function deleteSequence() {
  if (sequenceToBeModified.code !== undefined) {
    try {
      //await SequenceRestInterface.deleteSequence(sequenceToBeModified.code);
      emit('close');
    } catch (e) {
      if (e instanceof LoernwerkError) {
        alert('Something went wrong');
      }
    }
  }
}
watch(
  () => bus.value.get('sequence'),
  (sequence) => {
    sequenceToBeModified = toRaw(sequence)[0];
  }
);
</script>
<style scoped></style>
