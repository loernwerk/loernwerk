<template>
  <div class="mt-4 space-y-2">
    <div class="text-error" v-if="sequence.slideCount === 0">
      {{ $t('sequence.shareEmptyWarning') }}
    </div>
    <div class="flex space-x-2 items-center">
      <h3>{{ $t('sequence.codeOf') }}:</h3>
      <TextInputComponent :disabled="true" v-model="code" class="grow" />
    </div>
    <div class="flex space-x-2 items-center">
      <h3>{{ $t('sequence.linkOf') }}:</h3>
      <TextInputComponent :disabled="true" v-model="link" class="grow" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ISequence } from '../../../../model/sequence/ISequence';
import { PropType, computed } from 'vue';
import TextInputComponent from '../TextInputComponent.vue';

const props = defineProps({
  /**
   * Sequence to get code and link from
   */
  sequence: {
    type: Object as PropType<ISequence>,
    required: true,
  },
});

const link = computed(() => {
  if (props.sequence.slideCount === 0) return '';
  return window.location.origin + '/' + props.sequence.code;
});

const code = computed(() => {
  if (props.sequence.slideCount === 0) return '';
  return props.sequence.code;
});
</script>
