<template>
  <ContainerComponent>
    <div class="max-w-lg mx-auto">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex">
          <ButtonComponent
            v-for="(tab, index) in tabs"
            :key="index"
            @click="changeTab(index)"
            :class="{
              'border-blue-500 text-blue-600': activeTab == index,
              'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300':
                activeTab !== index,
            }"
            class="w-1/2 py-4 px-4 font-medium text-sm leading-5 focus:outline-none"
          >
            {{ tab }}
          </ButtonComponent>
        </nav>
      </div>

      <div v-for="(item, index) in tabs" :key="index">
        <slot :name="`${index}`" v-if="activeTab == index"> </slot>
      </div>
    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import ButtonComponent from './ButtonComponent.vue';
import ContainerComponent from './ContainerComponent.vue';
import { ref } from 'vue';

let activeTab = ref(0);

defineProps({
  /**
   * Possible tabs to open
   */
  tabs: {
    type: Array<string>,
    required: true,
  },
});

/**
 * Changes active tab
 * @param index index of chosen tab
 */
function changeTab(index: number): void {
  console.log('setting activeTab to ' + index);
  activeTab.value = index;
}
</script>
