<template>
  <ContainerComponent>
    <h3>Der Code der ausgewählten Sequenz ist : {{ store.selectedSequence.code }}</h3>
    <h3>Der Link zur momentan ausgewählten Sequenz ist: {{ link }}</h3>
    <ButtonComponent @click="closePopup">Abbruch</ButtonComponent>
  </ContainerComponent>
</template>

<script setup lang="ts">
import { store } from './../../store/store'
import { toRaw, watch } from 'vue';
import useEventsBus from '../../eventBus';
import { SequenceRestInterface } from '../../restInterfaces/SequenceRestInterface';
import ContainerComponent from '../ContainerComponent.vue';
import ButtonComponent from '../ButtonComponent.vue';
const { bus } = useEventsBus();
const { emit } = useEventsBus();
let sequenceData = {
  code: undefined
};
//let link = SequenceRestInterface.getSequence(sequenceData.code);
let link = 'someUrl';

function closePopup() {
  emit('close');
}

// watch(
//   () => bus.value.get('sequence'),
//   (sequence) => {
//     console.log(`got sequence ${JSON.stringify(sequence)}`)
//     sequenceData = toRaw(sequence)[0];
//   }
// );
</script>
