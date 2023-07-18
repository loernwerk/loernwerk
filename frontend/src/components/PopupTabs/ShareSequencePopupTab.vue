<template>
  <div class="mt-4">Lehrkräfte mit Lesezugriff:</div>
  <ul>
    <li
      class="text-sm"
      v-for="(user, index) in sharedUsersReadAccess"
      :key="index"
    >
      {{ user }}
    </li>
  </ul>
  Lehrkräfte mit Schreibzugriff:
  <ul>
    <li
      class="text-sm"
      v-for="(user, index) in sharedUsersWriteAccess"
      :key="index"
    >
      {{ user }}
    </li>
  </ul>

  <TextInputComponent
    class="mb-2 mt-4"
    v-model="userInfoField"
    place-holder="Nutzername der Lehrkraft"
    :class="{ 'border-red-600': showRedBorder }"
  >
  </TextInputComponent>
  <div class="flex flex-row">
    <select
      class="border-solid border-1 bg-interactable border-interactable-border rounded basis-1/2 mr-2 pl-2"
      v-model="writeAccess"
    >
      <option :value="false">Lesezugriff</option>
      <option :value="true">Schreibzugriff</option>
    </select>
    <ButtonComponent class="basis-1/2" @click="confirmSharing()"
      >Teilen
    </ButtonComponent>
  </div>
  <div class="text-red-500" v-if="error">
    Es ist ein Fehler beim Freigeben der Sequenz aufgetreten.
  </div>
</template>

<script setup lang="ts">
import TextInputComponent from '../TextInputComponent.vue';
import { PropType, Ref, ref } from 'vue';
import ButtonComponent from '../ButtonComponent.vue';
import { ISequence } from '../../../../model/sequence/ISequence';

defineProps({
  /**
   * Sequence to share
   */
  sequence: {
    type: Object as PropType<ISequence>,
    required: true,
  },
});

const userInfoField = ref('');
const showRedBorder = ref(false);
const error = ref(false);
/*
 * const sharedUsersReadAccess = ref(props.sequence.readAccess);
 * const sharedUsersWriteAccess = ref(props.sequence.writeAccess);
 */
const sharedUsersReadAccess: Ref<string[]> = ref([]);
const sharedUsersWriteAccess: Ref<string[]> = ref([]);
const writeAccess = ref(false);

/**
 * Process sharing of a sequences
 */
async function confirmSharing(): Promise<void> {
  error.value = false;

  if (userInfoField.value.length == 0) {
    showRedBorder.value = true;
  } else {
    //TODO Save shared sequences and users
    if (writeAccess.value) {
      sharedUsersWriteAccess.value.push(userInfoField.value);
    } else {
      sharedUsersReadAccess.value.push(userInfoField.value);
    }
    userInfoField.value = '';
  }
}
</script>
