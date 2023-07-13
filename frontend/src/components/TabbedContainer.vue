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
<!--      <div class="mt-8">-->
<!--        <div class="mt-2" v-for="(tab, index) in tabs" :key="index">-->
<!--          <ContainerComponent v-if="activeTab === tab">-->
<!--            <component :is="getContentComponent()" />-->
<!--          </ContainerComponent>-->
<!--        </div>-->
<!--      </div>-->
      <div v-for="(item, index) in tabs" :key="index">
        <slot name="index" :item="item" v-if="activeTab == index">
        </slot>
      </div>

<!--          <div v-for="(item, index) in tabs" :key="index">-->
<!--&lt;!&ndash;            <slot name="item" :item="item" />&ndash;&gt;-->
<!--            <ButtonComponent v-if="activeTab == index">{{ activeTab }}</ButtonComponent>-->
<!--          </div>-->

<!--        <ButtonComponent v-if="activeTab == 0">Button 1</ButtonComponent>-->
<!--        <ButtonComponent v-if="activeTab == 1">Button 2</ButtonComponent>-->
<!--        <ButtonComponent v-if="activeTab == 2">Button 3</ButtonComponent>-->

    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import ButtonComponent from './ButtonComponent.vue';
import ContainerComponent from './ContainerComponent.vue';
import {ref} from "vue";

let activeTab = ref(0);
const props = defineProps({
  tabs: Object as () => string[],
});

/**
 * @returns the tabs which the container has
 */
// function getContentComponent(): unknown {
//   return props.tabs?.forEach(getActiveTab);
// }
function changeTab(index) {
  // index++;
  // if (index > props.tabs?.length) {
  //   index = 0;
  // }
  console.log('setting activeTab to ' + typeof index)
  activeTab.value = index;
}
/**
 * Gets the currently active tab
 * @param activeTab the Tab currently shown to the user
 * @returns the type of tab to be opened
 */
// function getActiveTab(activeTab): unknown {
//   switch (activeTab) {
//     case 'Sequenz löschen':
//       return 'DeleteSequencePopup';
//     case 'Sequenz teilen':
//       return 'ShareSequencePopupTab';
//     case 'Sequenz mit einem Tag versehen':
//       return 'TagSequencePopupTab';
//   }
// }
</script>
<style scoped></style>
