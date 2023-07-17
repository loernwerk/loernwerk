<template>
  <ContainerComponent>
    <h1>Sequenz "{{ sequence.name }}" löschen?</h1>
    <div class="flex flex-row">
      <ButtonComponent class="basis-1/2 mr-2" @click="deleteSequence()"
        >Ja
      </ButtonComponent>
      <ButtonComponent class="basis-1/2" @click="closePopup()"
        >Abbruch
      </ButtonComponent>
    </div>
    <div class="text-red-500" v-if="error">
      Es ist ein Fehler beim Löschen der Sequenz aufgetreten.
    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import ContainerComponent from '../ContainerComponent.vue';
import ButtonComponent from '../ButtonComponent.vue';
import { SequenceRestInterface } from '../../restInterfaces/SequenceRestInterface';
import useEventsBus from '../../eventBus';
import { ISequence } from '../../../../model/sequence/ISequence';
import { PropType, ref } from 'vue';
import { LoernwerkError } from '../../../../model/loernwerkError';

const error = ref(false);
const { emit } = useEventsBus();
const props = defineProps({
  /**
   * Sequence to delete
   */
  sequence: {
    type: Object as PropType<ISequence>,
    required: true,
  },

  /**
   * List of all existing sequences
   */
  allSequences: {
    type: Array<ISequence>,
    required: true,
  },
});

/**
 * Closes this popup
 */
function closePopup(): void {
  emit('canBeClosed');
}

/**
 * This Method deletes the desired Sequence
 */
async function deleteSequence(): Promise<void> {
  error.value = false;

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
        error.value = true;
      }
    }
  }
}
</script>
