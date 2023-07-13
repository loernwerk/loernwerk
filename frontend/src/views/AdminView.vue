<template>
  <AccountList
    :accounts="test"
    @selected="
      (id) => {
        console.log('pressed');
        updateUser(id);
      }
    "
  />
  <AccountDetailsEditContainer
    v-if="selectedUser !== null"
    :showadminview="true"
    :user="selectedUser"
  />
</template>
<script setup lang="ts">
import { Ref, ref } from 'vue';
import { IUser } from '../../../model/user/IUser';
import AccountDetailsEditContainer from '../components/AccountDetailsEditContainer.vue';
import AccountList from '../components/AccountList.vue';
import { AccountRestInterface } from '../restInterfaces/AccountRestInterface';

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
