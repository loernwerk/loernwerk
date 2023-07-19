<template>
  <div class="flex flex-grow text-center">
    <div class="text-error text-center flex-grow" v-if="showerror">
      {{ $t('notAvailable', { object: 'Account' }) }}
    </div>
  </div>
  <div class="w-full mt-auto mb-auto ml-3 mr-3">
    <AccountDetailsEditContainer :user="originalUser" v-if="!showerror" />
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
} catch (e) {
  showerror.value = true;
}
</script>
