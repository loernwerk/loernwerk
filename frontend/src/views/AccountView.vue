<template>
  <div>
    <Suspense>
      <AccountDetailsEditContainer :showadminview="true" />
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import AccountDetailsEditContainer from '../components/AccountDetailsEditContainer.vue';
</script>
