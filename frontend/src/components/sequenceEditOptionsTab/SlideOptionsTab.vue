<template>
  <div class="flex flex-row space-x-5 w-full pt-5">
    <div class="flex flex-row space-x-5 grow items-start">
      <div class="border-r-1 pr-2 border-container-border items-start">
        <div class="flex items-center space-x-2">
          <p>{{ $t('content.sequenceName') }}:</p>
          <TextInputComponent
            :start-text="sequence.name"
            v-model="sequenceName"
          />
        </div>
      </div>
      <div class="flex space-x-2 items-center">
        <p>{{ $t('content.backgorund') }}:</p>
        <input
          type="color"
          :value="slide.backgroundColor"
          @change="val => updateSlideBackgroundColor((val.target as HTMLInputElement).value)"
        />
      </div>
      <div class="flex space-x-2 items-start">
        <p class="flex items-center h-10">{{ $t('content.layout') }}:</p>
        <div class="flex flex-wrap flex-col h-28">
          <InteractableComponent
            v-for="layout in layouts"
            :class="{ 'bg-interactable-selected': layout == slide.layout }"
            :key="layout"
            @click="updateSlideLayout(layout)"
            class="mb-2 mr-2"
          >
            <img
              :src="`/src/assets/layouts/${layoutImageMap[layout]}`"
              class="h-8"
            />
          </InteractableComponent>
        </div>
      </div>
    </div>
    <ButtonComponent @click="$emit('save')" class="h-fit">{{
      $t('save')
    }}</ButtonComponent>
  </div>
</template>

<script setup lang="ts">
import { PropType, ref, watch } from 'vue';
import { ISlide } from '../../../../model/slide/ISlide';
import ButtonComponent from '../ButtonComponent.vue';
import TextInputComponent from '../TextInputComponent.vue';
import { ISequence } from '../../../../model/sequence/ISequence';
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

  /**
   * The sequence being edited
   */
  sequence: {
    type: Object as PropType<ISequence>,
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
  /**
   * Emitted when the sequence has been updated
   *
   * @param sequence The updated sequence
   */
  'update-sequence',
  /**
   * Emitted when the save button has been clicked
   */
  'save',
]);

const sequenceName = ref(props.sequence.name);
watch(sequenceName, () => updateSequenceName(sequenceName.value));

/**
 * Sends the updated sequence
 * @param sequence The new Sequence
 */
function updateSequence(sequence: ISequence): void {
  emits('update-sequence', sequence);
}

/**
 * Sends the updated slide
 * @param slide The new slide
 */
function updateSlide(slide: ISlide): void {
  emits('update-slide', slide);
}

/**
 * Updates the name of the sequence
 * @param name The new name of the sequence
 */
function updateSequenceName(name: string): void {
  const tempSequence = props.sequence;
  tempSequence.name = name;
  updateSequence(tempSequence);
}

/**
 * Updates the background color of the slide
 * @param color The new background color of the slide
 */
function updateSlideBackgroundColor(color: string): void {
  const tempSlide = props.slide;
  tempSlide.backgroundColor = color;
  updateSlide(tempSlide);
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
