<template>
  <div class="mt-4">
    <TextInputComponent
      class="mb-2 mt-4"
      v-model="userInfoField"
      place-holder="Nutzername der Lehrkraft"
      :class="{ 'border-red-600': showRedBorder }"
    >
    </TextInputComponent>
    <div class="flex flex-row space-x-2">
      <select class="interactable" v-model="setWriteAccess">
        <option :value="false">Lesezugriff</option>
        <option :value="true">Schreibzugriff</option>
      </select>
      <ButtonComponent class="flex-1" @click="confirmSharing()"
        >Teilen
      </ButtonComponent>
    </div>
    <div class="text-red-500" v-if="error">
      Es ist ein Fehler beim Freigeben der Sequenz aufgetreten.
    </div>
    <div v-if="readAccessArray.length > 0">Lehrkräfte mit Lesezugriff:</div>
    <table class="table-auto text-sm">
      <tbody>
        <tr v-for="(user, index) in displayReadAccess" :key="index">
          <td>
            <FontAwesomeIcon
              :icon="['fas', 'user-large-slash']"
              class="cursor-pointer mx-3"
              @click="deleteSharingByUserIndex(index, false)"
            />
          </td>
          <td>{{ user }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="writeAccessArray.length > 0">Lehrkräfte mit Schreibzugriff:</div>
    <table class="table-auto text-sm">
      <tbody>
        <tr v-for="(user, index) in displayWriteAccess" :key="index">
          <td>
            <FontAwesomeIcon
              :icon="['fas', 'user-large-slash']"
              class="cursor-pointer mx-3"
              @click="deleteSharingByUserIndex(index, true)"
            />
          </td>
          <td>{{ user }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import TextInputComponent from '../TextInputComponent.vue';
import { PropType, Ref, ref } from 'vue';
import ButtonComponent from '../ButtonComponent.vue';
import { ISequence } from '../../../../model/sequence/ISequence';
import { AccountRestInterface } from '../../restInterfaces/AccountRestInterface';
import { IUser } from '../../../../model/user/IUser';
import { SequenceRestInterface } from '../../restInterfaces/SequenceRestInterface';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUserLargeSlash } from '@fortawesome/free-solid-svg-icons';

library.add(faUserLargeSlash);

const props = defineProps({
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

const readAccessArray = ref([...props.sequence.readAccess]);
const writeAccessArray = ref([...props.sequence.writeAccess]);
const setWriteAccess = ref(false);

const displayReadAccess: Ref<string[]> = ref([]);
const displayWriteAccess: Ref<string[]> = ref([]);

await updateDisplayedListOfSharing();

/**
 * Process sharing of a sequences
 */
async function confirmSharing(): Promise<void> {
  error.value = false;
  showRedBorder.value = false;

  if (userInfoField.value.length == 0) {
    showRedBorder.value = true;
  } else {
    let user: Partial<IUser>;
    try {
      if (userInfoField.value.includes('@')) {
        user = await AccountRestInterface.getAccountByEmail(
          userInfoField.value
        );
      } else {
        user = await AccountRestInterface.getAccountByUserName(
          userInfoField.value
        );
      }
    } catch {
      error.value = true;
      return;
    }

    const userId = user.id as number;

    if (props.sequence.authorId == userId) {
      showRedBorder.value = true;
      return;
    }

    if (
      !readAccessArray.value.includes(userId) &&
      !writeAccessArray.value.includes(userId)
    ) {
      //get access for the first time
      if (setWriteAccess.value) {
        writeAccessArray.value.push(userId);
      } else {
        readAccessArray.value.push(userId);
      }
    } else if (readAccessArray.value.includes(userId) && setWriteAccess.value) {
      //has read access, wants write access
      readAccessArray.value = readAccessArray.value.filter(
        (id) => id !== userId
      );
      writeAccessArray.value.push(userId);
    } else if (
      writeAccessArray.value.includes(userId) &&
      !setWriteAccess.value
    ) {
      //has write access, wants read access
      writeAccessArray.value = writeAccessArray.value.filter(
        (id) => id !== userId
      );
      readAccessArray.value.push(userId);
    } else if (
      (writeAccessArray.value.includes(userId) && setWriteAccess.value) ||
      (readAccessArray.value.includes(userId) && !setWriteAccess.value)
    ) {
      //already has desired access
      userInfoField.value = '';
      return;
    }

    try {
      await SequenceRestInterface.updateSequence({
        code: props.sequence.code,
        writeAccess: writeAccessArray.value,
        readAccess: readAccessArray.value,
      });
    } catch {
      error.value = true;
      return;
    }

    await updateDisplayedListOfSharing();
    userInfoField.value = '';
  }
}

/**
 * Updates displayed list of sharing
 */
async function updateDisplayedListOfSharing(): Promise<void> {
  const allUserNames = await AccountRestInterface.getAccounts(
    readAccessArray.value.concat(writeAccessArray.value)
  );
  displayReadAccess.value = readAccessArray.value.map(
    (id) => allUserNames[id] || 'Unbekannter Benutzer'
  );
  displayWriteAccess.value = writeAccessArray.value.map(
    (id) => allUserNames[id] || 'Unbekannter Benutzer'
  );
}

/**
 * Deletes sharing with user by given index
 * @param index index of user to remove
 * @param hasWriteAccess if user had write access
 */
async function deleteSharingByUserIndex(
  index: number,
  hasWriteAccess: boolean
): Promise<void> {
  if (hasWriteAccess) {
    writeAccessArray.value.splice(index, 1);
  } else {
    readAccessArray.value.splice(index, 1);
  }

  try {
    await SequenceRestInterface.updateSequence({
      code: props.sequence.code,
      writeAccess: writeAccessArray.value,
      readAccess: readAccessArray.value,
    });
  } catch {
    error.value = true;
    return;
  }

  await updateDisplayedListOfSharing();
}
</script>
