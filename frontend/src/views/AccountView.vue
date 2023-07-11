<template>
  <AccountDetailsEditContainer :user="originalUser" v-if="!showerror" />
</template>

<script setup lang="ts">
import { IUser } from '../../../model/user/IUser';
import AccountDetailsEditContainer from '../components/AccountDetailsEditContainer.vue';
import { AccountRestInterface } from '../restInterfaces/AccountRestInterface';
import { ref } from 'vue';

const showerror = ref(false);
let originalUser: Partial<IUser>;
originalUser = await AccountRestInterface.getOwnAccount();
</script>
