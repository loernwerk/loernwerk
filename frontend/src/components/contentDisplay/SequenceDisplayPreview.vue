<template>
  <ContainerComponent>
    <h3>{{ name }}</h3>
    <div class="columns-2">
      <ButtonComponent @click="router.push('LogIn')"
        >Bearbeiten</ButtonComponent
      >
      <!--TODO redirect to Sequence-mod-menu-->
      <ButtonComponent>Menü</ButtonComponent>
      <!--TODO Popup-->
    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import ButtonComponent from '../ButtonComponent.vue';
import { ISequence } from '../../../../model/sequence/ISequence';
import ContainerComponent from '../ContainerComponent.vue';
import { router } from '../../router';

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
</script>

<style></style>
