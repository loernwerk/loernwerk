<template>
  <ContainerComponent>
    <ButtonComponent
      @click="
        selectedUser = null;
        displayCreateUser = true;
      "
    >
      Nutzer erstellen
    </ButtonComponent>
    <AccountList
      :accounts="test"
      @selected="
        (id) => {
          displayCreateUser = false;
          updateUser(id);
        }
      "
    />
  </ContainerComponent>
  <AccountDetailsEditContainer
    v-if="selectedUser !== null"
    :showadminview="true"
    :user="selectedUser"
  />
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

let displayCreateUser = ref(false);
let selectedUser: Ref<Partial<IUser>> | Ref<null> = ref(null);
let test: Partial<IUser>[];
try {
  test = await AccountRestInterface.getAccountMetaDataList();
} catch (e) {
  console.log(e);
}
/**
 * Requests the user with the given id from the backend (currently not)
 * @param id the id of the user
 */
async function updateUser(id: number): Promise<void> {
  void id;
  selectedUser.value = await AccountRestInterface.getOwnAccount();
}
</script>
