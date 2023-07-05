<!-- View for entering code -->
<template>
  <div class="flex flex-col">
    <img src="../assets/Logo.png" class="w-1/3 mx-auto" />
    <ContainerComponent class="mx-auto space-y-2 px-10 py-3">
      <template #Header>
        <h1 class="text-3xl text-center">Code eingeben:</h1>
      </template>
      <template #default>
        <div class="relative">
          <div class="absolute w-full h-full text-center" v-if="displaySpinner">
            <div
              class="absolute h-full w-full bg-gray-300 opacity-70 rounded-md"
            ></div>
            <FontAwesomeIcon
              icon="spinner"
              size="3x"
              class="animate-spin mt-5"
            />
          </div>
          <CodeInput
            :showRedBorder="showRedBorder"
            @code-entered="(code) => checkCode(code)"
            @code-emptied="() => (showRedBorder = false)"
          />
        </div>
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
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ref } from 'vue';

library.add(faSpinner);

const displaySpinner = ref(false);
const showRedBorder = ref(false);

/**
 * Verify inputted sequence code. If input is valid, redirect. Otherwise change border color of CodeInput.
 * @param code sequence code to check
 */
async function checkCode(code: string): Promise<void> {
  showRedBorder.value = false;
  displaySpinner.value = true;
  try {
    await SequenceRestInterface.getMetadataForStudent(code);
    alert('Right Code');
    //router.push('SlideView');
  } catch {
    showRedBorder.value = true;
  }
  displaySpinner.value = false;
}
</script>
