<template>
  <ContainerComponent class="w-1/2 mx-auto my-auto h-fit">
    <template #Header>
      <h1 class="underline text-xl">Anmelden:</h1>
    </template>
    <template #default>
      <table class="w-full">
        <tr>
          <td class="p-1">Nutzername/Email:</td>
          <td class="w-full p-1">
            <TextInputComponent
              placeHolder="Nutzername/Email"
              @input-changed="(val) => (mailField = val)"
            />
          </td>
        </tr>
        <tr>
          <td class="p-1">Passwort:</td>
          <td class="w-full p-1">
            <TextInputComponent
              :hidden="true"
              placeHolder="Passwort"
              @input-changed="(val) => (passwordField = val)"
            />
          </td>
        </tr>
      </table>
      <div class="flex items-center pt-4">
        <div class="space-x-2">
          <input
            type="checkbox"
            class="cursor-pointer"
            v-model="keepLoggedIn"
          />
          <label class="cursor-pointer" @click="keepLoggedIn = !keepLoggedIn"
            >Angemeldet bleiben</label
          >
        </div>
        <div class="flex-grow">
          <!-- Empty div as space filler -->
        </div>
        <ButtonComponent class="w-fit" @click="checkLogIn()">
          Anmelden
        </ButtonComponent>
      </div>
    </template>
  </ContainerComponent>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ButtonComponent from '../components/ButtonComponent.vue';
import ContainerComponent from '../components/ContainerComponent.vue';
import TextInputComponent from '../components/TextInputComponent.vue';

const mailField = ref('');
const passwordField = ref('');
const keepLoggedIn = ref(false);

/**
 * Checks whether the login data is correct
 */
function checkLogIn(): void {
  // TODO: Implement with Rest Interface
}
</script>
