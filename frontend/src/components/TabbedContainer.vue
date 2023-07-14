<template>
  <ContainerComponent>
    <template #Header>
      <div
        class="w-full flex flex-row border-b-1 border-container-border space-x-6"
      >
        <h1
          class="text-2xl mb-2 border-container-border"
          v-for="tab in shownTabs"
          :key="tab"
          @click="selectedTab = tab"
          :class="{ 'border-b-1': selectedTab === tab }"
        >
          {{ tab }}
        </h1>
        {{ selectedTab }}
      </div>
    </template>
    <template #default>
      <div
        v-for="tab in possibleTabs"
        :key="tab"
        :class="{ hidden: tab != selectedTab }"
      >
        <slot :name="tab"></slot>
      </div>
      <slot></slot>
    </template>
  </ContainerComponent>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import ContainerComponent from './ContainerComponent.vue';

const props = defineProps({
  possibleTabs: {
    type: Array<string>,
    required: true,
  },
  shownTabs: {
    type: Array<string>,
    required: true,
  },
});

const selectedTab = ref(props.shownTabs[0]);

/**
 * Switches to a tab
 * @param tabName name of the tab to switch to
 */
function selectTab(tabName: string): void {
  const index = props.shownTabs.indexOf(tabName);
  if (index !== -1) {
    selectedTab.value = tabName;
  }
}

defineExpose({
  selectTab,
});

watch(props.shownTabs, (newValue) => {
  if (!newValue.includes(selectedTab.value)) {
    selectedTab.value = newValue[0];
  }
});
</script>