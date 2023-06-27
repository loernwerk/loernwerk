<template>
  <div class="min-h-screen max-h-fit max-w-screen text-black bg-backgorund">
    <div class="absolute top-0 bottom-0 left-0 right-0 flex flex-col">
      <div class="relative top-0 left-0 bottom-0 right-0 p-5 flex flex-grow">
        <RouterView class="" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>
