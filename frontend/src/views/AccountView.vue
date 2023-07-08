<template>
  <div class="w-full mt-auto mb-auto ml-3 mr-3">
    <Suspense>
      <AccountDetailsEditContainer :showadminview="true" />
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import AccountDetailsEditContainer from '../components/AccountDetailsEditContainer.vue';
</script>
