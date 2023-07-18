<template>
  <div class="mt-4 space-y-2 flex flex-col">
    <h1>Schlüsselwörter der Sequenz (mit "," getrennt):</h1>
    <TextInputComponent
      class="my-2 grow"
      placeHolder="Schlüsselwörter"
      v-model="tagsField"
    >
    </TextInputComponent>
    <div class="flex flex-row">
      <div class="flex-grow text-red-500">
        <div v-if="error">
          Es ist ein Fehler beim Speichern der Schlüsselwörter aufgetreten.
        </div>
      </div>
      <ButtonComponent class="w-fit float-right" @click="confimChanges"
        >Bestätigen</ButtonComponent
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import TextInputComponent from '../TextInputComponent.vue';
import ButtonComponent from '../ButtonComponent.vue';
import { PropType, ref } from 'vue';
import { ISequence } from '../../../../model/sequence/ISequence';
import { SequenceRestInterface } from '../../restInterfaces/SequenceRestInterface';

const props = defineProps({
  /**
   * Sequence to edit tags
   */
  sequence: {
    type: Object as PropType<ISequence>,
    required: true,
  },
});

const tagsField = ref(props.sequence.tags.join(', '));
const error = ref(false);

const emits = defineEmits([
  /**
   * Emitted when user confirms input
   */
  'confirmed',
]);

/**
 * Save inputted tags
 */
async function confimChanges(): Promise<void> {
  error.value = false;
  const tags = tagsField.value
    .split(',')
    .filter((tag) => tag !== '')
    .map((tag) => tag.trim());
  try {
    await SequenceRestInterface.updateSequence({
      code: props.sequence.code,
      tags: tags,
    });
  } catch {
    error.value = true;
  }

  emits('confirmed');
}
</script>
