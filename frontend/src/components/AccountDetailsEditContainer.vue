<template>
  <div>
    <ContainerComponent>
      <template #Header>
        <h1 class="underline text-xl">Daten ändern:</h1>
      </template>
      <template #default>
        <table>
          <tr>
            <td>Nutzername:</td>
            <td>
              <TextInputComponent
                :disabled="disableInputShowSpinner"
                place-holder="Nutzername"
                @input-changed="(val) => (nameField = val)"
              />
            </td>
          </tr>
          <tr>
            <td>E-mail:</td>
            <td>
              <TextInputComponent
                :disabled="disableInputShowSpinner"
                place-holder="E-mail"
                @input-changed="(val) => (mailField = val)"
              />
            </td>
          </tr>
          <tr>
            <td>Passwort:</td>
            <td>
              <TextInputComponent
                :disabled="disableInputShowSpinner"
                :hidden="true"
                place-holder="Passwort"
                @input-changed="(val) => (pwField = val)"
              />
            </td>
          </tr>
          <tr>
            <td>Passwort wiederholen:</td>
            <td>
              <TextInputComponent
                :disabled="disableInputShowSpinner"
                :hidden="true"
                place-holder="Passwort wiederholen"
                @input-changed="(val) => (pwFieldControl = val)"
              />
            </td>
          </tr>
        </table>
        <div class="flex items-center pt-4">
          <div class="flex-grow text-center">
            <div class="text-red-500 italic" v-if="displayError">
              Ungültige Eingabe
            </div>
          </div>
          <ButtonComponent
            class="w-fit"
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
import { IUser } from '../../../model/user/IUser';
import { AccountRestInterface } from '../restInterfaces/AccountRestInterface';

const nameField = ref('');
const mailField = ref('');
const pwField = ref('');
const pwFieldControl = ref('');
const disableInputShowSpinner = ref(false);
const displayError = ref(false);

/**
 * Updates Information from the User with the entered information
 */
async function updateInformation(): Promise<void> {
  displayError.value = false;
  if (
    nameField.value === '' &&
    mailField.value === '' &&
    pwField.value === ''
  ) {
    return;
  }
  disableInputShowSpinner.value = true;

  const updateUser: Partial<IUser> = {};
  if (nameField.value !== '') {
    updateUser.name = nameField.value;
  }
  if (mailField.value !== '') {
    updateUser.mail = mailField.value;
  }
  if (pwField.value !== '') {
    if (pwField.value === pwFieldControl.value) {
      updateUser.password = pwField.value;
    } else {
      displayError.value = true;
    }
  }
  AccountRestInterface.updateAccount(updateUser);
  disableInputShowSpinner.value = false;
}
</script>
