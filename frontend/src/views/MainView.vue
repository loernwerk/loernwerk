<!-- View for entering code -->
<template>
  <div class="flex flex-col">
    <img src="../assets/Logo.png" class="w-1/3 mx-auto" />
    <ContainerComponent class="mx-auto space-y-2 px-10 py-3">
      <template #Header>
        <h1 class="text-3xl text-center">Code eingeben:</h1>
      </template>
      <template #default>
        <CodeInput @code-entered="(code) => console.log(code)" />
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
</script>
