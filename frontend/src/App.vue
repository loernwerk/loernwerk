<!-- Main file for the Vue Application -->
<template>
  <div :class="{ dark: isDarkMode }">
    <div class="min-h-screen max-h-fit max-w-screen text-black bg-backgorund">
      <div class="absolute top-0 bottom-0 left-0 right-0 flex flex-col">
        <Suspense>
          <NavigationBar v-if="$router.currentRoute.value.meta['hasNavBar']" />
          <div v-else class="absolute top-5 right-5">
            <LightDarkSwitch />
          </div>
        </Suspense>
        <div class="relative top-0 left-0 bottom-0 right-0 p-5 flex flex-grow">
          <Suspense>
            <RouterView />
          </Suspense>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import NavigationBar from './components/NavigationBar.vue';
import { computed, inject } from 'vue';
import LightDarkSwitch from './components/LightDarkSwitch.vue';

const isDarkMode = computed(() => {
  const value = inject<boolean>('isDarkMode');
  return value ?? false;
});
</script>
