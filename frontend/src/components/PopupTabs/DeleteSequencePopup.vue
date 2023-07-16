<template>
  <ContainerComponent>
    <h1>Sequenz '{{ sequence.name }}' löschen?</h1>
    <div class="columns-2">
      <ButtonComponent @click="deleteSequence">Ja</ButtonComponent>
      <ButtonComponent @click="closePopup">Abbruch</ButtonComponent>

    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import ContainerComponent from '../ContainerComponent.vue';
import ButtonComponent from '../ButtonComponent.vue';
import { SequenceRestInterface } from '../../restInterfaces/SequenceRestInterface';
import useEventsBus from '../../eventBus';
import { LoernwerkError } from '../../../../backend/loernwerkError';
import {store} from "../../store/store";
import {ISequence} from "../../../../model/sequence/ISequence";

const { emit } = useEventsBus();
const props = defineProps({
  sequence: Object as () => ISequence,
  allSequences: Object as () => ISequence[]
});

function closePopup() {
  emit('canBeClosed');
}

/**
 * This Method deletes the desired Sequence
 */
async function deleteSequence() {
  if (props.sequence?.code != undefined) {
    const sequenceCode = props.sequence.code as string;
    try {
      await SequenceRestInterface.deleteSequence(sequenceCode);
      let sequenceList = props.allSequences as ISequence[];
      let deletedSequenceInstance = sequenceList.find(s => s.code === sequenceCode) as ISequence;
      sequenceList.splice(sequenceList.indexOf(deletedSequenceInstance), 1);
      closePopup();
    } catch (e) {
      if (e instanceof LoernwerkError) {
        alert('Something went wrong');
      }
    }
  }
}

</script>
<style scoped></style>
