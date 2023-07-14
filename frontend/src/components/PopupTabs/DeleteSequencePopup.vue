<template>
  <ContainerComponent>
    <h1>Sequenz löschen?</h1>
    <div class="columns-2">
      <ButtonComponent @click="deleteSequence">Ja</ButtonComponent>
      <ButtonComponent>Nein</ButtonComponent>
      <!--@click=""-->
      <!-- Somehow close the PopUp-->
    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import ContainerComponent from '../ContainerComponent.vue';
import ButtonComponent from '../ButtonComponent.vue';
import { SequenceRestInterface } from '../../restInterfaces/SequenceRestInterface';
import { ISequence } from '../../../../model/sequence/ISequence';
import useEventsBus from "../../eventBus";

const props = defineProps({
  sequenceId: Object as () => ISequence,
});

const { emit }=useEventsBus();

/**
 * This Method deletes the desired Sequence
 */
function deleteSequence(): void {
  if (props.sequenceId?.code !== undefined) {
    emit(
      'delete',
      SequenceRestInterface.deleteSequence(props.sequenceId.code)
    );
  }
}
</script>
<style scoped></style>
