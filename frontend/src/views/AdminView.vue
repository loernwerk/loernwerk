<template>
  <div class="w-full flex h-[calc(100vh-2.5rem)]">
    <ContainerComponent class="w-1/4 overflow-hidden">
      <ButtonComponent
        @click="
          selectedUser = null;
          displayCreateUser = true;
        "
        class="p-0.5"
      >
        Nutzer erstellen
      </ButtonComponent>
      <AccountList
        :accounts="accounts"
        @selected="
          (id) => {
            displayCreateUser = false;
            updateUser(id);
          }
        "
      />
    </ContainerComponent>
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
  </div>
</template>
<script setup lang="ts">
import { Ref, ref } from 'vue';
import { IUser } from '../../../model/user/IUser';
import AccountDetailsEditContainer from '../components/AccountDetailsEditContainer.vue';
import AccountList from '../components/AccountList.vue';
import { AccountRestInterface } from '../restInterfaces/AccountRestInterface';
import ContainerComponent from '../components/ContainerComponent.vue';
import ButtonComponent from '../components/ButtonComponent.vue';
import AccountCreationContainer from '../components/AccountCreationContainer.vue';
import AccountSequenceContainer from '../components/AccountSequenceContainer.vue';
import { ISequence } from '../../../model/sequence/ISequence';
import { SequenceRestInterface } from '../restInterfaces/SequenceRestInterface';

const displayCreateUser = ref(false);
const selectedUser: Ref<Partial<IUser>> | Ref<null> = ref(null);
const sequencesOfUser: Ref<ISequence[]> = ref([]);
const accounts: Ref<Partial<IUser>[]> = ref([]);
try {
  accounts.value = await AccountRestInterface.getAccountMetaDataList();
} catch (e) {
  console.log(e);
}
/**
 * Requests the user with the given id from the backend (currently not)
 * @param id the id of the user
 */
async function updateUser(id: number): Promise<void> {
  console.log(id);
  selectedUser.value = null;
  selectedUser.value = await AccountRestInterface.getAccount(id);
  sequencesOfUser.value = await SequenceRestInterface.getSequenceByUser(
    selectedUser.value.id as number
  );
}
/**
 * refreshes the account list
 */
async function refresh(): Promise<void> {
  console.log('refreshing');
  accounts.value = await AccountRestInterface.getAccountMetaDataList();
  console.log(accounts.value);
}
/**
 * refreshing the sequenceArray
 */
async function refreshSequence(): Promise<void> {
  sequencesOfUser.value = await SequenceRestInterface.getSequenceByUser(
    selectedUser.value?.id as number
  );
}
</script>
