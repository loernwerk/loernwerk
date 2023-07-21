<template>
  <div class="w-full pt-5">
    <div class="flex space-x-2 items-start w-full">
      <p class="flex items-center h-14">{{ $t('content.layout') }}:</p>
      <div class="flex h-14">
        <InteractableComponent
          v-for="layout in layouts"
          :class="{ 'bg-interactable-selected': layout == slide.layout }"
          :key="layout"
          @click="updateSlideLayout(layout)"
          class="mb-2 mr-2"
        >
          <img :src="getLayoutImageUrl(layoutImageMap[layout])" class="h-8" />
        </InteractableComponent>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { ISlide } from '../../../../model/slide/ISlide';
import { LayoutType } from '../../../../model/slide/layout/Layout';
import InteractableComponent from '../InteractableComponent.vue';

const props = defineProps({
  /**
   * The slide being edited
   */
  slide: {
    type: Object as PropType<ISlide>,
    required: true,
  },
});

const emits = defineEmits([
  /**
   * Emitted when the slide has been updated
   *
   * @param slide The updated slide
   */
  'update-slide',
]);

/**
 * Sends the updated slide
 * @param slide The new slide
 */
function updateSlide(slide: ISlide): void {
  emits('update-slide', slide);
}

/**
 * Updates the layout of the slide
 * @param layout The new layout of the slide
 */
function updateSlideLayout(layout: LayoutType): void {
  const tempSlide = props.slide;
  tempSlide.layout = layout;
  updateSlide(tempSlide);
}

/**
 * Returns the url to the image of the supplied layout
 * @param image Image to fetch url for
 * @returns url to the supplied image
 */
function getLayoutImageUrl(image: string): string {
  return new URL(`../../assets/layouts/${image}`, import.meta.url).href;
}

const layoutImageMap: Record<LayoutType, string> = {
  [LayoutType.TITLEPAGE]: 'Title.png',
  [LayoutType.SINGLE_COLUMN]: 'Main.png',
  [LayoutType.TWO_COLUMN]: 'Two.png',
  [LayoutType.GRID]: 'Four.png',
  [LayoutType.SINGLE_COLUMN_WITH_HEADER]: 'MainTitle.png',
  [LayoutType.TWO_COLUMN_WITH_HEADER]: 'TwoTitle.png',
  [LayoutType.GRID_WITH_HEADER]: 'FourTitle.png',
  [LayoutType.SIDEBAR]: 'Sidebar.png',
};

const layouts = [
  LayoutType.TITLEPAGE,
  LayoutType.SIDEBAR,
  LayoutType.SINGLE_COLUMN_WITH_HEADER,
  LayoutType.SINGLE_COLUMN,
  LayoutType.TWO_COLUMN_WITH_HEADER,
  LayoutType.TWO_COLUMN,
  LayoutType.GRID_WITH_HEADER,
  LayoutType.GRID,
];
</script>
