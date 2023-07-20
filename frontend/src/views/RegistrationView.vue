<template>
  <div class="w-full mt-auto mb-auto ml-3 mr-3">
    <AccountCreationContainer />
  </div>
</template>

<script setup lang="ts">
import { ConfigKey } from '../../../model/configuration/ConfigKey';
import AccountCreationContainer from '../components/admin/AccountCreationContainer.vue';
import { ConfigRestInterface } from '../restInterfaces/ConfigRestInterface';
import { router } from '../router';

if (!(await ConfigRestInterface.getValue(ConfigKey.OPEN_REGISTRATION))) {
  router.push({ name: 'LogIn' });
}
</script>
