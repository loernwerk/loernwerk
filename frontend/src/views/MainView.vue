<!-- View for entering code for sequence execution or redirect to login view -->
<template>
  <div class="flex flex-col">
    <img src="../assets/Logo.png" class="w-1/3 mx-auto" />
    <ContainerComponent class="mx-auto space-y-2 px-10 py-3">
      <template #Header>
        <h1 class="text-3xl text-center">Code eingeben:</h1>
      </template>
      <template #default>
        <CodeInput
          :showRedBorder="showRedBorder"
          :disableInputShowSpinner="disableInputShowSpinner"
          @code-entered="(code) => checkCode(code)"
          @code-emptied="() => (showRedBorder = false)"
        />
      </template>
    </ContainerComponent>
    <ButtonComponent
      class="absolute right-5 bottom-5 h-fit"
      @click="router.push('LogIn')"
    >
      Anmelden
    </ButtonComponent>
  </div>
</template>

<script setup lang="ts">
import ButtonComponent from '../components/ButtonComponent.vue';
import ContainerComponent from '../components/ContainerComponent.vue';
import CodeInput from '../components/CodeInput.vue';
import { router } from '../router';
import { SequenceRestInterface } from '../restInterfaces/SequenceRestInterface';
import { ref } from 'vue';

const showRedBorder = ref(false);
const disableInputShowSpinner = ref(false);

/**
 * Verify inputted sequence code. If input is valid, redirect. Otherwise change border color of CodeInput.
 * @param code sequence code to check
 */
async function checkCode(code: string): Promise<void> {
  showRedBorder.value = false;
  disableInputShowSpinner.value = true;

  try {
    await SequenceRestInterface.getMetadataForStudent(code);
    alert('Right Code');
    //router.push('SlideView');
  } catch {
    showRedBorder.value = true;
  }
  disableInputShowSpinner.value = false;
}
</script>
