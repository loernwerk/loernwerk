<template>
  <AccountList :accounts="test" />
</template>
<script setup lang="ts">
import AccountList from '../components/AccountList.vue';
import { AccountRestInterface } from '../restInterfaces/AccountRestInterface';
const test = await AccountRestInterface.getAccountMetaDataList();
</script>
