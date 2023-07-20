<template>
  <div>
    <ContainerComponent>
      <template #Header>
        <h1 class="underline text-xl">
          {{ $t('create', { object: $t('user') }) }}:
        </h1>
      </template>

      <template #default>
        <table class="w-full">
          <tr>
            <td class="p-1">{{ $t('account.name') }}:</td>
            <td class="p-1 w-2/3">
              <TextInputComponent
                :disabled="disableInputShowSpinner"
                :place-holder="$t('account.name')"
                :max-length="128"
                v-model="nameField"
              />
            </td>
          </tr>
          <tr>
            <td class="p-1">{{ $t('account.mail') }}:</td>
            <td class="p-1">
              <TextInputComponent
                :disabled="disableInputShowSpinner"
                :place-holder="$t('account.mail')"
                :max-length="320"
                v-model="mailField"
              />
            </td>
          </tr>
          <tr>
            <td class="p-1">{{ $t('account.password') }}:</td>
            <td class="p-1">
              <TextInputComponent
                :disabled="disableInputShowSpinner"
                :hidden="true"
                :place-holder="$t('account.password')"
                :max-length="128"
                v-model="pwField"
              />
            </td>
          </tr>
          <tr>
            <td class="p-1">{{ $t('account.passwordRepeat') }}:</td>
            <td class="p-1">
              <TextInputComponent
                :disabled="disableInputShowSpinner"
                :hidden="true"
                :place-holder="$t('account.passwordRepeat')"
                :max-length="128"
                v-model="pwFieldControl"
              />
            </td>
          </tr>
          <tr v-if="requiresInviteCode">
            <td class="p-1">{{ $t('account.inviteCode') }}:</td>
            <td class="p-1">
              <TextInputComponent
                :disabled="disableInputShowSpinner"
                :place-holder="$t('account.inviteCode')"
                :max-length="128"
                v-model="inviteCode"
              />
            </td>
          </tr>
        </table>
        <div class="flex items-center pt-4">
          <div class="flex-grow text-center">
            <div class="text-error" v-if="displayError">
              {{ $t('invalidInput') }}
            </div>
            <div class="text-success" v-if="displaySuccess">
              {{ $t('created', { object: $t('user') }) }}
            </div>
          </div>
          <ButtonComponent
            class="w-fit p-1"
            :loading="disableInputShowSpinner"
            @click="createUser()"
          >
            {{ $t('createAction') }}
          </ButtonComponent>
        </div>
      </template>
    </ContainerComponent>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import TextInputComponent from '../TextInputComponent.vue';
import ButtonComponent from '../ButtonComponent.vue';
import ContainerComponent from '../ContainerComponent.vue';
import { AccountRestInterface } from '../../restInterfaces/AccountRestInterface';

const emit = defineEmits([
  /**
   * emited, when an account is created
   */
  'create',
]);

const props = defineProps({
  requiresInviteCode: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const nameField = ref('');
const mailField = ref('');
const pwField = ref('');
const pwFieldControl = ref('');
const inviteCode = ref('');
const disableInputShowSpinner = ref(false);
const displayError = ref(false);
const displaySuccess = ref(false);
const regexMail =
  '[a-zA-Z0-9]+(?:\\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\\.[a-zA-Z0-9]+)+$';

/**
 * Creates a user with the given information
 */
async function createUser(): Promise<void> {
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
    await AccountRestInterface.addAccount(
      {
        name: nameField.value,
        mail: mailField.value,
        password: pwField.value,
      },
      props.requiresInviteCode === true ? inviteCode.value : undefined
    );
    displaySuccess.value = true;
    emit('create');
  } catch (e) {
    displayError.value = true;
  }
  disableInputShowSpinner.value = false;
}
</script>
