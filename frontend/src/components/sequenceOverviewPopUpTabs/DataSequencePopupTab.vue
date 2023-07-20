<template>
  <div class="mt-4 space-y-2">
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
  return window.location.origin + '/' + props.sequence.code;
});

const code = computed(() => {
  return props.sequence.code;
});
</script>
