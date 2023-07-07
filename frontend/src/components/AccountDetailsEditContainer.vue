<template>
  <div>
    <ContainerComponent>
      <template #Header>
        <h1 class="underline text-xl">Daten ändern:</h1>
      </template>
      <template #default>
        <div class="text-gray-400 p-1 text-xs">
          Hinweis: Sie müssen nicht alle Felder ausfüllen
        </div>
        <table>
          <tr>
            <td class="p-1">Nutzername:</td>
            <td class="p-1">
              <TextInputComponent
                :disabled="disableInputShowSpinner"
                place-holder="Nutzername"
                :start-text="originalUser.name"
                @input-changed="(val) => (nameField = val)"
              />
            </td>
          </tr>
          <tr>
            <td class="p-1">E-mail:</td>
            <td class="p-1">
              <TextInputComponent
                :disabled="disableInputShowSpinner"
                place-holder="E-mail"
                :start-text="originalUser.mail"
                @input-changed="(val) => (mailField = val)"
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
                @input-changed="(val) => (pwField = val)"
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
                @input-changed="(val) => (pwFieldControl = val)"
              />
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              <div>
                <input
                  :disabled="disableInputShowSpinner"
                  type="checkbox"
                  class="cursor-pointer"
                  v-model="isAdmin"
                />
                <label class="cursor-pointer" @click="toggleCheckBox">
                  Adminaccount
                </label>
              </div>
            </td>
          </tr>
        </table>
        <div class="flex items-center pt-4">
          <ButtonComponent
            class="w-fit p-1"
            :loading="disableInputShowSpinner"
            @click="updateInformation()"
          >
            Abbrechen
          </ButtonComponent>
          <div class="flex-grow text-center">
            <div class="text-red-500 italic" v-if="displayError">
              Ungültige Eingabe
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
        <div class="flex items-center pt-4">
          <ButtonComponent
            class="w-fit p-1"
            :loading="disableInputShowSpinner"
            @click="updateInformation()"
          >
            Löschen
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
import { IUser, UserClass } from '../../../model/user/IUser';
import { AccountRestInterface } from '../restInterfaces/AccountRestInterface';

defineProps({
  /**
   * Whether the delete button is displayed
   */
  showdelete: {
    type: Boolean,
    required: false,
    default: false,
  },
  /**
   * Whether the delete button is displayed
   */
  showadmin: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const nameField = ref('');
const mailField = ref('');
const pwField = ref('');
const pwFieldControl = ref('');
const disableInputShowSpinner = ref(false);
const displayError = ref(false);
const originalUser = await AccountRestInterface.getOwnAccount();
const isAdmin = ref(originalUser.type === UserClass.ADMIN);

/**
 * toggles the checkbox
 */
function toggleCheckBox(): void {
  if (!disableInputShowSpinner.value) {
    isAdmin.value = !isAdmin.value;
  }
}

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
