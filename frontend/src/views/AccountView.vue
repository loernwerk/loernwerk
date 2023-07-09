<template>
  <div class="flex-grow text-center">
    <div class="text-green-500 italic" v-if="showerror">
      Account nicht verfügbar
    </div>
  </div>
  <div class="w-full mt-auto mb-auto ml-3 mr-3">
    <AccountDetailsEditContainer :user="originalUser" v-if="!showerror" />
  </div>
</template>

<script setup lang="ts">
import {
  LoernwerkError,
  LoernwerkErrorCodes,
} from '../../../backend/loernwerkError';
import { IUser } from '../../../model/user/IUser';
import AccountDetailsEditContainer from '../components/AccountDetailsEditContainer.vue';
import { AccountRestInterface } from '../restInterfaces/AccountRestInterface';
import { router } from '../router';
import { ref } from 'vue';

const showerror = ref(false);
let originalUser: Partial<IUser>;
try {
  originalUser = await AccountRestInterface.getOwnAccount();
  console.log(originalUser);
} catch (e) {
  if (e instanceof LoernwerkError) {
    if (e.code === LoernwerkErrorCodes.UNAUTHORIZED) {
      router.push('LogIn');
    } else {
      showerror.value = true;
    }
  } else {
    showerror.value = true;
  }
}
</script>
