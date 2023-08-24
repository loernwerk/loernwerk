<template>
  <div class="mt-4 space-y-2 flex flex-col">
    <h1>{{ $t('sequence.tagIntro') }}</h1>
    <form @submit.prevent="confirmChanges()">
      <TextInputComponent
        class="my-2 grow"
        :placeHolder="$t('sequence.tags')"
        v-model="tagsField"
      >
      </TextInputComponent>
    </form>
    <div class="flex flex-row">
      <div class="flex-grow text-error">
        <div v-if="error">
          {{ $t('sequence.tagAddError') }}
        </div>
      </div>
      <ButtonComponent
        class="w-fit float-right"
        @click="confirmChanges()"
        :loading="loading"
        >{{ $t('save') }}</ButtonComponent
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

const loading = ref(false);

/**
 * Save inputted tags
 */
async function confirmChanges(): Promise<void> {
  error.value = false;
  loading.value = true;
  const tags = tagsField.value
    .split(',')
    .filter((tag) => tag !== '')
    .map((tag) => tag.trim());
  try {
    await SequenceRestInterface.updateSequence({
      code: props.sequence.code,
      tags: tags,
    });
    emits('confirmed');
  } catch {
    error.value = true;
  }

  loading.value = false;
}
</script>
