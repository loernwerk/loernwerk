<template>
  <ContainerComponent>
    <template #Header>
      <div
        class="w-full flex flex-row border-b-1 border-container-border space-x-6"
      >
        <h1
          class="text-2xl mb-2 border-container-border"
          v-for="[index, tab] in tabs.entries()"
          :key="tab"
          @click="selectedTab = index"
          :class="{ 'border-b-1': selectedTab === index }"
        >
          {{ tab }}
        </h1>
        {{ selectedTab }}
      </div>
    </template>
    <template #default>
      <slot :name="tabs[selectedTab]"></slot>
    </template>
  </ContainerComponent>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ContainerComponent from './ContainerComponent.vue';

const props = defineProps({
  tabs: {
    type: Array<string>,
    required: true,
  },
});

const selectedTab = ref(0);

/**
 * Switches to a tab
 * @param tabName name of the tab to switch to
 */
function selectTab(tabName: string): void {
  const index = props.tabs.indexOf(tabName);
  if (index !== -1) {
    selectedTab.value = index;
  }
}

defineExpose({
  selectTab,
});
</script>
