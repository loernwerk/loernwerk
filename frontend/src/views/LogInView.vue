<!-- View for users to log in -->
<template>
  <div>
    <img src="../assets/Logo.png" class="w-1/3 mx-auto" />
    <ContainerComponent class="w-1/2 mx-auto my-auto h-fit">
      <template #Header>
        <h1 class="underline text-xl">{{ $t('account.login') }}:</h1>
      </template>
      <template #default>
        <table class="w-full">
          <tr>
            <td class="p-1 whitespace-nowrap">
              {{ $t('account.name') }}/{{ $t('account.mail') }}:
            </td>
            <td class="w-full p-1">
              <TextInputComponent
                :disabled="disableInputShowSpinner"
                :placeHolder="`${$t('account.name')}/${$t('account.mail')}`"
                v-model="mailField"
              />
            </td>
          </tr>
          <tr>
            <td class="p-1">{{ $t('account.password') }}:</td>
            <td class="w-full p-1">
              <TextInputComponent
                :disabled="disableInputShowSpinner"
                :hidden="true"
                :placeHolder="$t('account.password')"
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
            <label class="cursor-pointer" @click="disableCheckBox">{{
              $t('account.keepLoggedIn')
            }}</label>
          </div>
          <div class="flex-grow text-center">
            <div class="text-red-500 italic" v-if="displayError">
              {{ $t('account.wrongInputData') }}
            </div>
          </div>
          <ButtonComponent
            class="w-fit"
            :loading="disableInputShowSpinner"
            @click="checkLogIn()"
          >
            {{ $t('account.login') }}
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
const disableInputShowSpinner = ref(false);
const displayError = ref(false);

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
    alert('SequenceOverView');
  } else {
    displayError.value = true;
  }
  disableInputShowSpinner.value = false;
}
</script>
