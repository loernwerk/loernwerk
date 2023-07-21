<template>
  <ContainerComponent>
    <template #Header>
      <div
        class="w-full flex flex-row border-b-1 border-container-border space-x-6"
      >
        <h1
          class="text-2xl mb-2 border-tabselector"
          v-for="tab in shownTabs"
          :key="tab"
          @click="selectedTab = tab"
          :class="{
            'border-b-2': selectedTab === tab,
            'font-bold': selectedTab === tab,
          }"
        >
          {{ $t(tab) }}
        </h1>
      </div>
    </template>
    <template #default>
      <div v-for="tab in possibleTabs" :key="tab" v-show="tab == selectedTab">
        <slot :name="tab"></slot>
      </div>
    </template>
  </ContainerComponent>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from 'vue';
import ContainerComponent from './ContainerComponent.vue';

const props = defineProps({
  /**
   * The tabs that can exist
   */
  possibleTabs: {
    type: Array<string>,
    required: true,
  },
  /**
   * The tabs that are currently selecteble
   */
  shownTabs: {
    type: Array<string>,
    required: true,
  },
});

const selectedTab = ref(props.shownTabs[0]);
const nextTab: Ref<string | undefined> = ref(props.shownTabs[0]);

/**
 * Switches to a tab
 * @param tabName name of the tab to switch to
 */
function selectTab(tabName: string): void {
  const index = props.shownTabs.indexOf(tabName);
  if (index !== -1) {
    selectedTab.value = tabName;
  } else {
    nextTab.value = tabName;
  }
}

defineExpose({
  selectTab,
});

watch(
  () => props.shownTabs,
  (newValue) => {
    if (!newValue.includes(selectedTab.value)) {
      selectedTab.value = newValue[0];
    }
    if (nextTab.value && newValue.includes(nextTab.value)) {
      selectedTab.value = nextTab.value;
      nextTab.value = undefined;
    }
  }
);
</script>
