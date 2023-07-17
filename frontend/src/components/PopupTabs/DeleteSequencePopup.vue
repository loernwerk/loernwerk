<template>
  <ContainerComponent>
    <h1>Sequenz "{{ sequence.name }}" löschen?</h1>
    <div class="flex flex-row">
      <ButtonComponent 
        class="basis-1/2 mr-2"
        @click="deleteSequence()"
      >Ja
      </ButtonComponent>
      <ButtonComponent 
        class="basis-1/2"
        @click="closePopup()"
      >Abbruch
      </ButtonComponent>
    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import ContainerComponent from '../ContainerComponent.vue';
import ButtonComponent from '../ButtonComponent.vue';
import { SequenceRestInterface } from '../../restInterfaces/SequenceRestInterface';
import useEventsBus from '../../eventBus';
import { LoernwerkError } from '../../../../backend/loernwerkError';
import { ISequence } from '../../../../model/sequence/ISequence';
import { PropType } from 'vue';

const { emit } = useEventsBus();
const props = defineProps({
  sequence: {
  type: Object as PropType<ISequence>,
  required: true
  },
  
  allSequences: {
  type: Array<ISequence>,
  required: true
}
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
      let deletedSequenceInstance = sequenceList.find(
        (s) => s.code === sequenceCode
      ) as ISequence;
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
