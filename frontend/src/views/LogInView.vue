<!-- View for users to log in -->
<template>
  <div>
    <img src="../assets/Logo.png" class="w-1/3 mx-auto" />
    <ContainerComponent
      class="w-1/2 mx-auto my-auto h-fit"
      v-if="!registrationFormVisible"
    >
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
            <div class="text-error" v-if="displayError">
              {{ $t('account.wrongLoginData') }}
            </div>
            <div class="text-success" v-if="accountCreatedMessage">
              {{ $t('created', { object: $t('user') }) }}
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
    <div class="w-full my-auto mx-3" v-if="registrationFormVisible">
      <AccountCreationContainer
        :requires-invite-code="configtype == RegistrationType.INVITATION"
        @create="accountCreated()"
      />
    </div>
    <ButtonComponent
      v-if="registrationButtonVisible"
      class="absolute right-5 bottom-5 h-fit"
      @click="registrationFormVisible = !registrationFormVisible"
    >
      {{
        registrationFormVisible ? $t('account.login') : $t('account.register')
      }}
    </ButtonComponent>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ButtonComponent from '../components/ButtonComponent.vue';
import ContainerComponent from '../components/ContainerComponent.vue';
import TextInputComponent from '../components/TextInputComponent.vue';
import AccountCreationContainer from '../components/admin/AccountCreationContainer.vue';
import { AccountRestInterface } from '../restInterfaces/AccountRestInterface';
import { ConfigRestInterface } from '../restInterfaces/ConfigRestInterface';
import { ConfigKey } from '../../../model/configuration/ConfigKey';
import { RegistrationType } from '../../../model/configuration/RegistrationType';
import { useRouter } from 'vue-router';

const router = useRouter();
const mailField = ref('');
const passwordField = ref('');
const keepLoggedIn = ref(false);
const disableInputShowSpinner = ref(false);
const displayError = ref(false);
const registrationButtonVisible = ref(false);
const registrationFormVisible = ref(false);
const accountCreatedMessage = ref(false);

const configtype = ref(
  await ConfigRestInterface.getValue(ConfigKey.REGISTRATION_TYPE)
);

registrationButtonVisible.value =
  configtype.value == RegistrationType.PUBLIC ||
  configtype.value == RegistrationType.INVITATION;

onMounted(async () => {
  // Checks if the user is already logged in
  try {
    await AccountRestInterface.getOwnAccount();
    await router.push({ name: 'Overview' });
  } catch {
    // User isn't logged in, do nothing and show the login
  }
});

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
  accountCreatedMessage.value = false;
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

/**
 * Hides the registration container and adds success text
 */
function accountCreated(): void {
  accountCreatedMessage.value = true;
  registrationFormVisible.value = false;
}
</script>
