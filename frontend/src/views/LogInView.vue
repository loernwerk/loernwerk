<!-- View for users to log in -->
<template>
  <div>
    <img src="../assets/Logo.png" class="w-1/3 mx-auto" />
    <ContainerComponent
      class="w-1/2 mx-auto my-auto h-fit"
      v-if="!registrationFormVisible"
    >
      <template #Header>
        <h1 class="underline text-xl">Anmelden:</h1>
      </template>
      <template #default>
        <table class="w-full">
          <tr>
            <td class="p-1">Nutzername/Email:</td>
            <td class="w-full p-1">
              <TextInputComponent
                :disabled="disableInputShowSpinner"
                placeHolder="Nutzername/Email"
                v-model="mailField"
              />
            </td>
          </tr>
          <tr>
            <td class="p-1">Passwort:</td>
            <td class="w-full p-1">
              <TextInputComponent
                :disabled="disableInputShowSpinner"
                :hidden="true"
                placeHolder="Passwort"
                v-model="passwordField"
              />
            </td>
          </tr>
        </table>
        <div class="flex items-center pt-4">
          <div class="space-x-2">
            <input
              :disabled="disableInputShowSpinner"
              type="checkbox"
              class="cursor-pointer"
              v-model="keepLoggedIn"
            />
            <label class="cursor-pointer" @click="disableCheckBox"
              >Angemeldet bleiben</label
            >
          </div>
          <div class="flex-grow text-center">
            <div class="text-error" v-if="displayError">
              Falscher Nutzername/Email oder Passwort.
            </div>
          </div>
          <ButtonComponent
            class="w-fit"
            :loading="disableInputShowSpinner"
            @click="checkLogIn()"
          >
            Anmelden
          </ButtonComponent>
        </div>
      </template>
    </ContainerComponent>
    <div
      class="w-full mt-auto mb-auto ml-3 mr-3"
      v-if="registrationFormVisible"
    >
      <AccountCreationContainer :requires-invite-code="configtype == RegistrationType.INVITE" />
    </div>
    <ButtonComponent
      v-if="registrationButtonVisible"
      class="absolute right-5 bottom-5 h-fit"
      @click="registrationFormVisible = !registrationFormVisible"
    >
      {{ registrationFormVisible ? 'Login' : 'Registrieren' }}
    </ButtonComponent>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ButtonComponent from '../components/ButtonComponent.vue';
import ContainerComponent from '../components/ContainerComponent.vue';
import TextInputComponent from '../components/TextInputComponent.vue';
import AccountCreationContainer from '../components/admin/AccountCreationContainer.vue';
import { AccountRestInterface } from '../restInterfaces/AccountRestInterface';
import { router } from '../router';
import { ConfigRestInterface } from '../restInterfaces/ConfigRestInterface';
import { ConfigKey } from '../../../model/configuration/ConfigKey';
import { RegistrationType } from '../../../model/configuration/RegistrationType';

const mailField = ref('');
const passwordField = ref('');
const keepLoggedIn = ref(false);
const disableInputShowSpinner = ref(false);
const displayError = ref(false);
const registrationButtonVisible = ref(false);
const registrationFormVisible = ref(false);

const configtype = ref(await ConfigRestInterface.getValue(
  ConfigKey.REGISTRATION_TYPE
));

registrationButtonVisible.value = configtype.value == RegistrationType.OPEN || configtype.value == RegistrationType.INVITE

/**
 * Locks the Checkbox while checking Login data
 */
function disableCheckBox(): void {
  if (!disableInputShowSpinner.value) {
    keepLoggedIn.value = !keepLoggedIn.value;
  }
}

/**
 * Checks whether the login data is correct
 */
async function checkLogIn(): Promise<void> {
  disableInputShowSpinner.value = true;
  displayError.value = false;
  const success = await AccountRestInterface.verifyLogin(
    mailField.value,
    passwordField.value,
    keepLoggedIn.value
  );

  if (success) {
    await router.push({ name: 'Overview' });
  } else {
    displayError.value = true;
  }
  disableInputShowSpinner.value = false;
}
</script>
