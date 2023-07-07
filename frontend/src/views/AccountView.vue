<template>
  <div>
    <Suspense>
      <AccountDetailsEditContainer :showadmin="true" :showdelete="true" />
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import AccountDetailsEditContainer from '../components/AccountDetailsEditContainer.vue';
</script>
