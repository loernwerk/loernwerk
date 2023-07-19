<template>
  <div class="w-full flex h-full">
    <AccountList
      :accounts="accounts"
      @selected="
        (id) => {
          displayCreateUser = false;
          updateUser(id);
        }
      "
      @createUser="
        selectedUser = null;
        displayCreateUser = true;
      "
    />
    <div class="flex flex-grow">
      <div v-if="selectedUser !== null" class="w-full flex">
        <AccountDetailsEditContainer
          class="w-2/3 pl-1 pr-1"
          :showadminview="true"
          :user="selectedUser"
          @delete="refresh()"
        />
        <AccountSequenceContainer
          :sequences="sequencesOfUser"
          class="flex-grow"
          @sequence-delete="refreshSequence()"
        />
      </div>
      <AccountCreationContainer
        v-if="displayCreateUser"
        class="w-2/3 pl-1"
        @create="refresh()"
      />
    </div>
    <ButtonComponent class="absolute -top-2 -right-2 text-2xl">
      <FontAwesomeIcon :icon="['fas', 'gear']" />
    </ButtonComponent>
  </div>
</template>
<script setup lang="ts">
import { Ref, ref } from 'vue';
import { IUser } from '../../../model/user/IUser';
import AccountDetailsEditContainer from '../components/AccountDetailsEditContainer.vue';
import AccountList from '../components/AccountList.vue';
import { AccountRestInterface } from '../restInterfaces/AccountRestInterface';
import AccountCreationContainer from '../components/AccountCreationContainer.vue';
import AccountSequenceContainer from '../components/AccountSequenceContainer.vue';
import { ISequence } from '../../../model/sequence/ISequence';
import { SequenceRestInterface } from '../restInterfaces/SequenceRestInterface';
import { router } from '../router';
import ButtonComponent from '../components/ButtonComponent.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faGear } from '@fortawesome/free-solid-svg-icons';

library.add(faGear);

const displayCreateUser = ref(false);
const selectedUser: Ref<Partial<IUser>> | Ref<null> = ref(null);
const sequencesOfUser: Ref<ISequence[]> = ref([]);
const accounts: Ref<Partial<IUser>[]> = ref([]);
try {
  accounts.value = await AccountRestInterface.getAccountMetaDataList();
} catch {
  router.push({ name: 'Main' });
}
/**
 * Requests the user with the given id from the backend (currently not)
 * @param id the id of the user
 */
async function updateUser(id: number): Promise<void> {
  selectedUser.value = await AccountRestInterface.getAccount(id);
  sequencesOfUser.value = await SequenceRestInterface.getSequenceByUser(
    selectedUser.value.id as number
  );
}
/**
 * refreshes the account list
 */
async function refresh(): Promise<void> {
  accounts.value = await AccountRestInterface.getAccountMetaDataList();
  console.log(accounts.value);
}
/**
 * refreshes the sequenceArray
 */
async function refreshSequence(): Promise<void> {
  sequencesOfUser.value = await SequenceRestInterface.getSequenceByUser(
    selectedUser.value?.id as number
  );
}
</script>
