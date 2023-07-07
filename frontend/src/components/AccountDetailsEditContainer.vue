<template>
  <ContainerComponent>
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
    <ButtonComponent
      class="w-fit"
      :loading="disableInputShowSpinner"
      @click="updateInformation()"
    >
      Speichern
    </ButtonComponent>
  </ContainerComponent>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import TextInputComponent from './TextInputComponent.vue';
import ButtonComponent from './ButtonComponent.vue';
import ContainerComponent from './ContainerComponent.vue';

const nameField = ref('');
const mailField = ref('');
const pwField = ref('');
const pwFieldControl = ref('');
const disableInputShowSpinner = ref(false);

/**
 * Updates Information from the User with the entered information
 */
async function updateInformation(): Promise<void> {
  disableInputShowSpinner.value = true;
  //TODO: Logic
  disableInputShowSpinner.value = false;
}
</script>
