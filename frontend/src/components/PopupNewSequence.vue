<template>
  <PopupComponent @closed="$emit('closed')">
    <ContainerComponent class="px-8 py-6">
      <template #Header>
        <h1 class="text-xl">Sequenz erstellen:</h1>
      </template>

      <TextInputComponent
        class="w-full my-4"
        :disabled="disableInputShowSpinner"
        placeHolder="Name der Sequenz"
        v-model="nameField"
      />

      <ButtonComponent
        class="w-fit mb-4 float-right"
        :loading="disableInputShowSpinner"
        @click="newSequence()"
      >
        Bestätigen
      </ButtonComponent>
    </ContainerComponent>
  </PopupComponent>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SequenceRestInterface } from '../restInterfaces/SequenceRestInterface';
import PopupComponent from './PopupComponent.vue';
import TextInputComponent from '../components/TextInputComponent.vue';
import ButtonComponent from './ButtonComponent.vue';
import ContainerComponent from './ContainerComponent.vue';

defineEmits([
  /**
   * Emitted when the popup is closed
   */
  'closed',
]);

const disableInputShowSpinner = ref(false);
const nameField = ref('');

/**
 * Create a new sequence with given name
 */
async function newSequence(): Promise<void> {
  disableInputShowSpinner.value = true;
  try {
    const code = await SequenceRestInterface.addSequence(nameField.value);
    void code;
    //TODO: Redirect SequenceEditView
  } catch {
    //TODO: Error handling
  }
  disableInputShowSpinner.value = false;
}
</script>
