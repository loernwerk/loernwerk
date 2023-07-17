<template>
  <ContainerComponent>
    <h3>Der Code der ausgewählten Sequenz ist : {{ code }}</h3>
    <h3>Der Link zur momentan ausgewählten Sequenz ist: {{ link }}</h3>
    <ButtonComponent @click="closePopup()">Schließen</ButtonComponent>
  </ContainerComponent>
</template>

<script setup lang="ts">
import useEventsBus from '../../eventBus';
import ContainerComponent from '../ContainerComponent.vue';
import ButtonComponent from '../ButtonComponent.vue';
import { ISequence } from '../../../../model/sequence/ISequence';

const { emit } = useEventsBus();

const props = defineProps({
  sequence: Object as () => ISequence,
});
let code = props.sequence?.code;
let link = `somelink/${code}`;

function closePopup() {
  emit('canBeClosed');
}
</script>
