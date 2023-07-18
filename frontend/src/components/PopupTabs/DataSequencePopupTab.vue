<template>
  <h3 class="mt-4">Code der ausgewählten Sequenz:</h3>
  <TextInputComponent :disabled="true" v-model="code" />
  <h3>Link zur momentan ausgewählten Sequenz:</h3>
  <TextInputComponent :disabled="true" v-model="link" />
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
