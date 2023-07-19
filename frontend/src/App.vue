<!-- Main file for the Vue Application -->
<template>
  <div :class="{ dark: isDarkMode }">
    <div class="min-h-screen max-h-fit max-w-screen text-color bg-background">
      <div class="absolute top-0 bottom-0 left-0 right-0 flex flex-col">
        <Suspense>
          <NavigationBar
            v-if="$router.currentRoute.value.meta['hasNavBar']"
            v-model:dark-mode="isDarkMode"
          />
          <div v-else class="absolute top-5 right-5 z-50 flex space-x-5">
            <LightDarkSwitch v-model="isDarkMode" />
            <LanguageSelector :border-color="isDarkMode ? 'white' : 'black'" />
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
import { ref } from 'vue';
import LightDarkSwitch from './components/LightDarkSwitch.vue';
import LanguageSelector from './components/LanguageSelector.vue';

const isDarkMode = ref(false);
</script>
