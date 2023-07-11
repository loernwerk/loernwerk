<template>
  <div class="w-full h-20 bg-gray-300 flex flex-row items-center gap-5">
    <img src="../assets/Logo.png" class="h-full mr-5" />
    <span
      class="text-2xl font-bold italic select-none"
      v-if="currentViewLocalized !== ''"
      >{{ currentViewLocalized }}</span
    >
    <span
      class="text-2xl cursor-pointer select-none"
      :class="{ 'selected-menu-item': isCurrentView('LogIn') }"
      >Sequenzübersicht</span
    >
    <span class="text-2xl cursor-pointer select-none" v-if="isAdmin"
      >Admin</span
    >
    <ButtonComponent class="text-2xl">Sequenzübersicht</ButtonComponent>
    <ButtonComponent class="text-2xl">Admin</ButtonComponent>
    <div class="flex-grow"></div>
    <FontAwesomeIcon
      icon="circle-user"
      size="3x"
      class="float-right mr-5 cursor-pointer"
    ></FontAwesomeIcon>
  </div>
</template>
<script setup lang="ts">
import ButtonComponent from './ButtonComponent.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { RouteLocationNormalized, useRouter } from 'vue-router';
import { ref } from 'vue';
import { AccountRestInterface } from '../restInterfaces/AccountRestInterface';
import { UserClass } from '../../../model/user/IUser';

library.add(faCircleUser);

const router = useRouter();
const currentView = ref('');
const currentViewLocalized = ref('');
const isAdmin = ref(false);

router.afterEach((to) => updateNavBar(to));
updateNavBar(router.currentRoute.value);

try {
  const user = await AccountRestInterface.getOwnAccount();
  isAdmin.value = user.type === UserClass.ADMIN;
} catch {
  router.push('LogIn');
}

/**
 * Updates the currently selected item in the navbar after a page switch
 * @param newView New view that got switched to
 */
function updateNavBar(newView: RouteLocationNormalized): void {
  currentView.value = newView.name as string;

  // Localizing the current view
  currentViewLocalized.value = '';
  switch (currentView.value) {
    // Template
    case 'Main':
      currentViewLocalized.value = 'Startseite';
      break;
  }
}

/**
 * Helper function to compare the current view against a string.
 * Used to avoid comparisons in class-bindings.
 * @param viewName View name to compare against
 * @returns true, if the current view name is equal to the given string, false otherwise
 */
function isCurrentView(viewName: string): boolean {
  return currentView.value === viewName;
}
</script>

<style scoped>
.selected-menu-item {
  font-style: italic;
  font-weight: bold;
}
</style>
