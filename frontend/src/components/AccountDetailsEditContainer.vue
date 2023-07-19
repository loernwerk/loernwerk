<template>
  <div>
    <ContainerComponent>
      <template #Header>
        <h1 class="underline text-xl">Daten ändern:</h1>
      </template>

      <template #default>
        <table class="w-full">
          <tr>
            <td class="p-1">Nutzername:</td>
            <td class="p-1 w-2/3">
              <TextInputComponent
                :disabled="disableInputShowSpinner || deleted"
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
                :disabled="disableInputShowSpinner || deleted"
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
                :disabled="disableInputShowSpinner || deleted"
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
                :disabled="disableInputShowSpinner || deleted"
                :hidden="true"
                place-holder="Passwort wiederholen"
                :max-length="128"
                v-model="pwFieldControl"
              />
            </td>
          </tr>
          <tr v-if="showadminview">
            <td></td>
            <td>
              <div>
                <input
                  :disabled="disableInputShowSpinner || deleted"
                  type="checkbox"
                  class="cursor-pointer m-1"
                  v-model="isAdmin"
                  :checked="isAdmin"
                />
                <label class="cursor-pointer" @click="toggleAdminCheckBox">
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
            @click="reset()"
          >
            Abbrechen
          </ButtonComponent>
          <div class="flex-grow text-center">
            <div class="text-error" v-if="displayError">Ungültige Eingabe</div>
            <div class="text-success" v-if="displaySuccess">
              Account gespeichert
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
        <div class="flex items-center pt-1" v-if="showadminview">
          <div class="flex-grow text-center">
            <div class="text-success" v-if="deleted">Account gelöscht</div>
          </div>
          <ButtonComponent
            class="w-fit p-1"
            :loading="disableInputShowSpinner"
            @click="deleteAccount()"
          >
            Löschen
          </ButtonComponent>
        </div>
      </template>
    </ContainerComponent>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import TextInputComponent from './TextInputComponent.vue';
import ButtonComponent from './ButtonComponent.vue';
import ContainerComponent from './ContainerComponent.vue';
import { IUser, UserClass } from '../../../model/user/IUser';
import { AccountRestInterface } from '../restInterfaces/AccountRestInterface';

const props = defineProps({
  /**
   * Whether the delete button is displayed
   */
  showadminview: {
    type: Boolean,
    required: false,
    default: false,
  },
  /**
   * The user to display
   */
  user: {
    type: Object as () => Partial<IUser>,
    required: true,
  },
});
const emit = defineEmits(['delete']);

const nameField = ref(props.user.name);
const mailField = ref(props.user.mail);
const pwField = ref('');
const pwFieldControl = ref('');
const disableInputShowSpinner = ref(false);
const deleted = ref(false);
const displayError = ref(false);
const displaySuccess = ref(false);
const isAdmin = ref(props.user.type === UserClass.ADMIN);
const regexMail =
  '[a-zA-Z0-9]+(?:\\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\\.[a-zA-Z0-9]+)+$';
/**
 * toggles the checkbox
 */
function toggleAdminCheckBox(): void {
  if (!disableInputShowSpinner.value) {
    isAdmin.value = !isAdmin.value;
  }
}

/**
 * Updates Information from the User with the entered information
 */
async function updateInformation(): Promise<void> {
  if (deleted.value) {
    return;
  }
  displaySuccess.value = false;
  displayError.value = false;
  disableInputShowSpinner.value = true;

  const updateUser: Partial<IUser> = { id: props.user.id };

  updateUser.name = nameField.value;
  if (mailField.value?.match(regexMail)) {
    updateUser.mail = mailField.value;
  } else {
    displayError.value = true;
    disableInputShowSpinner.value = false;
    return;
  }

  if (pwField.value !== '') {
    if (pwField.value === pwFieldControl.value) {
      updateUser.password = pwField.value;
    } else {
      displayError.value = true;
      disableInputShowSpinner.value = false;
      return;
    }
  }
  if (props.showadminview) {
    updateUser.type = isAdmin.value ? UserClass.ADMIN : UserClass.REGULAR;
  }
  try {
    await AccountRestInterface.updateAccount(updateUser);
    displaySuccess.value = true;
  } catch (e) {
    displayError.value = true;
  }
  disableInputShowSpinner.value = false;
}
/**
 * deletes a account
 */
async function deleteAccount(): Promise<void> {
  disableInputShowSpinner.value = true;
  if (props.user.id === null) {
    console.log('user id is empty - should not happen');
    return;
  }
  await AccountRestInterface.deleteAccount(props.user.id as number);
  disableInputShowSpinner.value = false;
  deleted.value = true;
  emit('delete');
}
/**
 * reseting this component
 */
async function reset(): Promise<void> {
  if (deleted.value) {
    return;
  }
  nameField.value = props.user.name;
  mailField.value = props.user.mail;
  isAdmin.value = props.user.type === UserClass.ADMIN;
  pwField.value = '';
  pwFieldControl.value = '';
}

watch(
  () => props.user.id,
  () => {
    reset();
    deleted.value = false;
  }
);
</script>
