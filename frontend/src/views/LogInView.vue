<template>
  <div>
    <img src="../assets/Logo.png" class="w-1/3 mx-auto" />
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
          <div class="w-fit text-red-500 italic" v-if="displayError">
            Falscher Nutzername/Email oder Passwort.
          </div>
          <div class="flex-grow">
            <!-- Empty div as space filler -->
          </div>
          <ButtonComponent
            class="w-fit"
            :loading="displaySpinner"
            @click="checkLogIn()"
          >
            Anmelden
          </ButtonComponent>
        </div>
      </template>
    </ContainerComponent>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ButtonComponent from '../components/ButtonComponent.vue';
import ContainerComponent from '../components/ContainerComponent.vue';
import TextInputComponent from '../components/TextInputComponent.vue';
import { AccountRestInterface } from '../restInterfaces/AccountRestInterface';

const mailField = ref('');
const passwordField = ref('');
const keepLoggedIn = ref(false);
const displaySpinner = ref(false);
const displayError = ref(false);

/**
 * Checks whether the login data is correct
 */
async function checkLogIn(): Promise<void> {
  //avoid multiple clicks on button
  if (displaySpinner.value) {
    return;
  }

  displaySpinner.value = true;
  displayError.value = false;

  const success = await AccountRestInterface.verifyLogin(
    mailField.value,
    passwordField.value,
    keepLoggedIn.value
  );
  if (success) {
    alert('SequenceOverView');
  } else {
    displayError.value = true;
  }
  displaySpinner.value = false;
}
</script>
