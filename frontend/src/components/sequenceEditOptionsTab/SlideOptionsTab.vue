<template>
  <div class="flex flex-row space-x-5 w-full pt-5">
    <div class="flex flex-row space-x-5 grow items-start">
      <div class="border-r-1 pr-2 border-container-border items-start">
        <div class="flex items-center space-x-2">
          <p>Name:</p>
          <TextInputComponent
            :start-text="refSequence.name"
            @input-changed="(val) => updateSequenceName(val)"
          />
        </div>
      </div>
      <div class="flex space-x-2 items-center">
        <p>Hintergrundfarbe:</p>
        <input
          type="color"
          :value="color"
          @change="val => updateSlideBackgroundColor((val.target as HTMLInputElement).value)"
        />
      </div>
      <div class="flex space-x-2 items-start">
        <p class="flex items-center h-10">Anordnung:</p>
        <div class="flex flex-wrap flex-col h-28 space-y-2 space-x-2">
          <InteractableComponent
            v-for="layout in layouts"
            :key="layout"
            @click="updateSlideLayout(layout)"
          >
            <img
              :src="`/src/assets/layouts/${layoutImageMap[layout]}`"
              class="h-8"
            />
          </InteractableComponent>
        </div>
      </div>
    </div>
    <ButtonComponent @click="save()" class="h-fit">Speichern</ButtonComponent>
  </div>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue';
import { ISlide } from '../../../../model/slide/ISlide';
import ButtonComponent from '../ButtonComponent.vue';
import TextInputComponent from '../TextInputComponent.vue';
import { ISequence } from '../../../../model/sequence/ISequence';
import { LayoutType } from '../../../../model/slide/layout/Layout';
import InteractableComponent from '../InteractableComponent.vue';

const props = defineProps({
  slide: {
    type: Object as PropType<ISlide>,
    required: true,
  },

  sequence: {
    type: Object as PropType<ISequence>,
    required: true,
  },
});

const emits = defineEmits(['update-slide', 'update-sequence']);

const refSlide = ref(props.slide);
const color = refSlide.value.backgroundColor;
const refSequence = ref(props.sequence);

/**
 * Sends the updated sequence
 */
function updateSequence(): void {
  emits('update-sequence', refSequence.value);
}

/**
 * Sends the updated slide
 */
function updateSlide(): void {
  emits('update-slide', refSlide.value);
}

/**
 * Updates the name of the sequence
 * @param name The new name of the sequence
 */
function updateSequenceName(name: string): void {
  refSequence.value.name = name;
  updateSequence();
}

/**
 * Updates the background color of the slide
 * @param color The new background color of the slide
 */
function updateSlideBackgroundColor(color: string): void {
  refSlide.value.backgroundColor = color;
  updateSlide();
}

/**
 * Updates the layout of the slide
 * @param layout The new layout of the slide
 */
function updateSlideLayout(layout: LayoutType): void {
  refSlide.value.layout = layout;
  updateSlide();
}

/**
 * Saves the sequence
 */
function save(): void {
  // TODO
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
