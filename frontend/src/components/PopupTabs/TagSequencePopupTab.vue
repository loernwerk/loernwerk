<template>
  <ContainerComponent>
    <TextInputComponent />
    <div class="columns-2">
      <ButtonComponent>OK</ButtonComponent>
      <ButtonComponent @click="closePopup">Abbruch</ButtonComponent>
    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import TextInputComponent from '../TextInputComponent.vue';
import ButtonComponent from '../ButtonComponent.vue';
import ContainerComponent from '../ContainerComponent.vue';
import useEventsBus from '../../eventBus';

//to be implemented
const { emit } = useEventsBus();

function closePopup() {
  emit('canBeClosed');
}
</script>

<style scoped></style>
