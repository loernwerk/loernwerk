<template>
  <ContainerComponent>
    <h3>Der Code der ausgewählten Sequenz ist : {{ sequence.code }}</h3>
    <h3>Der Link zur momentan ausgewählten Sequenz ist: {{ link }}</h3>
    <ButtonComponent @click="closePopup()">Schließen</ButtonComponent>
  </ContainerComponent>
</template>

<script setup lang="ts">
import useEventsBus from '../../eventBus';
import ContainerComponent from '../ContainerComponent.vue';
import ButtonComponent from '../ButtonComponent.vue';
import { ISequence } from '../../../../model/sequence/ISequence';
import { PropType, computed } from 'vue';

const { emit } = useEventsBus();

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
  return 'somelink/' + props.sequence.code;
});

/**
 * Closes this popup
 */
function closePopup(): void {
  emit('canBeClosed');
}
</script>
