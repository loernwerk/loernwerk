<template>
  <div class="flex items-center mt-4 space-x-2">
    <h1>
      {{
        $t('deleteObject', {
          object: `${$t('sequence.sequence')} "${sequence.name}"`,
        })
      }}:
    </h1>
    <div class="grow">
      <div class="text-error" v-if="error">
        {{ $t('sequence.deleteError') }}
      </div>
    </div>
    <ButtonComponent
      class="w-fit float-right"
      @click="deleteSequence()"
      :loading="loading"
      >{{ $t('delete') }}
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
  'delete',
]);

const loading = ref(false);

/**
 * This Method deletes the desired Sequence
 */
async function deleteSequence(): Promise<void> {
  error.value = false;
  loading.value = true;
  const sequenceCode = props.sequence.code as string;
  try {
    await SequenceRestInterface.deleteSequence(sequenceCode);
    emits('delete');
  } catch {
    error.value = true;
  }
  loading.value = false;
}
</script>
