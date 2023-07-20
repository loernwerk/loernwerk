<template>
  <div class="flex flex-grow text-center">
    <div class="text-error text-center flex-grow" v-if="showerror">
      {{ $t('notAvailable', { object: 'Account' }) }}
    </div>
  </div>
  <div class="w-full mt-auto mb-auto ml-3 mr-3">
    <AccountDetailsEditContainer :user="originalUser" v-if="!showerror" />
    <ButtonComponent class="w-fit mt-2" @click="logout()"
      >Logout</ButtonComponent
    >
  </div>
</template>

<script setup lang="ts">
import { IUser } from '../../../model/user/IUser';
import AccountDetailsEditContainer from '../components/AccountDetailsEditContainer.vue';
import { AccountRestInterface } from '../restInterfaces/AccountRestInterface';
import { ref } from 'vue';
import ButtonComponent from '../components/ButtonComponent.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const showerror = ref(false);
let originalUser: Partial<IUser>;

try {
  originalUser = await AccountRestInterface.getOwnAccount();
} catch (e) {
  showerror.value = true;
}

/**
 * Tries to logout the currently logged in user.
 */
async function logout(): Promise<void> {
  await AccountRestInterface.logout();
  await router.push({ name: 'LogIn' });
}
</script>
