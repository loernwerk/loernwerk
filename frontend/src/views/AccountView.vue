<template>
  <div class="flex-grow text-center" v-if="showerror">
    <div class="text-red-500 italic">Account nicht verfügbar</div>
  </div>
  <div class="w-full mt-auto mb-auto ml-3 mr-3" v-if="!showerror">
    <AccountDetailsEditContainer :user="originalUser" />
  </div>
</template>

<script setup lang="ts">
import { IUser } from '../../../model/user/IUser';
import AccountDetailsEditContainer from '../components/AccountDetailsEditContainer.vue';
import { AccountRestInterface } from '../restInterfaces/AccountRestInterface';
import { ref } from 'vue';

const showerror = ref(false);
let originalUser: Partial<IUser>;
try {
  originalUser = await AccountRestInterface.getOwnAccount();
  console.log(originalUser);
} catch (e) {
  showerror.value = true;
}
</script>
