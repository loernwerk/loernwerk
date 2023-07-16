<template>
  <ContainerComponent>
    <h3>{{ sequence.name }}</h3>
    <div class="columns-2">
      <ButtonComponent @click="router.push('LogIn')"
        >Bearbeiten
      </ButtonComponent>
      <ButtonComponent @click="openPopUp">Menü</ButtonComponent>
    </div>
    <div class="Popup"></div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import { store } from '../../store/store'
import ButtonComponent from '../ButtonComponent.vue';
import { ISequence } from '../../../../model/sequence/ISequence';
import ContainerComponent from '../ContainerComponent.vue';
import { router } from '../../router';
import PopupComponent from '../PopupComponent.vue';
import { ref } from 'vue';
import useEventsBus from './../../eventBus';
import TabbedContainer from '../TabbedContainer.vue';

const props = defineProps({
  sequence: Object as () => ISequence,
});
const { emit } = useEventsBus();
function openPopUp() {
  store.selectedSequence = props.sequence;
  emit('open-menu');
}
// function emitSequence() {
//   emit('sequence', props.sequence);
// }

// window.setInterval(() => {
//   emitSequence();
// }, 10);
</script>

<style></style>
