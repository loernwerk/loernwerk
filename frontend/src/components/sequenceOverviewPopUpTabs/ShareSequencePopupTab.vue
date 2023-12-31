<template>
  <div class="mt-4">
    <form @submit.prevent="confirmSharing()">
      <TextInputComponent
        class="mb-2 mt-4"
        v-model="userInfoField"
        :place-holder="$t('sequence.teacherName')"
        :class="{ 'border-red-600': showRedBorder }"
      >
      </TextInputComponent>
    </form>
    <div class="flex flex-row space-x-2">
      <select class="interactable" v-model="setWriteAccess">
        <option :value="false">{{ $t('sequence.readAccess') }}</option>
        <option :value="true">{{ $t('sequence.writeAccess') }}</option>
      </select>
      <ButtonComponent
        class="flex-1"
        @click="confirmSharing()"
        :loading="loading"
        >{{ $t('sequence.share') }}
      </ButtonComponent>
    </div>
    <div class="text-error" v-if="error">
      {{ $t('sequence.shareError') }}
    </div>

    <div v-if="displayReadAccess.length > 0">
      {{ $t('sequence.teacherWith', { object: $t('sequence.readAccess') }) }}:
    </div>
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

    <div v-if="displayWriteAccess.length > 0">
      {{ $t('sequence.teacherWith', { object: $t('sequence.writeAccess') }) }}:
    </div>
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

const loading = ref(false);

/**
 * Process sharing of a sequences
 */
async function confirmSharing(): Promise<void> {
  error.value = false;
  showRedBorder.value = false;
  loading.value = true;

  if (userInfoField.value.length == 0) {
    loading.value = false;
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
      loading.value = false;
      return;
    }

    const userId = user.id as number;

    if (props.sequence.authorId == userId) {
      showRedBorder.value = true;
      loading.value = false;
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
      loading.value = false;
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
      loading.value = false;
      return;
    }

    await updateDisplayedListOfSharing();
    loading.value = false;
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
