<template>
  <div
    class="w-full h-20 bg-navbar flex flex-row items-center gap-5 drop-shadow"
  >
    <img src="../../assets/logo_navbar.png" class="h-10 mx-5" />
    <NavigationBarItem
      :active="isCurrentView('Overview')"
      targetLink="/overview"
    >
      Sequenzübersicht
    </NavigationBarItem>

    <NavigationBarItem v-if="currentViewLocalized !== ''" :active="true">
      {{ currentViewLocalized }}
    </NavigationBarItem>

    <NavigationBarItem
      :active="isCurrentView('Admin')"
      targetLink="/admin"
      v-if="isAdmin"
    >
      Admin
    </NavigationBarItem>

    <div class="flex-grow"></div>

    <div>
      <LightDarkSwitch v-model="isDarkMode" class="text-white" />
    </div>

    <FontAwesomeIcon
      icon="circle-user"
      size="3x"
      class="float-right mr-5 cursor-pointer text-white"
      @click="router.push({ name: 'Account' })"
    ></FontAwesomeIcon>
  </div>
</template>
<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { RouteLocationNormalized, useRouter } from 'vue-router';
import { ref, watch } from 'vue';
import { AccountRestInterface } from '../../restInterfaces/AccountRestInterface';
import { UserClass } from '../../../../model/user/IUser';
import NavigationBarItem from './NavigationBarItem.vue';
import LightDarkSwitch from './LightDarkSwitch.vue';

library.add(faCircleUser);

const props = defineProps({
  darkMode: {
    type: Boolean,
    required: true,
  },
});

const emits = defineEmits(['update:darkMode']);

const isDarkMode = ref(props.darkMode);
watch(
  () => props.darkMode,
  (newVal) => {
    isDarkMode.value = newVal;
  }
);
watch(isDarkMode, (newVal) => {
  emits('update:darkMode', newVal);
});

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
  router.push({ name: 'LogIn' });
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
    case 'SequenceEdit':
      currentViewLocalized.value = 'Sequenzbearbeitung';
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