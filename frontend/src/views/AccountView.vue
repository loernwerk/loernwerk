<template>
  <div class="w-1/2 align-center">
    <Suspense>
      <AccountDetailsEditContainer :showadminview="true" />
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import AccountDetailsEditContainer from '../components/AccountDetailsEditContainer.vue';
</script>
