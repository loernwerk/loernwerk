<template>
  <AccountList
    :accounts="test"
    @selected="
      (r) => {
        console.log(r);
      }
    "
  />
</template>
<script setup lang="ts">
import { IUser } from '../../../model/user/IUser';
import AccountList from '../components/AccountList.vue';
import { AccountRestInterface } from '../restInterfaces/AccountRestInterface';
let test: Partial<IUser>[];
try {
  test = await AccountRestInterface.getAccountMetaDataList();
} catch (e) {
  console.log(e);
}
</script>
