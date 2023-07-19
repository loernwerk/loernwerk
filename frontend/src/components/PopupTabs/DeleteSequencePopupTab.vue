<template>
  <div class="flex items-center mt-4 space-x-2">
    <h1>Sequenz "{{ sequence.name }}" löschen?</h1>
    <div class="grow">
      <div class="text-error" v-if="error">
        Es ist ein Fehler beim Löschen der Sequenz aufgetreten.
      </div>
    </div>
    <ButtonComponent class="w-fit float-right" @click="deleteSequence()"
      >Unwiderruflich löschen
    </ButtonComponent>
  </div>
</template>

<script setup lang="ts">
import ButtonComponent from '../ButtonComponent.vue';
import { SequenceRestInterface } from '../../restInterfaces/SequenceRestInterface';
import { ISequence } from '../../../../model/sequence/ISequence';
import { PropType, ref } from 'vue';

const error = ref(false);
const props = defineProps({
  /**
   * Sequence to delete
   */
  sequence: {
    type: Object as PropType<ISequence>,
    required: true,
  },
});

const emits = defineEmits([
  /**
   * Emitted when sequence is deleted
   */
  'deleted',
]);

/**
 * This Method deletes the desired Sequence
 */
async function deleteSequence(): Promise<void> {
  error.value = false;
  const sequenceCode = props.sequence.code as string;
  try {
    await SequenceRestInterface.deleteSequence(sequenceCode);
    emits('deleted');
  } catch {
    error.value = true;
  }
}
</script>
