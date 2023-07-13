<template>
  <ContainerComponent>
    <h3>{{ name }}</h3>
    <div class="columns-2">
      <ButtonComponent @click="router.push('LogIn')"
        >Bearbeiten</ButtonComponent
      >
      <!--TODO redirect to Sequence-mod-menu-->
      <ButtonComponent @click="openPopUp">Menü</ButtonComponent>
<!--      <ButtonComponent @click="$emit('popupOpened', openPopUp)">Menü</ButtonComponent>-->
    </div>
    <div class="Popup">
    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import ButtonComponent from '../ButtonComponent.vue';
import { ISequence } from '../../../../model/sequence/ISequence';
import ContainerComponent from '../ContainerComponent.vue';
import { router } from '../../router';
import PopupComponent from '../PopupComponent.vue';
import {ref} from "vue";
import useEventsBus from './../../eventBus';
import TabbedContainer from "../TabbedContainer.vue";

defineProps({
  sequences: {
    type: Object as () => ISequence,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
});
// const isOpen = ref(false);
const { emit }=useEventsBus()
function openPopUp() {
    emit("open-popup");
}
</script>

<style></style>
