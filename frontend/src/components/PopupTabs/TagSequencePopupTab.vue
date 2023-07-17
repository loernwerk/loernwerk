<template>
  <ContainerComponent>
    <TextInputComponent class="my-2"> </TextInputComponent>
    <div class="flex flex-row">
      <ButtonComponent class="basis-1/2 mr-2">OK</ButtonComponent>
      <ButtonComponent class="basis-1/2" @click="closePopup()"
        >Abbruch
      </ButtonComponent>
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

/**
 * Closes this popup
 */
function closePopup(): void {
  emit('canBeClosed');
}
</script>
