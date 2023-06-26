<template>
  <div class="min-h-screen max-h-fit max-w-screen text-black bg-backgorund">
    <RouterView class="max-h-screen overflow-hidden" />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>
