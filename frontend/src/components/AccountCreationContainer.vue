<template>
  <div>
    <ContainerComponent>
      <template #Header>
        <h1 class="underline text-xl">Nutzer erstellen:</h1>
      </template>

      <template #default>
        <table class="w-full">
          <tr>
            <td class="p-1">Nutzername:</td>
            <td class="p-1 w-2/3">
              <TextInputComponent
                :disabled="disableInputShowSpinner"
                place-holder="Nutzername"
                :max-length="128"
                v-model="nameField"
              />
            </td>
          </tr>
          <tr>
            <td class="p-1">E-mail:</td>
            <td class="p-1">
              <TextInputComponent
                :disabled="disableInputShowSpinner"
                place-holder="E-mail"
                :max-length="320"
                v-model="mailField"
              />
            </td>
          </tr>
          <tr>
            <td class="p-1">Passwort:</td>
            <td class="p-1">
              <TextInputComponent
                :disabled="disableInputShowSpinner"
                :hidden="true"
                place-holder="Passwort"
                :max-length="128"
                v-model="pwField"
              />
            </td>
          </tr>
          <tr>
            <td class="p-1">Passwort wiederholen:</td>
            <td class="p-1">
              <TextInputComponent
                :disabled="disableInputShowSpinner"
                :hidden="true"
                place-holder="Passwort wiederholen"
                :max-length="128"
                v-model="pwFieldControl"
              />
            </td>
          </tr>
        </table>
        <div class="flex items-center pt-4">
          <div class="flex-grow text-center">
            <div class="text-red-500 italic" v-if="displayError">
              Ungültige Eingabe
            </div>
            <div class="text-green-500 italic" v-if="displaySuccess">
              Account erstellt
            </div>
          </div>
          <ButtonComponent
            class="w-fit p-1"
            :loading="disableInputShowSpinner"
            @click="updateInformation()"
          >
            Speichern
          </ButtonComponent>
        </div>
      </template>
    </ContainerComponent>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import TextInputComponent from './TextInputComponent.vue';
import ButtonComponent from './ButtonComponent.vue';
import ContainerComponent from './ContainerComponent.vue';
import { AccountRestInterface } from '../restInterfaces/AccountRestInterface';

const emit = defineEmits(['create']);

const nameField = ref('');
const mailField = ref('');
const pwField = ref('');
const pwFieldControl = ref('');
const disableInputShowSpinner = ref(false);
const displayError = ref(false);
const displaySuccess = ref(false);
const regexMail =
  '[a-zA-Z0-9]+(?:\\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\\.[a-zA-Z0-9]+)+$';

/**
 * Updates Information from the User with the entered information
 */
async function updateInformation(): Promise<void> {
  displaySuccess.value = false;
  displayError.value = false;
  disableInputShowSpinner.value = true;

  if (
    pwField.value !== pwFieldControl.value ||
    !mailField.value?.match(regexMail)
  ) {
    displayError.value = true;
    disableInputShowSpinner.value = false;
    return;
  }

  try {
    await AccountRestInterface.addAccount({
      name: nameField.value,
      mail: mailField.value,
      password: pwField.value,
    });
    displaySuccess.value = true;
    console.log('create');
    emit('create');
  } catch (e) {
    console.log('server fault');
    displayError.value = true;
  }
  disableInputShowSpinner.value = false;
}
</script>
