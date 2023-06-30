<!-- View for entering code -->
<template>
  <div class="flex flex-col">
    <img src="../assets/Logo.png" class="w-1/3 mx-auto my-5" />
    <div class="mx-auto space-y-2">
      <h1 class="text-3xl text-center">Code eingeben:</h1>
      <CodeInput @code-entered="(code) => console.log(code)" />
    </div>
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
import CodeInput from '../components/CodeInput.vue';
import { router } from '../router';
</script>
