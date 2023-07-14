<template>
  <ContainerComponent>
    <ButtonComponent
      @click="
        selectedUser = null;
        displayCreateUser = true;
      "
      @create="refresh()"
      class="p-0.5"
    >
      Nutzer erstellen
    </ButtonComponent>
    <AccountList
      v-model="test"
      @selected="
        (id) => {
          displayCreateUser = false;
          updateUser(id);
        }
      "
    />
  </ContainerComponent>
  <div v-if="selectedUser !== null" class="flex grow">
    <AccountDetailsEditContainer
      :showadminview="true"
      :user="selectedUser"
      @delete="refresh()"
    />
    <AccountSequenceContainer :sequences="sequencesOfUser" />
  </div>

  <AccountCreationContainer v-if="displayCreateUser" />
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
//import { SequenceRestInterface } from '../restInterfaces/SequenceRestInterface';

let displayCreateUser = ref(false);
let selectedUser: Ref<Partial<IUser>> | Ref<null> = ref(null);
let sequencesOfUser: Ref<ISequence[]> = ref([
  {
    name: 'test',
    creationDate: new Date(),
    modificationDate: new Date(),
    code: '111111',
    authorId: 1,
    writeAccess: [],
    readAccess: [],
    slideCount: 0,
  },
]);
let test: Ref<Partial<IUser>[] | undefined> = ref(undefined);
try {
  test.value = await AccountRestInterface.getAccountMetaDataList();
} catch (e) {
  console.log(e);
}
/**
 * Requests the user with the given id from the backend (currently not)
 * @param id the id of the user
 */
async function updateUser(id: number): Promise<void> {
  selectedUser.value = await AccountRestInterface.getAccount(id);
  //sequencesOfUser.value = await SequenceRestInterface.getSequenceByUser(selectedUser.value.id as number)
}
/**
 * refreshes the account list
 */
async function refresh(): Promise<void> {
  test.value = await AccountRestInterface.getAccountMetaDataList();
}
</script>
