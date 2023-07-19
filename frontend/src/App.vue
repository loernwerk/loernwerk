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
          <div v-else class="absolute top-5 right-5 z-50">
            <LightDarkSwitch v-model="isDarkMode" />
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
import { RouterView, useRouter } from 'vue-router';
import NavigationBar from './components/NavigationBar.vue';
import { ref, Ref } from 'vue';
import { IUser } from '../../model/user/IUser';
import { AccountRestInterface } from './restInterfaces/AccountRestInterface';
import LightDarkSwitch from './components/LightDarkSwitch.vue';

const router = useRouter();
const isDarkMode = ref(false);
const user: Ref<Partial<IUser> | null> = ref(null);

// Making sure users are authenticated when trying to access restricted views
router.beforeEach(async (to) => {
  if (user.value === null && to.meta.requiresLogin) {
    try {
      user.value = await AccountRestInterface.getOwnAccount();
    } catch {
      // Redirecting after failing to authenticate
      return { name: 'LogIn' };
    }
  }
});
</script>
