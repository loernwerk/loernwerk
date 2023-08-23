<template>
  <div class="w-full h-full">
    <div class="w-full flex h-full space-x-5">
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
        <div v-if="selectedUser !== null" class="w-full flex space-x-2">
          <AccountDetailsEditContainer
            class="w-2/3 pl-1 pr-1"
            :showadminview="true"
            :user="selectedUser"
            @delete="refresh()"
          />
          <AccountSequenceContainer
            :sequences="sequencesOfUser"
            class="flex-grow"
            @delete="refreshSequence()"
          />
        </div>
        <AccountCreationContainer
          v-if="displayCreateUser"
          class="w-2/3 pl-1"
          @create="refresh()"
        />
      </div>
      <ButtonComponent
        class="absolute top-2 right-2 text-2xl"
        @click="showConfigEditor = true"
      >
        <FontAwesomeIcon :icon="['fas', 'gear']" />
      </ButtonComponent>
    </div>
    <PopupComponent v-if="showConfigEditor" @closed="showConfigEditor = false">
      <ContainerComponent class="px-10 py-10">
        <template #Header>
          <h1 class="text-xl underline">{{ $t('config.config') }}</h1>
        </template>
        <template #default>
          <ConfigEditor
            :entries="(configs as Record<ConfigKey, unknown>)"
            @save="() => onConfigSave()"
          />
        </template>
      </ContainerComponent>
    </PopupComponent>
  </div>
</template>
<script setup lang="ts">
import { Ref, ref } from 'vue';
import { IUser } from '../../../model/user/IUser';
import AccountDetailsEditContainer from '../components/AccountDetailsEditContainer.vue';
import AccountList from '../components/admin/AccountList.vue';
import { AccountRestInterface } from '../restInterfaces/AccountRestInterface';
import AccountCreationContainer from '../components/admin/AccountCreationContainer.vue';
import AccountSequenceContainer from '../components/admin/AccountSequenceContainer.vue';
import { ISequence } from '../../../model/sequence/ISequence';
import { SequenceRestInterface } from '../restInterfaces/SequenceRestInterface';
import ButtonComponent from '../components/ButtonComponent.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import PopupComponent from '../components/PopupComponent.vue';
import ConfigEditor from '../components/admin/ConfigEditor.vue';
import { ConfigRestInterface } from '../restInterfaces/ConfigRestInterface';
import { ConfigKey } from '../../../model/configuration/ConfigKey';
import ContainerComponent from '../components/ContainerComponent.vue';
import { useRouter } from 'vue-router';

library.add(faGear);
const router = useRouter();

const showConfigEditor = ref(false);
const configs = ref({});
const displayCreateUser = ref(false);
const selectedUser: Ref<Partial<IUser>> | Ref<null> = ref(null);
const sequencesOfUser: Ref<ISequence[]> = ref([]);
const accounts: Ref<Partial<IUser>[]> = ref([]);
try {
  accounts.value = await AccountRestInterface.getAccountMetaDataList();
  configs.value = await ConfigRestInterface.getAllValue();
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

/**
 * Saves the configs to the backend
 */
async function onConfigSave(): Promise<void> {
  showConfigEditor.value = false;
  configs.value = await ConfigRestInterface.getAllValue();
}
</script>
